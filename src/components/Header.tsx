'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import NotificationIcon from './NotificationIcon';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isPublicInfoPage = pathname === '/' || pathname === '/privacy' || pathname === '/terms' || pathname === '/security';

  const [activeSection, setActiveSection] = React.useState('home');
  const [indicatorStyle, setIndicatorStyle] = React.useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const navRef = React.useRef<HTMLElement | null>(null);
  const linkRefs = React.useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isManualScrollRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Accurately compute the position and width of the active tab's underline
  const updateIndicator = React.useCallback(() => {
    if (!isLandingPage) return;
    const navEl = navRef.current;
    const activeEl = linkRefs.current[activeSection];
    if (navEl && activeEl) {
      const navRect = navEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setIndicatorStyle({
        left: Math.round(activeRect.left - navRect.left),
        width: Math.round(activeRect.width),
      });
    }
  }, [activeSection, isLandingPage]);

  React.useEffect(() => {
    updateIndicator();
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(updateIndicator);
    }
    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  // Scrollspy observer for landing page
  React.useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      if (isManualScrollRef.current) return;

      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom of page -> About (footer)
      if (scrollBottom >= docHeight - 80) {
        setActiveSection('about');
        return;
      }

      const aboutEl = document.getElementById('about');
      const howItWorksEl = document.getElementById('how-it-works');
      const featuresEl = document.getElementById('features');

      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom > 100) {
          setActiveSection('about');
          return;
        }
      }

      if (howItWorksEl) {
        const rect = howItWorksEl.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom > 100) {
          setActiveSection('how-it-works');
          return;
        }
      }

      if (featuresEl) {
        const rect = featuresEl.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom > 100) {
          setActiveSection('features');
          return;
        }
      }

      if (window.scrollY < 250) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  if (isLoginPage) {
    return null;
  }

  const getInitials = (name?: string, maxInitials = 3) => {
    if (!name) return 'US';
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
      return words.slice(0, maxInitials).map(w => w[0]).join('').toUpperCase();
    }
    return name.substring(0, Math.min(2, maxInitials)).toUpperCase();
  };

  const lockScrollSpyTemporarily = () => {
    isManualScrollRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 850);
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      lockScrollSpyTemporarily();
      setActiveSection('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      lockScrollSpyTemporarily();
      setActiveSection(targetId);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${targetId}`);
      }
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'features', label: 'Features', href: '/#features' },
    { id: 'how-it-works', label: 'How it Works', href: '/#how-it-works' },
    { id: 'about', label: 'About', href: '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2eae2] bg-white/95 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-6 md:px-8 relative">
        {/* Left Logo */}
        <Link href="/" onClick={handleHomeClick} className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Logo size={28} />
        </Link>

        {/* Center Nav Links with smooth sliding green underline indicator right under the text */}
        <nav
          ref={navRef}
          className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2 py-2"
        >
          {navLinks.map((item) => {
            const isActive = isLandingPage && activeSection === item.id;
            return (
              <Link
                key={item.id}
                ref={(el) => {
                  linkRefs.current[item.id] = el;
                }}
                href={item.href}
                onClick={(e) => (item.id === 'home' ? handleHomeClick(e) : handleAnchorClick(e, item.id))}
                className={`relative px-1 py-1 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isActive ? 'text-[#1e3a1b] font-semibold' : 'text-neutral-600 hover:text-[#254720]'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Smooth animated sliding green underline bar placed directly under the text */}
          {isLandingPage && indicatorStyle.width > 0 && (
            <span
              className="absolute bottom-0 h-[2.5px] bg-[#254720] rounded-full transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && !isPublicInfoPage ? (
            <div className="flex items-center gap-4">
              <NotificationIcon />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-light text-brand-green font-semibold text-xs border border-brand-green-border">
                  {getInitials(user?.company?.name || user?.email)}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-neutral-700 max-w-[150px] truncate">
                  {user?.company?.name || user?.email}
                </span>
              </div>

              <button
                onClick={logout}
                className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                Log Out
              </button>
            </div>
          ) : isPublicInfoPage ? null : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-green-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
