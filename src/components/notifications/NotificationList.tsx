"use client";

import { useState, useEffect } from 'react';
import { notificationAPI } from '@/lib/api';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import { Bell, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'all' | 'unread'>('all');
    const role = useAuthStore((state) => state.role);

    useEffect(() => {
        if (role === 'student') {
            fetchNotifications();
        }
    }, [role]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch more notifications for the full page view
            const response = await notificationAPI.getAll({ limit: 50 });
            if (response.data?.success && response.data.data) {
                setNotifications(response.data.data as Notification[]);
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications(notifications.map(n =>
                n.id === notificationId ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filteredNotifications = view === 'unread'
        ? notifications.filter((n) => !n.read)
        : notifications;

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-[var(--color-card)] border border-[var(--color-border-light)] rounded-2xl p-4 animate-pulse shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                            <div className="h-3 w-20 bg-[var(--color-surface)] rounded mb-3" />
                            <div className="h-6 w-14 bg-[var(--color-surface)] rounded" />
                        </div>
                    ))}
                </div>
                <div className="bg-[var(--color-card)] border border-[var(--color-border-light)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="p-4 animate-pulse">
                            <div className="h-4 bg-[var(--color-surface)] w-1/4 mb-2 rounded" />
                            <div className="h-3 bg-[var(--color-surface)] w-3/4 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-14 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={fetchNotifications}
                    className="text-[var(--color-primary)] hover:underline font-medium"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[var(--color-card)] border border-[var(--color-border-light)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Total Notifications</p>
                    <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{notifications.length}</p>
                </div>
                <div className="bg-[var(--color-card)] border border-[var(--color-border-light)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Unread</p>
                    <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">{unreadCount}</p>
                </div>
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border-light)] rounded-2xl p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView('all')}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            view === 'all'
                                ? 'bg-[var(--color-button-primary)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                    >
                        <Eye className="w-4 h-4" />
                        All
                    </button>
                    <button
                        onClick={() => setView('unread')}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            view === 'unread'
                                ? 'bg-[var(--color-button-primary)] text-white'
                                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                    >
                        <EyeOff className="w-4 h-4" />
                        Unread
                    </button>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-[var(--color-primary)] hover:opacity-90 font-semibold"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-14 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                    <Bell className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">No notifications</h3>
                    <p className="text-[var(--color-text-muted)] mt-1">You're all caught up!</p>
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-14 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                    <EyeOff className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-60" />
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">No unread notifications</h3>
                    <p className="text-[var(--color-text-muted)] mt-1">Switch to All to review earlier updates.</p>
                </div>
            ) : (
                <div className="bg-[var(--color-card)] border border-[var(--color-border-light)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)]">
                    {filteredNotifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
