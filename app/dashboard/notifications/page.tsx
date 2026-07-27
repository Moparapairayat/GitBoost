"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Award, MessageCircle, Star, TrendingUp, Megaphone } from "lucide-react";

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  review: Star,
  comment: MessageCircle,
  badge: Award,
  challenge: TrendingUp,
  featured: TrendingUp,
  announcement: Megaphone,
};

interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/notifications");
        const json = await res.json();
        if (json.success) {
          setNotifications(json.data ?? []);
          setUnreadCount(json.data?.filter((n: Notification) => !n.is_read).length ?? 0);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Loading notifications...</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, i) => {
            const Icon = NOTIFICATION_ICONS[notification.type] || Bell;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all"
                style={{
                  background: notification.is_read ? "hsl(var(--card))" : "hsl(var(--primary) / 0.03)",
                  border: `1px solid ${notification.is_read ? "hsl(var(--border))" : "hsl(var(--primary) / 0.15))"}`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">{notification.title}</p>
                  {notification.body && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{notification.body}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>

                {!notification.is_read && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: "hsl(var(--primary))" }} />
                )}
              </motion.div>
            );
          })}

          {!notifications.length && (
            <div className="text-center py-16 rounded-2xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">We&apos;ll notify you when something happens</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
