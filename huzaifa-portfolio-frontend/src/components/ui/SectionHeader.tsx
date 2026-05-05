import { motion } from 'framer-motion';
import { BilingualText } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: BilingualText;
  description: BilingualText;
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="section-header"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <motion.span
        className="eyebrow"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
      >
        {eyebrow}
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
      >
        {t(title)}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
      >
        {t(description)}
      </motion.p>
    </motion.div>
  );
}