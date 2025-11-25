import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';
import { X, Upload, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImageUploadErrorHandlerProps {
  error: string | null;
  onDismiss: () => void;
  onRetry?: () => void;
  showRetry?: boolean;
}

type ErrorType = 'size' | 'format' | 'count' | 'network' | 'database' | 'unknown';

export const ImageUploadErrorHandler: React.FC<ImageUploadErrorHandlerProps> = ({
  error,
  onDismiss,
  onRetry,
  showRetry = true
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!error) return null;

  const getErrorType = (errorMessage: string): ErrorType => {
    const lowerError = errorMessage.toLowerCase();
    
    if (lowerError.includes('size') || lowerError.includes('large') || lowerError.includes('mb')) {
      return 'size';
    }
    if (lowerError.includes('type') || lowerError.includes('format') || lowerError.includes('jpeg') || lowerError.includes('png')) {
      return 'format';
    }
    if (lowerError.includes('maximum') || lowerError.includes('count') || lowerError.includes('images')) {
      return 'count';
    }
    if (lowerError.includes('network') || lowerError.includes('connection') || lowerError.includes('timeout')) {
      return 'network';
    }
    if (lowerError.includes('database') || lowerError.includes('supabase')) {
      return 'database';
    }
    return 'unknown';
  };

  const errorType = getErrorType(error);

  const getErrorInfo = (type: ErrorType) => {
    const isArabic = isRTL;
    
    switch (type) {
      case 'size':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          title: isArabic ? 'حجم الملف كبير جداً' : 'File Size Too Large',
          description: isArabic 
            ? 'حجم الصورة يتجاوز الحد المسموح به (5MB). يرجى ضغط الصورة قبل رفعها.'
            : 'Image size exceeds the allowed limit (5MB). Please compress the image before uploading.',
          solutions: isArabic ? [
            'استخدم برنامج ضغط الصور',
            'قل جودة الصورة إلى 80%',
            'اقطع الصورة إلى أبعاد أصغر',
            'استخدم صيغة JPEG بدلاً من PNG'
          ] : [
            'Use image compression software',
            'Reduce image quality to 80%',
            'Crop image to smaller dimensions',
            'Use JPEG format instead of PNG'
          ]
        };
      
      case 'format':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
          title: isArabic ? 'صيغة الملف غير مدعومة' : 'Unsupported File Format',
          description: isArabic
            ? 'صيغة الملف غير مدعومة. الصيغ المسموحة: JPEG, PNG, WebP'
            : 'File format not supported. Allowed formats: JPEG, PNG, WebP',
          solutions: isArabic ? [
            'حول الملف إلى صيغة JPEG',
            'حول الملف إلى صيغة PNG',
            'استخدم محرر الصور لتغيير الصيغة'
          ] : [
            'Convert file to JPEG format',
            'Convert file to PNG format',
            'Use image editor to change format'
          ]
        };
      
      case 'count':
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          title: isArabic ? 'تجاوز عدد الصور المسموح' : 'Image Limit Exceeded',
          description: isArabic
            ? 'لقد وصلت إلى الحد الأقصى لعدد الصور. الحد الأقصى: 3 صور مباشرة أو 10 روابط'
            : 'You have reached the maximum number of images. Limit: 3 direct uploads or 10 URLs',
          solutions: isArabic ? [
            'استخدم تبويب "إضافة رابط" لإضافة المزيد من الصور',
            'احذف بعض الصور الحالية',
            'استخدم روابط الصور من الإنترنت'
          ] : [
            'Use "Add URL" tab to add more images',
            'Delete some current images',
            'Use image URLs from the internet'
          ]
        };
      
      case 'network':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          title: isArabic ? 'مشكلة في الاتصال' : 'Network Connection Issue',
          description: isArabic
            ? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت'
            : 'Failed to connect to server. Please check your internet connection',
          solutions: isArabic ? [
            'تحقق من اتصال الإنترنت',
            'أعد تحميل الصفحة',
            'جرب لاحقاً'
          ] : [
            'Check internet connection',
            'Reload the page',
            'Try again later'
          ]
        };
      
      case 'database':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
          title: isArabic ? 'خطأ في قاعدة البيانات' : 'Database Error',
          description: isArabic
            ? 'فشل في حفظ البيانات. قد يكون السبب حجم الصور الكبير'
            : 'Failed to save data. This might be due to large image sizes',
          solutions: isArabic ? [
            'قل عدد الصور المرفوعة',
            'استخدم روابط الصور بدلاً من الرفع المباشر',
            'ضغط الصور قبل الرفع'
          ] : [
            'Reduce number of uploaded images',
            'Use image URLs instead of direct upload',
            'Compress images before uploading'
          ]
        };
      
      default:
        return {
          icon: <AlertTriangle className="w-5 h-5 text-gray-500" />,
          title: isArabic ? 'خطأ غير معروف' : 'Unknown Error',
          description: isArabic
            ? 'حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى'
            : 'An error occurred while uploading the image. Please try again',
          solutions: isArabic ? [
            'أعد تحميل الصفحة',
            'جرب صورة أخرى',
            'تواصل مع الدعم الفني'
          ] : [
            'Reload the page',
            'Try a different image',
            'Contact technical support'
          ]
        };
    }
  };

  const errorInfo = getErrorInfo(errorType);

  return (
    <Alert className="relative border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
      <div className="flex items-start gap-3">
        {errorInfo.icon}
        <div className="flex-1 min-w-0">
          <AlertTitle className="text-red-800 dark:text-red-200">
            {errorInfo.title}
          </AlertTitle>
          <AlertDescription className="mt-2 text-red-700 dark:text-red-300">
            {errorInfo.description}
          </AlertDescription>
          
          {/* Solutions */}
          <div className="mt-4 space-y-2">
            <p className={`font-medium text-sm text-red-800 dark:text-red-200 ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'الحلول المقترحة:' : 'Suggested Solutions:'}
            </p>
            <ul className={`space-y-1 text-sm text-red-700 dark:text-red-300 ${isRTL ? 'pr-6 text-right' : 'pl-6 text-left'}`}>
              {errorInfo.solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {solution}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            {showRetry && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isRTL ? 'إعادة المحاولة' : 'Retry'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
};

// Success notification for successful uploads
export const ImageUploadSuccess: React.FC<{
  message?: string;
  onDismiss?: () => void;
}> = ({ message, onDismiss }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const defaultMessage = isRTL 
    ? 'تم رفع الصورة بنجاح!' 
    : 'Image uploaded successfully!';

  return (
    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div className="flex-1">
          <AlertDescription className="text-green-700 dark:text-green-300">
            {message || defaultMessage}
          </AlertDescription>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="mt-2 h-8 px-2 text-green-700 hover:text-green-800 dark:text-green-300 dark:hover:text-green-200"
            >
              <X className="w-3 h-3 mr-1" />
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
};