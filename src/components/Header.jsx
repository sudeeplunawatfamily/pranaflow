import { ChevronLeft, MoonStar, Sun } from 'lucide-react';

export default function Header({ showBack = false, onBack, showHelp = false, theme = 'night', onToggleTheme }) {
  const isDay = theme === 'day';
  const showThemeToggle = showHelp && typeof onToggleTheme === 'function';

  const btnStyle = {
    backgroundColor: isDay ? 'rgba(255,250,242,0.88)' : 'var(--theme-surface)',
    border: `1px solid ${isDay ? 'rgba(120,90,55,0.14)' : 'var(--theme-surface-border)'}`,
    color: 'var(--theme-brand)',
    boxShadow: isDay ? '0 8px 18px rgba(75,54,33,0.10)' : '0 8px 18px rgba(15,23,42,0.25)',
  };

  return (
    <header className="mb-5 flex items-center justify-between">
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className={`grid h-12 w-12 place-items-center rounded-2xl ${showBack ? 'visible' : 'invisible'}`}
        style={btnStyle}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow logo" className="h-8 w-8" />
        <p
          className={`text-xl font-extrabold ${isDay ? 'font-serif-display' : ''}`}
          style={{ color: 'var(--theme-brand)' }}
        >
          PranaFlow
        </p>
      </div>

      <button
        type="button"
        aria-label={theme === 'night' ? 'Switch to Day Theme' : 'Switch to Night Theme'}
        onClick={onToggleTheme}
        className={`grid h-10 w-10 place-items-center rounded-2xl ${showThemeToggle ? 'visible' : 'invisible'}`}
        style={btnStyle}
      >
        {theme === 'night' ? <Sun size={17} /> : <MoonStar size={17} />}
      </button>
    </header>
  );
}
