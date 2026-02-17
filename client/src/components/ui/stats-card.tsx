import { Card, CardContent } from "@/components/ui/card";
import { ComponentType } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ComponentType<any>;
  iconBgColor: string;
  iconTextColor: string;
  size?: "default" | "compact";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconTextColor,
  size = "default",
}: StatsCardProps) {
  const isCompact = size === "compact";

  return (
    <Card>
      <CardContent className={isCompact ? "p-3" : "p-6"}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`${isCompact ? "w-9 h-9" : "w-12 h-12"} ${iconBgColor} rounded-lg flex items-center justify-center`}
            >
              <Icon className={`${iconTextColor} ${isCompact ? "text-base" : "text-xl"}`} />
            </div>
          </div>
          <div className={isCompact ? "ml-3" : "ml-4"}>
            <p className={`${isCompact ? "text-xs" : "text-sm"} font-medium text-muted-foreground`}>{title}</p>
            <p className={`${isCompact ? "text-lg" : "text-2xl"} font-bold text-foreground`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
