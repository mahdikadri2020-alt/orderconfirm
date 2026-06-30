"use client";

import { cn, formatDate } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Package, Send, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { OrderActivity } from "@/types";

interface OrderTimelineProps {
  activities: OrderActivity[];
  currentStatus?: string;
}

const activityIcons: Record<string, React.ComponentType<{ size?: number | string }>> = {
  created: Package,
  message_sent: Send,
  reminder_sent: AlertTriangle,
  customer_confirmed: CheckCircle2,
  customer_cancelled: XCircle,
  no_response: Clock,
};

const activityColors: Record<string, string> = {
  created: "bg-blue-500",
  message_sent: "bg-whatsapp-500",
  reminder_sent: "bg-amber-500",
  customer_confirmed: "bg-emerald-500",
  customer_cancelled: "bg-red-500",
  no_response: "bg-gray-500",
};

export function OrderTimeline({ activities }: OrderTimelineProps) {
  const { lang } = useTranslation();

  return (
    <div className="space-y-0">
      {activities.length === 0 ? (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-whatsapp-100 dark:bg-whatsapp-900/30 flex items-center justify-center">
            <Package size={16} className="text-whatsapp-600 dark:text-whatsapp-400" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {lang === "fr" ? "Commande créée" : "تم إنشاء الطلب"}
            </p>
          </div>
        </div>
      ) : (
        activities.map((activity, i) => {
          const Icon = activityIcons[activity.activity_type] || Package;
          const color = activityColors[activity.activity_type] || "bg-gray-500";
          return (
            <div key={activity.id} className="flex gap-3 pb-6 relative last:pb-0">
              <div className="flex flex-col items-center">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", color)}>
                  <Icon size={16} />
                </div>
                {i < activities.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-2">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(activity.created_at)}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
