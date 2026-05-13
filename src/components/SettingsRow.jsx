import { ChevronRight } from 'lucide-react';

export default function SettingsRow({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[48px] w-full items-center justify-between rounded-2xl px-3 py-2 text-left"
      style={{
        background: 'rgba(255,250,242,0.58)',
        border: '1px solid rgba(120,90,55,0.10)',
      }}
    >
      <span className="text-[14px] font-semibold" style={{ color: '#071D36' }}>{label}</span>
      <span className="flex items-center gap-2 text-[13px]" style={{ color: '#6E6A66' }}>
        {value}
        <ChevronRight size={16} />
      </span>
    </button>
  );
}
