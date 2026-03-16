"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  BarChart3,
  Megaphone,
  Plus,
  CheckCircle,
  UserCheck,
  TrendingUp,
  Activity,
  Star,
  Award,
} from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { analyticsAPI } from "@/lib/api";
import { DashboardAnalytics } from "@/types/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

// ─── Mapper ────────────────────────────────────────────────────────────────

function mapDashboardAnalytics(apiData: any): DashboardAnalytics {
  return {
    totalEvents: apiData.overview.totalEvents,
    totalUsers: apiData.overview.totalUsers,
    totalRsvps: apiData.overview.totalRSVPs,
    totalAttendance: apiData.overview.totalAttendances,
    totalCreditsDistributed: 0,
    averageEventRating: apiData.overview.averageEventRating ?? 0,

    upcomingEvents: apiData.eventsByStatus?.UPCOMING ?? 0,
    ongoingEvents: apiData.eventsByStatus?.ONGOING ?? 0,
    completedEvents: apiData.eventsByStatus?.COMPLETED ?? 0,

    topEvents: (apiData.topEvents ?? []).map((e: any) => ({
      id: e.id,
      title: e.title,
      attendanceCount: e.totalAttendance,
      rating: e.rating ?? 0,
    })),

    recentActivity: (apiData.recentEvents ?? []).map((e: any) => ({
      type: "EVENT",
      description: `${e.title} (${e.status})`,
      timestamp: e.startDate,
    })),
  };
}

// ─── MetricCard ────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  loading: boolean;
  color: string;
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  loading,
  color,
}: MetricCardProps) {
  if (loading) {
    return (
      <div className={`${color} rounded-xl p-6 border border-border`}>
        <Skeleton className="h-6 w-6 mb-3" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div className={`${color} rounded-xl p-6 border border-border`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsAPI.getAdminDashboard();
      console.log("RAW API DATA 👉", res.data?.data);
      if (res.data?.success && res.data.data) {
        setAnalytics(mapDashboardAnalytics(res.data.data));
      } else {
        throw new Error("Invalid analytics response");
      }
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError("Failed to fetch analytics data.");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const attendanceRate = (analytics as any)?.overview?.attendanceRate ?? 0;

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into CCA activities
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="outline"
              onClick={fetchAnalytics}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/announcements")}
              className="flex items-center gap-2"
            >
              <Megaphone className="h-4 w-4" />
              Announcements
            </Button>
            <Button
              className="bg-[var(--color-button-primary)] hover:bg-[var(--color-button-primary-hover)] text-white flex items-center gap-2"
              onClick={() => router.push("/admin/createEvent")}
            >
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>

        {/* ── Top Stats Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Events"
            value={analytics?.totalEvents ?? 0}
            Icon={Calendar}
          />
          <StatsCard
            title="Total Students"
            value={analytics?.totalUsers ?? 0}
            Icon={Users}
          />
          <StatsCard
            title="Total RSVPs"
            value={analytics?.totalRsvps ?? 0}
            Icon={UserCheck}
          />
          <StatsCard
            title="Total Attendances"
            value={analytics?.totalAttendance ?? 0}
            Icon={CheckCircle}
          />
        </div>

        {/* ── Quick Summary Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-[var(--color-surface-hover)] to-[var(--color-surface)] dark:from-[var(--color-surface)]/20 dark:to-[var(--color-surface-hover)]/20 rounded-xl p-6 border border-[var(--color-info)]/30 dark:border-[var(--color-info)]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Active Events
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {(analytics?.upcomingEvents ?? 0) +
                    (analytics?.ongoingEvents ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ongoing + Upcoming
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-[var(--color-info)] opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {(analytics?.averageEventRating ?? 0).toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Overall event rating
                </p>
              </div>
              <Star className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Calendar className="w-6 h-6 text-[var(--color-info)]" />}
            title="Total Events"
            value={(analytics?.totalEvents ?? 0).toString()}
            subtitle={`${analytics?.upcomingEvents ?? 0} upcoming`}
            loading={false}
            color="bg-[var(--color-surface-hover)]/20"
          />
          <MetricCard
            icon={<Users className="w-6 h-6 text-green-500" />}
            title="Total Students"
            value={(analytics?.totalUsers ?? 0).toString()}
            subtitle={`${analytics?.totalRsvps ?? 0} RSVPs`}
            loading={false}
            color="bg-green-50 dark:bg-green-950/20"
          /> */}
          <MetricCard
            icon={<Award className="w-6 h-6 text-yellow-500" />}
            title="Credits Distributed"
            value={(analytics?.totalCreditsDistributed ?? 0).toString()}
            subtitle={`${analytics?.totalAttendance ?? 0} attendances`}
            loading={false}
            color="bg-yellow-50 dark:bg-yellow-950/20"
          />
          {/* <MetricCard
            icon={<Star className="w-6 h-6 text-purple-500" />}
            title="Average Rating"
            value={(analytics?.averageEventRating ?? 0).toFixed(1)}
            subtitle="Overall event rating"
            loading={false}
            color="bg-purple-50 dark:bg-purple-950/20"
          />
        </div> */}

        {/* ── Event Status Breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Upcoming Events</h3>
              <div className="w-12 h-12 bg-[var(--color-surface-hover)]/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {analytics?.upcomingEvents ?? 0}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Ongoing Events</h3>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {analytics?.ongoingEvents ?? 0}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Completed Events</h3>
              <div className="w-12 h-12 bg-[var(--color-surface)]/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[var(--color-text-muted)]" />
              </div>
            </div>
            <p className="text-4xl font-bold text-foreground">
              {analytics?.completedEvents ?? 0}
            </p>
          </div>
        </div>

        {/* ── Top Performing Events ── */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Top Performing Events</h3>
          </div>

          {analytics?.topEvents && analytics.topEvents.length > 0 ? (
            <div className="space-y-3">
              {analytics.topEvents.map((event: any, index: number) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                          ? "bg-[var(--color-border)] text-[var(--color-text-primary)]"
                          : index === 2
                            ? "bg-orange-400 text-orange-900"
                            : "bg-[var(--color-surface-hover)] text-[var(--color-primary)]"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.attendanceCount} attendees
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">
                      {event.rating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No event data available
            </div>
          )}
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Recent Activity</h3>
          </div>

          {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
            <div className="space-y-2">
              {analytics.recentActivity.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-2 h-2 bg-[var(--color-info)] rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
