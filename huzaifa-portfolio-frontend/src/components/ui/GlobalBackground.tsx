import { motion } from 'framer-motion';

export default function GlobalBackground() {
  return (
    <div className="global-bg">
      <motion.div
        className="bg-orb orb-1"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="bg-orb orb-2"
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <motion.div
        className="bg-grid"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}