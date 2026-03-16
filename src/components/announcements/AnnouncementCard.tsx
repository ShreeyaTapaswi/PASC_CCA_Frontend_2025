"use client";

import { Announcement, AnnouncementPriority } from '@/types/announcement';
import { Megaphone, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
  onMarkAsRead?: (id: number) => void;
}

const priorityConfig: Record<AnnouncementPriority, {
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}> = {
  LOW: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-[var(--color-surface)]/20',
    borderColor: 'border-[var(--color-border)]',
    textColor: 'text-[var(--color-text-secondary)]',
  },
  NORMAL: {
    icon: <Megaphone className="w-5 h-5" />,
    bgColor: 'bg-[var(--color-surface-hover)]/20',
    borderColor: 'border-[var(--color-info)]/40 dark:border-[var(--color-info)]/40',
    textColor: 'text-[var(--color-primary)]',
  },
  HIGH: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-300 dark:border-orange-700',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  URGENT: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-300 dark:border-red-700',
    textColor: 'text-red-700 dark:text-red-300',
  },
};

export function AnnouncementCard({ announcement, onMarkAsRead }: AnnouncementCardProps) {
  const config = priorityConfig[announcement.priority];

  const handleClick = () => {
    if (!announcement.isRead && onMarkAsRead) {
      onMarkAsRead(announcement.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] ${config.bgColor} ${config.textColor} cursor-pointer transition-all hover:shadow-md ${!announcement.isRead ? 'ring-2 ring-[var(--color-info)]/30' : ''}`}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex-shrink-0 ${config.textColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-semibold text-lg ${config.textColor}`}>
              {announcement.title}
            </h3>
            {!announcement.isRead && (
              <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-[var(--color-button-primary)] text-white rounded-full">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
            {announcement.message}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium uppercase">{announcement.priority}</span>
            <span suppressHydrationWarning>{formatDistanceToNow(new Date(announcement.createdAt))}</span>
          </div>
          {announcement.expiresAt && (
            <p className="text-xs text-muted-foreground mt-2">
              Expires: {new Date(announcement.expiresAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                timeZone: 'UTC'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
