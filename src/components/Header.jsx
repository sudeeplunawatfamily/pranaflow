import { ChevronLeft, HelpCircle } from 'lucide-react';

export default function Header({ showBack = false, onBack, showHelp = false }) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className={`grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2487EA] shadow-[0_8px_20px_rgba(36,135,234,0.15)] ${showBack ? 'visible' : 'invisible'}`}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2">
        <img src="/assets/icons/logo_lotus.svg" alt="PranaFlow logo" className="h-8 w-8" />
        <p className="text-xl font-extrabold text-[#2487EA]">PranaFlow</p>
      </div>

      <button
        type="button"
        aria-label="Help"
        className={`grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#2487EA] shadow-[0_8px_20px_rgba(36,135,234,0.15)] ${showHelp ? 'visible' : 'invisible'}`}
      >
        <HelpCircle size={20} />
      </button>
    </header>
  );
}
