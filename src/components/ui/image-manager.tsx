import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { FileUpload } from './file-upload';
import { ImageCropper } from './image-cropper';
import { Plus, X, Upload, Link, Crop, Eye, Star } from 'lucide-react';
import { imageUploadService, ImageUploadResult } from '@/services/imageUpload';
import { useToast } from '@/hooks/use-toast';
import { ImageUploadErrorHandler, ImageUploadSuccess } from './image-upload-error-handler';

interface ImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

interface ImageWithMetadata {
  url: string;
  isMain: boolean;
  originalName?: string;
  size?: number;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  disabled = false
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [cropImageFile, setCropImageFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [autoScrollIndex, setAutoScrollIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { toast } = useToast();

  const imagesWithMetadata: ImageWithMetadata[] = images.map((url, index) => ({
    url,
    isMain: index === 0
  }));

  // Disabled auto-scroll functionality - images stay static
  // useEffect(() => {
  //   if (images.length <= 1 || isAutoScrollPaused) {
  //     return;
  //   }

  //   const interval = setInterval(() => {
  //     setAutoScrollIndex((prevIndex) => (prevIndex + 1) % images.length);
  //   }, 2500); // Change image every 2.5 seconds

  //   return () => clearInterval(interval);
  // }, [images.length, isAutoScrollPaused]);

  // Disabled mouse events for pause/resume auto-scroll
  // const handleMouseEnter = () => {
  //   setIsAutoScrollPaused(true);
  // };

  // const handleMouseLeave = () => {
  //   setIsAutoScrollPaused(false);
  // };

  const handleAddUrlImage = () => {
    const trimmedUrl = newImageUrl.trim();
    if (!trimmedUrl) {
      setUploadError("Please enter an image URL");
      return;
    }

    // Clear previous errors
    setUploadError(null);

    // Validate URL - accept both HTTP(S) URLs and data URLs
    const isDataUrl = trimmedUrl.startsWith('data:image/');
    const isHttpUrl = trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://');

    if (!isDataUrl && !isHttpUrl) {
      setUploadError("Please enter a valid image URL (http://, https://, or data:image/)");
      return;
    }

    // For HTTP URLs, validate with URL constructor
    if (isHttpUrl) {
      try {
        new URL(trimmedUrl);
      } catch {
        setUploadError("Please enter a valid HTTP/HTTPS URL");
        return;
      }
    }

    if (images.includes(trimmedUrl)) {
      setUploadError("This image URL already exists");
      return;
    }

    if (images.length >= maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages = [...images, trimmedUrl];
    onImagesChange(newImages);
    setNewImageUrl('');

    // Show success notification
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(file => imageUploadService.uploadImage(file));
      const results = await Promise.all(uploadPromises);

      const newImageUrls = results.map(result => result.url);

      if (images.length + newImageUrls.length > maxImages) {
        toast({
          title: "Error",
          description: `Maximum ${maxImages} images allowed`,
          variant: "destructive",
        });
        return;
      }

      const newImages = [...images, ...newImageUrls];
      onImagesChange(newImages);

      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`,
      });

      // Show helpful tip for data URL limit
      const totalDataUrls = newImages.filter(url => url.startsWith('data:')).length;
      if (totalDataUrls >= 3) {
        toast({
          title: "💡 Tip: More Images Available",
          description: "You've uploaded 3 images. For additional images, use the 'Add URL' tab with web-hosted image URLs to add up to 10 total images.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleCropImage = (file: File) => {
    setCropImageFile(file);
    setIsCropperOpen(true);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (images.length >= maxImages) {
      toast({
        title: "Error",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images, croppedImageUrl];
    onImagesChange(newImages);

    toast({
      title: "Success",
      description: "Image cropped and added successfully",
    });
  };

  const removeImage = async (index: number) => {
    // Prevent deletion of the last image
    if (images.length <= 1) {
      toast({
        title: "Error",
        description: "At least one image is required for each product",
        variant: "destructive",
      });
      return;
    }

    // If deleting the main image (index 0), confirm with user
    if (index === 0) {
      const confirmDelete = window.confirm(
        "You are about to delete the main product image. The next image will become the main image. Continue?"
      );
      if (!confirmDelete) {
        return;
      }
    }

    // Set loading state
    setIsDeleting(index);

    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);

      toast({
        title: "Success",
        description: index === 0
          ? "Main image deleted. Next image is now the main image."
          : "Image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const setMainImage = (index: number) => {
    const newImages = [...images];
    const imageToMove = newImages.splice(index, 1)[0];
    newImages.unshift(imageToMove);
    onImagesChange(newImages);
  };

  const handleImageUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrlImage();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Product Images</Label>
        <p className="text-sm text-muted-foreground">
          Upload images or add image URLs. First image will be used as the main product image.
        </p>
      {/* Error Handler */}
      {uploadError && (
        <ImageUploadErrorHandler
          error={uploadError}
          onDismiss={() => setUploadError(null)}
          onRetry={() => {
            setUploadError(null);
            // Retry logic can be added here if needed
          }}
        />
      )}

      {/* Success Notification */}
      {showSuccess && (
        <ImageUploadSuccess
          message="Images processed successfully!"
          onDismiss={() => setShowSuccess(false)}
        />
      )}
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Add URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <FileUpload
            onFilesSelected={handleFileUpload}
            multiple={true}
            maxFiles={maxImages - images.length}
            disabled={disabled || images.length >= maxImages}
          />

          {images.length >= maxImages && (
            <p className="text-sm text-amber-600">
              Maximum number of images ({maxImages}) reached.
            </p>
          )}
          {images.filter(img => img.startsWith('data:')).length >= 3 && (
            <p className="text-sm text-blue-600 mt-2">
              💡 Tip: Add up to {maxImages - images.length} more images using the "Add URL" tab with web-hosted image URLs.
            </p>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={handleImageUrlKeyPress}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
              disabled={disabled || images.length >= maxImages}
            />
            <Button
              type="button"
              onClick={handleAddUrlImage}
              disabled={disabled || images.length >= maxImages || !newImageUrl.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview and Management */}
      {imagesWithMetadata.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">
              Current Images ({imagesWithMetadata.length})
            </Label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagesWithMetadata.map((imageData, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50 transition-all duration-300">
                  <img
                    src={imageData.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  />

                  {/* Main image indicator */}
                  {imageData.isMain && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Main
                      </Badge>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1">
                      {!imageData.isMain && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 px-2 text-xs"
                          onClick={() => setMainImage(index)}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Set Main
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant={imageData.isMain ? "outline" : "destructive"}
                        className={`h-6 w-6 p-0 ${imageData.isMain ? 'border-red-300 hover:bg-red-50' : ''}`}
                        onClick={() => removeImage(index)}
                        disabled={isDeleting === index}
                        title={imageData.isMain ? "Delete main image" : "Delete image"}
                      >
                        {isDeleting === index ? (
                          <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Image overlay with info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate">
                      Image {index + 1}
                      {imageData.isMain && ' (Main)'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-4xl p-4">
            <img
              src={images[selectedImageIndex]}
              alt={`Product image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setSelectedImageIndex(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Image Cropper */}
      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false);
          setCropImageFile(null);
        }}
        imageFile={cropImageFile}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
      />
    </div>
  );
};