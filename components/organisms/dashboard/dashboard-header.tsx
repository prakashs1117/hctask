import { Badge } from "@/components/atoms/badge";
import { Activity, Calendar, MapPin } from "lucide-react";
import { useTranslation, TRANSLATION_KEYS } from "@/lib/i18n";

export function DashboardHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <p className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t(TRANSLATION_KEYS.DASHBOARD.SUBTITLE)}</span>
            <span className="sm:hidden">{t(TRANSLATION_KEYS.DASHBOARD.SUBTITLE_SHORT)}</span>
            <span className="hidden md:inline">
              • {t(TRANSLATION_KEYS.DASHBOARD.LAST_UPDATED, { date: new Date().toLocaleDateString() })}
            </span>
          </p>
        </div>
      </div>
      <Badge variant="outline" className="gap-1">
        <MapPin className="h-3 w-3" />
        {t(TRANSLATION_KEYS.DASHBOARD.OVERVIEW)}
      </Badge>
    </div>
  );
}
