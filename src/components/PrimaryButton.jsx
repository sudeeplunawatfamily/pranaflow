import { motion } from 'framer-motion';

const styles = {
  primary: 'bg-gradient-to-r from-[#1E7FE6] to-[#38BBF2] text-white shadow-[0_12px_30px_rgba(36,135,234,0.28)]',
  secondary: 'bg-white border border-[#D6EAFF] text-[#2487EA] shadow-[0_10px_26px_rgba(36,135,234,0.12)]',
  danger: 'bg-gradient-to-r from-[#F74D61] to-[#EF6C4F] text-white shadow-[0_12px_30px_rgba(247,77,97,0.28)]',
};

export default function PrimaryButton({ children, icon: Icon, variant = 'primary', onClick, className = '', type = 'button' }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02, y: -1 }}
      type={type}
      onClick={onClick}
      className={`flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[26px] px-4 text-[16px] font-bold ${styles[variant]} ${className}`}
    >
      {Icon ? (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#2487EA]">
          <Icon size={16} />
        </span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
