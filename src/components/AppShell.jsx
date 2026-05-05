export default function AppShell({ children, phaseColor = null }) {
  const toColor = phaseColor ? `${phaseColor}22` : '#D8EDFF';
  return (
    <div className="min-h-dvh flex justify-center bg-[#F7FBFF]">
      <main
        className="relative min-h-dvh w-full max-w-[430px] overflow-x-hidden px-4 pb-4 pt-4 sm:px-5 sm:pt-5"
        style={{
          background: `linear-gradient(180deg, #F4F9FF 0%, #EAF5FF 45%, ${toColor} 100%)`,
          transition: 'background 0.8s ease',
        }}
      >
        {children}
      </main>
    </div>
  );
}
