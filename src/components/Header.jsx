import { ChevronLeft, MoonStar, Sun } from 'lucide-react';

export default function Header({ showBack = false, onBack, showHelp = false, theme = 'night', onToggleTheme }) {
  const showThemeToggle = showHelp && typeof onToggleTheme === 'function';

  return (
    <header className="mb-5 flex items-center justify-between">
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className={`grid h-12 w-12 place-items-center rounded-2xl shadow-[0_8px_18px_rgba(15,23,42,0.25)] ${showBack ? 'visible' : 'invisible'}`}
        style={{
          backgroundColor: 'var(--theme-surface)',
          border: '1px solid var(--theme-surface-border)',
          color: 'var(--theme-brand)',
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow logo" className="h-8 w-8" />
        <p className="text-xl font-extrabold" style={{ color: 'var(--theme-brand)' }}>PranaFlow</p>
      </div>

      <button
        type="button"
        aria-label={theme === 'night' ? 'Switch to Day Theme' : 'Switch to Night Theme'}
        onClick={onToggleTheme}
        className={`grid h-10 w-10 place-items-center rounded-2xl shadow-[0_8px_18px_rgba(15,23,42,0.25)] ${showThemeToggle ? 'visible' : 'invisible'}`}
        style={{
          backgroundColor: 'var(--theme-surface)',
          border: '1px solid var(--theme-surface-border)',
          color: 'var(--theme-brand)',
        }}
      >
        {theme === 'night' ? <Sun size={17} /> : <MoonStar size={17} />}
      </button>
    </header>
  );
}
