import { motion } from 'framer-motion';

export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
    >
      {children}
    </motion.div>
  );
}