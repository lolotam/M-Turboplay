export interface ImageUploadResult {
  url: string;
  thumbnailUrl: string;
  originalName: string;
  size: number;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface ImageCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

class ImageUploadService {
  private readonly DEFAULT_OPTIONS: ImageUploadOptions = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    quality: 0.9,
    generateThumbnail: true,
    thumbnailSize: 300
  };

  /**
   * Process and upload an image file
   */
  async uploadImage(file: File, options: ImageUploadOptions = {}): Promise<ImageUploadResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    // Validate file
    this.validateFile(file, opts);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `product_${timestamp}_${Math.random().toString(36).substring(2)}.${extension}`;

    try {
      // For now, we'll use base64 data URLs for local storage
      // In production, you'd upload to a cloud service or save to server
      const processedImage = await this.processImage(file, opts);

      return {
        url: processedImage.dataUrl,
        thumbnailUrl: processedImage.thumbnailDataUrl || processedImage.dataUrl,
        originalName: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process multiple images
   */
  async uploadMultipleImages(files: FileList | File[], options?: ImageUploadOptions): Promise<ImageUploadResult[]> {
    const fileArray = Array.from(files);
    const results: ImageUploadResult[] = [];

    for (const file of fileArray) {
      try {
        const result = await this.uploadImage(file, options);
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files
      }
    }

    if (results.length === 0) {
      throw new Error('No images were successfully uploaded');
    }

    return results;
  }

  /**
   * Crop image to 1:1 aspect ratio
   */
  async cropImageToSquare(file: File, cropArea?: ImageCropArea): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          const size = Math.min(img.width, img.height);
          const x = cropArea ? cropArea.x : (img.width - size) / 2;
          const y = cropArea ? cropArea.y : (img.height - size) / 2;

          canvas.width = size;
          canvas.height = size;

          if (ctx) {
            ctx.drawImage(
              img,
              x, y, size, size,
              0, 0, size, size
            );

            canvas.toBlob((blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Failed to convert cropped image'));
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('Failed to create blob from cropped image'));
              }
            }, 'image/jpeg', 0.9);
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: File, options: ImageUploadOptions): void {
    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      throw new Error(`File size must be less than ${Math.round(options.maxSize / 1024 / 1024)}MB`);
    }

    // Check file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
    }
  }

  /**
   * Process image (resize, optimize, generate thumbnail)
   */
  private async processImage(file: File, options: ImageUploadOptions): Promise<{
    dataUrl: string;
    thumbnailDataUrl?: string;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          // Calculate new dimensions (maintain aspect ratio, max 1200px)
          const maxDimension = 1200;
          let { width, height } = img;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result as string;

                // Generate thumbnail if requested
                if (options.generateThumbnail) {
                  this.generateThumbnail(img, options.thumbnailSize || 300)
                    .then(thumbnailDataUrl => {
                      resolve({ dataUrl, thumbnailDataUrl });
                    })
                    .catch(() => {
                      // If thumbnail generation fails, just return main image
                      resolve({ dataUrl });
                    });
                } else {
                  resolve({ dataUrl });
                }
              };
              reader.onerror = () => reject(new Error('Failed to process image'));
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to create blob from processed image'));
            }
          }, 'image/jpeg', options.quality || 0.9);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for processing'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate thumbnail
   */
  private async generateThumbnail(img: HTMLImageElement, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context for thumbnail'));
        return;
      }

      // Calculate thumbnail dimensions (square)
      const minDimension = Math.min(img.width, img.height);
      const x = (img.width - minDimension) / 2;
      const y = (img.height - minDimension) / 2;

      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(
        img,
        x, y, minDimension, minDimension,
        0, 0, size, size
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to generate thumbnail'));
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to create thumbnail blob'));
        }
      }, 'image/jpeg', 0.8);
    });
  }

  /**
   * Delete uploaded image (cleanup)
   */
  deleteImage(url: string): void {
    // For data URLs, we can't actually delete them from storage
    // In a real implementation, you'd call your storage service's delete method
    console.log('Image deleted (data URL cleanup):', url);
  }
}

export const imageUploadService = new ImageUploadService();