import { EventWithRsvp } from '@/types/events';
import { Calendar, MapPin, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { rsvpAPI } from '@/lib/api';

/* ──── Status badge colours ──── */
const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  UPCOMING: {
    bg: 'bg-[var(--color-primary)]/10',
    text: 'text-[var(--color-primary)]',
    dot: 'bg-[var(--color-primary)]',
  },
  ONGOING: {
    bg: 'bg-emerald-100/80 dark:bg-emerald-900/25',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-green-500',
  },
  COMPLETED: {
    bg: 'bg-[var(--color-primary)]/10',
    text: 'text-[var(--color-primary)]',
    dot: 'bg-[var(--color-primary)]',
  },
};

export const EventCard = ({ eventWithRsvp }: { eventWithRsvp: EventWithRsvp }) => {
  const event = eventWithRsvp.event;
  const status = statusConfig[event.status] ?? statusConfig.UPCOMING;
  const statusLabel = event.status.charAt(0) + event.status.slice(1).toLowerCase();

  const formatDateInIST = (value: string | Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  };

  async function handleRsvpButton() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }
      await rsvpAPI.create(event.id);
      alert('RSVP successful!');
      window.location.reload();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || 'Failed to RSVP. Please try again.';
      alert(errorMessage);
    }
  }

  async function handleRsvpCancel() {
    try {
      if (!eventWithRsvp.rsvp?.id) {
        alert('No RSVP found to cancel');
        return;
      }
      await rsvpAPI.cancel(eventWithRsvp.rsvp.id);
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel RSVP. Please try again.');
    }
  }

  return (
    <div className="group rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-card)] shadow-[0_1px_3px_rgba(15,23,42,0.08),0_10px_24px_rgba(15,23,42,0.05)] hover:shadow-[0_4px_14px_rgba(15,23,42,0.1),0_16px_32px_rgba(15,23,42,0.08)] hover:border-[var(--color-primary)]/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top accent strip */}
      <div
        className={`h-[20px] w-full ${
          event.status === 'ONGOING'
            ? 'bg-emerald-500'
            : 'bg-[var(--color-primary)]'
        }`}
      />

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title + Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold text-[var(--color-text-primary)] leading-snug tracking-tight line-clamp-2 break-words">
              {event.title}
            </h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg border text-[11px] font-semibold tracking-wide ${status.bg} ${status.text} border-current/20`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {statusLabel}
          </span>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)]/40 px-3 py-2.5 mb-3.5">
          <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Description</p>
          <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
            {event.description || 'No description available.'}
          </p>
        </div>

        {/* Meta info */}
        <div className="space-y-2.5 mb-4.5 mt-auto">
          <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)]/35 px-3 py-2.5">
            <p className="text-[11px] font-medium text-[var(--color-text-muted)] inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Date (IST)
            </p>
            <div className="w-full rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-card)] mt-2 px-3 py-2.5 text-center">
              <p className="text-[13px] font-semibold text-[var(--color-text-primary)] leading-relaxed break-words">
                {formatDateInIST(event.startDate)} - {formatDateInIST(event.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[13px] text-[var(--color-text-secondary)] rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)]/30 px-3 py-2.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)]/35 px-3 py-2.5">
              <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <div className="leading-none">
                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">Credits</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-1">{event.credits}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface)]/35 px-3 py-2.5">
              <Users className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <div className="leading-none">
                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)]">Capacity</p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-1">{event.capacity <= 0 ? 'Full' : event.capacity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-border-light)] -mx-4 sm:-mx-5 mb-3.5" />

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {event.status === 'COMPLETED' ? (
            <button
              disabled
              className="w-full py-2.5 rounded-xl text-sm font-medium bg-[var(--color-surface)] text-[var(--color-text-muted)] cursor-not-allowed"
            >
              Completed
            </button>
          ) : eventWithRsvp.rsvp ? (
            <button
              onClick={handleRsvpCancel}
              className={`w-full py-2.5 rounded-xl text-sm font-medium border border-[var(--color-border)] transition-colors ${
                eventWithRsvp.rsvp.status === 'WAITLISTED' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
              }`}
            >
              {eventWithRsvp.rsvp.status === 'WAITLISTED' ? 'Leave Waitlist' : 'Cancel RSVP'}
            </button>
          ) : (
            <button
              onClick={handleRsvpButton}
              className={`w-full py-2.5 rounded-xl text-sm font-medium text-white transition-colors shadow-sm ${
                 'bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)]'
              }`}
            >
              RSVP
            </button>
          )}
          <Link
            href={`/student/events/${event.id}`}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
