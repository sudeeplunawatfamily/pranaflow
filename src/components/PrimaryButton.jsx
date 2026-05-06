import { motion } from 'framer-motion';

const styles = {
  primary: {
    background: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-text)',
    boxShadow: 'var(--btn-primary-shadow)',
  },
  secondary: {
    backgroundColor: 'var(--btn-secondary-bg)',
    color: 'var(--btn-secondary-text)',
    border: '1px solid var(--btn-secondary-border)',
    boxShadow: 'var(--btn-secondary-shadow)',
  },
  danger: {
    background: 'var(--btn-danger-bg)',
    color: 'var(--btn-danger-text)',
    boxShadow: 'var(--btn-danger-shadow)',
  },
};

export default function PrimaryButton({ children, icon: Icon, variant = 'primary', onClick, className = '', type = 'button' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02, y: -1 }}
      type={type}
      onClick={onClick}
      style={styles[variant]}
      className={`flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[26px] px-4 text-[16px] font-bold ${className}`}
    >
      {Icon ? (
        <span
          className="grid h-8 w-8 place-items-center rounded-full"
          style={{ backgroundColor: 'var(--btn-icon-bg)', color: 'var(--btn-icon-text)' }}
        >
          <Icon size={16} />
        </span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
