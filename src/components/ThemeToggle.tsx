import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      aria-pressed={theme === 'dark'}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M21.752 15.002A9.718 9.718 0 0112 21.75a9.75 9.75 0 010-19.5 9.718 9.718 0 019.752 6.748 7.5 7.5 0 000 5.004z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zm0 15a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm7.5-3.75a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5H19.5zm-7.5 7.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12.75a.75.75 0 01-.75-.75zm-7.5-7.5a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0V12a.75.75 0 01-.75.75zM5.47 5.47a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L5.47 6.53a.75.75 0 010-1.06zm11.94 11.94a.75.75 0 011.06 0l1.06 1.06a.75.75 0 11-1.06 1.06L17.41 18.47a.75.75 0 010-1.06zM5.47 18.53a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06L6.53 18.53a.75.75 0 01-1.06 0zm11.94-11.94a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06L18.47 6.53a.75.75 0 01-1.06 0z" />
        </svg>
      )}
    </button>
  );
};
