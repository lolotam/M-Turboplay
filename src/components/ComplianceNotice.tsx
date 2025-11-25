import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ComplianceNotice = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-16 bg-gradient-to-r from-card/50 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Compliance Alert */}
          <Alert className="mb-8 border-success/30 bg-success/10">
            <Shield className="h-5 w-5 text-success" />
            <AlertDescription className="text-lg font-medium text-success">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">{t('compliance.title')}</span>
              </div>
              {t('compliance.description')}
            </AlertDescription>
          </Alert>

          {/* Detailed Explanation */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* What We Do */}
            <div className="game-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-success to-accent rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-success">{t('compliance.whatWeDo')}</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {t('compliance.whatWeDoList', { returnObjects: true }).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What We Don't Do */}
            <div className="game-card border-warning/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-warning to-destructive rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-warning">{t('compliance.whatWeDont')}</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {t('compliance.whatWeDontList', { returnObjects: true }).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policy Statement */}
          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
            <h4 className="text-lg font-bold mb-3 text-center">{t('compliance.commitment')}</h4>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {t('compliance.commitmentDesc')}
            </p>
          </div>

          {/* English Translation */}
          {isRTL && (
            <div className="mt-6 p-4 bg-muted/30 rounded-xl">
              <p className="text-xs text-muted-foreground italic text-center">
                {t('compliance.english')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComplianceNotice;