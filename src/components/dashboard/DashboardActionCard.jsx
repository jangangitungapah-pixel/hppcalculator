import React from 'react';
import { ChevronRight } from 'lucide-react';

export const DashboardActionCard = ({ title, description, icon: Icon, color = 'orange', onClick }) => {
  return (
    <div 
      className={`dashboard-action-card ${color} group`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {Icon && (
        <div className="dashboard-action-icon">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="dashboard-action-title">{title}</h4>
      <p className="dashboard-action-description">{description}</p>
      <ChevronRight className="dashboard-action-chevron" />
    </div>
  );
};
