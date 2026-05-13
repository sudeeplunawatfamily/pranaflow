export default function GlassCard({ children, className = '', style = {}, as: Component = 'div' }) {
  return (
    <Component
      className={`rounded-[24px] border ${className}`}
      style={{
        background: 'rgba(255,250,242,0.82)',
        backdropFilter: 'blur(18px)',
        borderColor: 'rgba(120,90,55,0.10)',
        boxShadow: '0 12px 30px rgba(75,54,33,0.10)',
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
