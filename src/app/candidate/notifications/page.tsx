'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../../utils/api';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export default function CandidateNotificationsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/candidate/login');
      } else if (user?.role === 'ADMIN') {
        router.push('/dashboard/notifications');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const loadNotifications = async () => {
    try {
      const data = await apiRequest<NotificationItem[]>('notifications');
      if (data) {
        setNotifications(data);
      }
    } catch (err) {
      toastError('Failed to load notifications.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'CANDIDATE') {
      loadNotifications();
    }
  }, [isAuthenticated, user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiRequest(`notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiRequest('notifications/read-all', { method: 'PATCH' });
      toastSuccess('All notifications marked as read.');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      toastError('Failed to mark all notifications as read.');
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading || !isAuthenticated || user?.role !== 'CANDIDATE') {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand-green" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation / Header */}
        <div className="mb-6">
          <Link
            href="/candidate"
            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-4"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900">Notifications & Activity</h1>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                Stay updated with your assessment invitations, test submissions, and exam schedules.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="self-start sm:self-auto rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-brand-green-light text-brand-green'
                : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'UNREAD'
                ? 'bg-brand-green-light text-brand-green'
                : 'text-neutral-500 hover:bg-neutral-50'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-brand-green" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-xs">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="mt-4 text-sm font-bold text-neutral-800">No notifications found</h3>
            <p className="mt-1 text-xs text-neutral-400">
              {filter === 'UNREAD' ? 'You have read all your notifications.' : "You don't have any recent activity."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((n) => {
              const dateObj = new Date(n.createdAt);
              return (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className={`rounded-xl border p-5 transition-all flex items-start gap-4 cursor-pointer ${
                    !n.isRead
                      ? 'border-brand-green-border bg-brand-green-light/20 shadow-2xs'
                      : 'border-neutral-100 bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {n.type === 'SUCCESS' && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-light text-brand-green border border-brand-green-border">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {n.type === 'WARNING' && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    {n.type === 'ERROR' && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-700 border border-red-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    {n.type === 'INFO' && (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-light text-brand-green border border-brand-green-border">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-neutral-900">{n.title}</h3>
                      <span className="text-3xs font-semibold text-neutral-400">
                        {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>

                  {!n.isRead && (
                    <span className="h-2 w-2 rounded-full bg-brand-green flex-shrink-0 mt-2"></span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
