"use client";

import { Notification, NotificationType } from '@/types/notification';
import {
  Bell,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trophy,
  Users,
  Megaphone
} from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  compact?: boolean;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  EVENT_REMINDER: <Calendar className="w-5 h-5 text-[var(--color-info)]" />,
  EVENT_CREATED: <Calendar className="w-5 h-5 text-green-500" />,
  EVENT_UPDATED: <Calendar className="w-5 h-5 text-yellow-500" />,
  EVENT_CANCELLED: <AlertCircle className="w-5 h-5 text-red-500" />,
  RSVP_CONFIRMED: <CheckCircle className="w-5 h-5 text-green-500" />,
  WAITLIST_PROMOTED: <Users className="w-5 h-5 text-purple-500" />,
  ATTENDANCE_MARKED: <CheckCircle className="w-5 h-5 text-[var(--color-info)]" />,
  ANNOUNCEMENT: <Megaphone className="w-5 h-5 text-orange-500" />,
  ACHIEVEMENT: <Trophy className="w-5 h-5 text-yellow-500" />,
  GENERAL: <Bell className="w-5 h-5 text-[var(--color-text-muted)]" />,
};

export function NotificationItem({ notification, onMarkAsRead, compact = false }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-colors ${compact ? 'p-3.5' : 'p-4 md:p-4.5'} hover:bg-[var(--color-surface-hover)]/60 ${!notification.read ? 'bg-[var(--color-primary)]/5' : ''
        }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {notificationIcons[notification.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`${compact ? 'text-[13px]' : 'text-sm'} text-[var(--color-text-primary)] font-medium ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-[var(--color-button-primary)] rounded-full flex-shrink-0 mt-1.5" />
            )}
          </div>
          <p className={`${compact ? 'text-xs' : 'text-sm'} text-[var(--color-text-muted)] mt-1 line-clamp-2`}>
            {notification.message}
          </p>
          <p className='text-xs text-[var(--color-text-muted)] mt-2' suppressHydrationWarning>
            {formatDistanceToNow(new Date(notification.createdAt ?? notification.sentAt))}
          </p>
        </div>
      </div>
    </div>
  );
}


