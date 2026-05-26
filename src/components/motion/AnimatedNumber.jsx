import React from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';

export const AnimatedNumber = ({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.2,
  isCurrency = false,
  className
}) => {
  const { lang } = useLanguage();
  const { settings } = useAppData();
  const prefersReducedMotion = useReducedMotion();

  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const motionValue = useMotionValue(prefersReducedMotion ? safeValue : 0);

  const formatter = React.useMemo(() => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }, [lang, decimals]);

  const displayPrefix =
    isCurrency && prefix === ''
      ? settings?.currency === 'IDR'
        ? 'Rp '
        : ''
      : prefix;

  const rounded = useTransform(motionValue, latest => {
    return `${displayPrefix}${formatter.format(latest)}${suffix}`;
  });

  React.useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(safeValue);
      return;
    }

    const controls = animate(motionValue, safeValue, {
      duration,
      ease: 'easeOut'
    });

    return controls.stop;
  }, [safeValue, duration, motionValue, prefersReducedMotion]);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
};
