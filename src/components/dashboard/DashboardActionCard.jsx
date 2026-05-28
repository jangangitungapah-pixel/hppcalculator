import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const COLOR_MAP = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'group-hover:ring-orange-200' },
  green:  { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'group-hover:ring-emerald-200' },
  blue:   { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'group-hover:ring-blue-200' },
  gold:   { bg: 'bg-amber-100', text: 'text-amber-600', ring: 'group-hover:ring-amber-200' },
};

export const DashboardActionCard = ({ title, description, icon: Icon, color = 'orange', onClick }) => {
  const c = COLOR_MAP[color] || COLOR_MAP.orange;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title}. ${description}`}
      className={`group w-full flex items-center gap-3 bg-surface border border-border/60 rounded-xl px-4 py-3.5 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-brand-primary/30 hover:ring-2 ${c.ring} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary`}
    >
      <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${c.bg}`}>
        <Icon className={`w-4.5 h-4.5 ${c.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors truncate">{title}</div>
        <div className="text-xs text-text-muted truncate">{description}</div>
      </div>
      <ChevronRight className="shrink-0 w-4 h-4 text-text-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
    </button>
  );
};
