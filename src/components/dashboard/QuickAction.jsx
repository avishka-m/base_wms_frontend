import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const QuickAction = ({ title, icon, onClick, color, disabled, tooltipText }) => {
  const button = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center p-4 bg-white rounded-lg shadow-sm transition-all ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow border border-gray-100'
      } ${
        color ? `text-${color}-500` : 'text-gray-700'
      }`}
    >
      {icon}
      <span className="mt-2 text-sm font-medium text-center">{title}</span>
    </button>
  );

  return disabled && tooltipText ? (
    <Tooltip title={tooltipText} placement="top" arrow>
      <span style={{ display: 'inline-block' }}>{button}</span>
    </Tooltip>
  ) : button;
};

export default QuickAction;