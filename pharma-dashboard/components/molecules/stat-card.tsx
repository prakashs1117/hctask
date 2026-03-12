import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  description?: string;
  bgColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-muted-foreground",
  valueColor,
  description,
  bgColor,
}: StatCardProps) {
  const enhanced = !!bgColor;

  return (
    <Card className={enhanced ? "relative overflow-hidden hover:shadow-md transition-shadow" : "overflow-hidden"}>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${enhanced ? "pb-3" : "pb-2"}`}>
        {enhanced ? (
          <>
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <div className={`text-xl font-semibold ${valueColor || ""}`}>{value}</div>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </>
        ) : (
          <>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </>
        )}
      </CardHeader>
      <CardContent className={enhanced ? "" : "pt-0"}>
        {!enhanced && <div className={`text-xl font-semibold ${valueColor || ""}`}>{value}</div>}
        {description && (
          <p className="text-xs text-muted-foreground leading-tight">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
