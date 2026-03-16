"use client";

import { Megaphone } from 'lucide-react';
import { AnnouncementList } from '@/components/announcements/AnnouncementList';

export default function StudentAnnouncementsPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">Announcements</h1>
              <p className="text-sm md:text-base text-[var(--color-text-muted)] mt-1">Stay updated with the latest news and information</p>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <AnnouncementList />
      </div>
    </main>
  );
}


