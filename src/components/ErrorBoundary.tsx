import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, errorInfo);
    }
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4" role="alert" aria-live="polite">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                حدث خطأ غير متوقع
              </h1>
              <p className="text-muted-foreground mb-6">
                نعتذر، لقد حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.
              </p>
              {/* Add helpful suggestions based on error type */}
              {this.state.error?.name === 'ChunkLoadError' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 This might be a network issue. Please check your internet connection and try refreshing the page.
                  </p>
                </div>
              )}
              {this.state.error?.message?.includes('Network') && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    🌐 Network connection issue. Please check your internet connection and try again.
                  </p>
                </div>
              )}
            </div>

            {this.props.showDetails && this.state.error && (
              <Alert className="bg-destructive/10 border-destructive/20">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  <strong>Error:</strong> {this.state.error.message}
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">
                        Technical Details
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                المحاولة مرة أخرى
              </Button>
              
              <Button 
                onClick={this.handleRefresh} 
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة تحميل الصفحة
              </Button>
              
              <Button 
                onClick={this.handleGoHome} 
                variant="ghost"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                إذا استمر الخطأ، يرجى التواصل مع الدعم الفني
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook-based error boundary for functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // Could dispatch to a global error state or show toast
    throw error; // Re-throw to let ErrorBoundary catch it
  };
};

// Higher-order component for easy wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};