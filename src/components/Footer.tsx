import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b1411] text-slate-400 py-16 border-t border-emerald-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#2d4a3e] text-emerald-300 flex items-center justify-center border border-emerald-500/40">
                <svg
                  className="w-4 h-4 text-emerald-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Proctor<span className="text-emerald-400">Ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              Autonomous multi-modal assessment security engine providing mathematical audit trails
              and continuous behavioral verification for high-stakes certification bodies and
              world-class universities.
            </p>
            <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>SYSTEM STATUS:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ALL CLUSTERS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Links Column: Architecture */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Architecture
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Biometric Verification
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  360° Workspace Sweeper
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Gaze &amp; Acoustic Engine
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Zero-Install WASM Core
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Cryptographic Logs
                </span>
              </li>
            </ul>
          </div>

          {/* Links Column: Integrations */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Integrations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Canvas by Instructure
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Blackboard Learn Ultra
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Moodle Enterprise
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  D2L Brightspace
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Custom REST &amp; Webhooks
                </span>
              </li>
            </ul>
          </div>

          {/* Links Column: Compliance */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Compliance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  FERPA Data Privacy
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  GDPR Candidate Rights
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  SOC 2 Type II Reports
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Biometric Retention Policy
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-300 transition cursor-default">
                  Vulnerability Disclosure
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>© {new Date().getFullYear()} ProctorAi Technologies, Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link className="font-bold text-slate-300 hover:text-emerald-300 transition" href="/privacy">
              Privacy Policy
            </Link>
            <Link className="font-bold text-slate-300 hover:text-emerald-300 transition" href="/terms">
              Terms of Service
            </Link>
            <Link className="font-bold text-slate-300 hover:text-emerald-300 transition" href="/security">
              Security Overview
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

