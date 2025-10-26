import { Link, NavLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${isActive ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`;

export const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Lasers &amp; Feelings Character Creator
          </Link>
          <nav className="flex items-center gap-1" aria-label="Primary">
            <NavLink to="/" className={navLinkClass} end>
              Editor
            </NavLink>
            <NavLink to="/saves" className={navLinkClass}>
              Saves
            </NavLink>
            <NavLink to="/library" className={navLinkClass}>
              Manage Lists
            </NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 pb-16">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white/70 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4">
          <p>
            Built for the legendary one-page RPG <span className="font-semibold">Lasers &amp; Feelings</span> by John Harper.
          </p>
          <a
            className="text-primary-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            href="https://onesevendesign.com/lasers_and_feelings_rpg.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View original rules
          </a>
        </div>
      </footer>
    </div>
  );
};
