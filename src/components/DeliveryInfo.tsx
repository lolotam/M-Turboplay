import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Download, MessageCircle, Clock, MapPin, CreditCard } from "lucide-react";
import { useTranslation } from 'react-i18next';

const DeliveryInfo = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const deliveryMethods = [
    {
      icon: Download,
      titleKey: 'deliveryInfo.digital.title',
      descKey: 'deliveryInfo.digital.desc',
      timeKey: 'deliveryInfo.digital.time',
      type: 'digital'
    },
    {
      icon: Truck,
      titleKey: 'deliveryInfo.physical.title', 
      descKey: 'deliveryInfo.physical.desc',
      timeKey: 'deliveryInfo.physical.time',
      type: 'physical'
    },
    {
      icon: MessageCircle,
      titleKey: 'deliveryInfo.consultation.title',
      descKey: 'deliveryInfo.consultation.desc', 
      timeKey: 'deliveryInfo.consultation.time',
      type: 'consultation'
    }
  ];

  const steps = [
    {
      icon: CreditCard,
      titleKey: 'deliveryInfo.steps.payment.title',
      descKey: 'deliveryInfo.steps.payment.desc'
    },
    {
      icon: MessageCircle,
      titleKey: 'deliveryInfo.steps.confirmation.title',
      descKey: 'deliveryInfo.steps.confirmation.desc'
    },
    {
      icon: Truck,
      titleKey: 'deliveryInfo.steps.delivery.title',
      descKey: 'deliveryInfo.steps.delivery.desc'
    }
  ];

  return (
    <section id="delivery-info" className="py-16 bg-gradient-to-r from-background to-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {isRTL ? 'كيف تستلم؟' : 'How to Receive?'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-baloo text-gradient">
            {t('deliveryInfo.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('deliveryInfo.subtitle')}
          </p>
        </div>

        {/* Delivery Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {deliveryMethods.map((method, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <method.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{t(method.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{t(method.descKey)}</p>
                <Badge variant="outline" className="text-sm">
                  <Clock className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t(method.timeKey)}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">{t('deliveryInfo.processTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-accent-foreground">
                    {index + 1}
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{t(step.titleKey)}</h4>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                {t('deliveryInfo.contactTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{t('deliveryInfo.location')}</p>
              <p className="text-sm text-muted-foreground">{t('deliveryInfo.contactDesc')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DeliveryInfo;
