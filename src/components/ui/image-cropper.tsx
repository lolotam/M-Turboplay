import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Slider } from './slider';
import { RotateCcw, ZoomIn, ZoomOut, Move, Check, X } from 'lucide-react';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (croppedImageUrl: string) => void;
  aspectRatio?: number;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  isOpen,
  onClose,
  imageFile,
  onCropComplete,
  aspectRatio = 1 // Default to 1:1 (square)
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load image when file changes
  useEffect(() => {
    if (imageFile && isOpen) {
      const img = new Image();
      img.onload = () => {
        setImage(img);

        // Calculate initial crop area for 1:1 aspect ratio
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        setCropArea({ x, y, width: size, height: size });
        setScale(1);
        setPosition({ x: 0, y: 0 });
      };
      img.src = URL.createObjectURL(imageFile);
    }
  }, [imageFile, isOpen]);

  // Draw image and crop area
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size to display size
      const displaySize = 400;
      canvas.width = displaySize;
      canvas.height = displaySize;

      // Clear canvas
      ctx.clearRect(0, 0, displaySize, displaySize);

      // Calculate scaled dimensions
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      const offsetX = position.x + (displaySize - scaledWidth) / 2;
      const offsetY = position.y + (displaySize - scaledHeight) / 2;

      // Draw the image
      ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);

      // Draw crop area overlay
      const cropX = (cropArea.x * scale + offsetX);
      const cropY = (cropArea.y * scale + offsetY);
      const cropWidth = cropArea.width * scale;
      const cropHeight = cropArea.height * scale;

      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, displaySize, displaySize);

      // Clear crop area
      ctx.clearRect(cropX, cropY, cropWidth, cropHeight);

      // Draw crop area border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

      // Draw corner handles
      ctx.fillStyle = '#ffffff';
      const handleSize = 8;
      const handles = [
        { x: cropX, y: cropY }, // top-left
        { x: cropX + cropWidth, y: cropY }, // top-right
        { x: cropX, y: cropY + cropHeight }, // bottom-left
        { x: cropX + cropWidth, y: cropY + cropHeight } // bottom-right
      ];

      handles.forEach(handle => {
        ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
      });
    }
  }, [image, cropArea, scale, position]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on crop area border or handles
    const cropX = (cropArea.x * scale + position.x + (400 - image!.width * scale) / 2);
    const cropY = (cropArea.y * scale + position.y + (400 - image!.height * scale) / 2);
    const cropWidth = cropArea.width * scale;
    const cropHeight = cropArea.height * scale;

    const tolerance = 10;

    if (
      x >= cropX - tolerance && x <= cropX + cropWidth + tolerance &&
      y >= cropY - tolerance && y <= cropY + cropHeight + tolerance
    ) {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  }, [cropArea, scale, position, image]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = (x - dragStart.x) / scale;
    const deltaY = (y - dragStart.y) / scale;

    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(prev.x + deltaX, image.width - prev.width)),
      y: Math.max(0, Math.min(prev.y + deltaY, image.height - prev.height))
    }));

    setDragStart({ x, y });
  }, [isDragging, dragStart, scale, image]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleRotate = () => {
    if (!image) return;

    // Create a new image element for rotation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = image.height;
    canvas.height = image.width;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(90 * Math.PI / 180);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);

    const rotatedImage = new Image();
    rotatedImage.onload = () => {
      setImage(rotatedImage);

      // Adjust crop area after rotation
      const newWidth = rotatedImage.width;
      const newHeight = rotatedImage.height;
      const size = Math.min(newWidth, newHeight);
      const x = (newWidth - size) / 2;
      const y = (newHeight - size) / 2;

      setCropArea({ x, y, width: size, height: size });
    };
    rotatedImage.src = canvas.toDataURL();
  };

  const handleCrop = () => {
    if (!image || !canvasRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to crop area
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    // Draw the cropped portion
    ctx.drawImage(
      image,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      0, 0, cropArea.width, cropArea.height
    );

    // Convert to blob and then to data URL
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          onCropComplete(reader.result as string);
          onClose();
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  const resetCrop = () => {
    if (!image) return;

    const size = Math.min(image.width, image.height);
    const x = (image.width - size) / 2;
    const y = (image.height - size) / 2;

    setCropArea({ x, y, width: size, height: size });
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen || !image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Crop Image (1:1 Aspect Ratio)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 cursor-move"
              style={{ maxWidth: '400px', maxHeight: '400px' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Rotate Control */}
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Rotate
            </Button>

            {/* Reset Control */}
            <Button variant="outline" size="sm" onClick={resetCrop}>
              Reset
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleCrop}>
              <Check className="w-4 h-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};