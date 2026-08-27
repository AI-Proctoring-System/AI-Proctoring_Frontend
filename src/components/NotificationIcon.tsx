'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

interface NotificationItem {
  id: string;
  isRead: boolean;
}

export default function NotificationIcon() {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function checkNotifications() {
      try {
        const data = await apiRequest<NotificationItem[]>('notifications');
        if (data) {
          const unread = data.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Failed to load notifications indicator:', err);
      }
    }

    checkNotifications();
    const interval = setInterval(checkNotifications, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) return null;

  const targetHref = user.role === 'CANDIDATE' ? '/candidate/notifications' : '/dashboard/notifications';

  return (
    <Link
      href={targetHref}
      className="relative rounded-full p-2 text-neutral-500 hover:bg-neutral-100 transition-colors"
      aria-label="Notifications"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
      )}
    </Link>
  );
}
