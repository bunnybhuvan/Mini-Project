import React from 'react';

interface KaggleIconProps {
  className?: string;
}

const KaggleIcon: React.FC<KaggleIconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 4V20H11V14L16 20H20L13 12L20 4H16L11 10V4H8Z" />
    </svg>
  );
};

export default KaggleIcon;