import React from 'react';
import CountUpComponent, { CountUp as NamedCountUp } from 'react-countup';
import { useLanguage } from '../../hooks/useLanguage';
import { useAppData } from '../../hooks/useAppData';

// Robust resolver for CommonJS/ESM default and named exports
const CountUp = NamedCountUp || (
  typeof CountUpComponent === 'object' && CountUpComponent.default 
    ? CountUpComponent.default 
    : CountUpComponent
);

export const AnimatedNumber = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 0, 
  duration = 2,
  isCurrency = false,
  className 
}) => {
  const { lang } = useLanguage();
  const { settings } = useAppData();
  
  // Basic currency detection formatting based on locale
  const separator = lang === 'en' ? ',' : '.';
  const decimal = lang === 'en' ? '.' : ',';
  
  const displayPrefix = isCurrency && prefix === '' ? (settings?.currency === 'IDR' ? 'Rp ' : '') : prefix;

  return (
    <div className={className}>
      <CountUp
        end={value}
        duration={duration}
        separator={separator}
        decimal={decimal}
        decimals={decimals}
        prefix={displayPrefix}
        suffix={suffix}
        useEasing={true}
      />
    </div>
  );
};
