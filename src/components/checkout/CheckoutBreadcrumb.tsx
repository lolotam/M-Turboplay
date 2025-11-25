import React from "react";
import { ChevronRight, Home, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface CheckoutBreadcrumbProps {
  currentStep: number;
  hasPhysicalItems: boolean;
  className?: string;
}

export const CheckoutBreadcrumb = ({ 
  currentStep, 
  hasPhysicalItems, 
  className 
}: CheckoutBreadcrumbProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const steps = [
    { number: 1, label: isRTL ? 'معلومات العميل' : 'Customer Info', icon: '1' },
    ...(hasPhysicalItems ? [{ number: 2, label: isRTL ? 'معلومات الشحن' : 'Shipping Info', icon: '2' }] : []),
    { number: 3, label: isRTL ? 'طريقة الدفع' : 'Payment Method', icon: hasPhysicalItems ? '3' : '2' },
    { number: 4, label: isRTL ? 'مراجعة الطلب' : 'Order Review', icon: hasPhysicalItems ? '4' : '3' },
    { number: 5, label: isRTL ? 'الدفع' : 'Payment', icon: hasPhysicalItems ? '5' : '4' },
  ];

  return (
    <div className={cn("w-full", className)}>
      {/* Main Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/cart">
                {isRTL ? 'سلة التسوق' : 'Cart'}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {isRTL ? 'إتمام الطلب' : 'Checkout'}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Checkout Steps Progress */}
      <div className="w-full">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    step.number < currentStep
                      ? "bg-green-500 text-white"
                      : step.number === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.number < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                
                {/* Step Label */}
                <span
                  className={cn(
                    "mt-2 text-xs text-center max-w-20 transition-colors duration-300",
                    step.number <= currentStep
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors duration-300",
                    step.number < currentStep
                      ? "bg-green-500"
                      : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckoutBreadcrumb;
