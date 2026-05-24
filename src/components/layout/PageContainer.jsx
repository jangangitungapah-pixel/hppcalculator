import React from 'react';

export const PageContainer = ({ children, className = '', maxWidth = 'max-w-[1180px]' }) => {
  return (
    <div className={`p-4 md:p-6 lg:p-8 w-full ${maxWidth} mx-auto ${className}`}>
      {children}
    </div>
  );
};
