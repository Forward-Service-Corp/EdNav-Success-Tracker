// /components/atoms/StatusBadge.tsx

import { getBadgeColor } from '@/lib/ColorMap'; // adjust this path as needed
import React from 'react';

type StatusBadgeProps = {
  status: string;
  isSelected?: boolean;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isSelected }) => {
  const badgeClass = isSelected
    ? 'inline-flex items-center rounded-md px-2 py-1 text-xs w-24 font-medium bg-white text-center'
    : getBadgeColor(status.toLowerCase());

  return <span className={badgeClass}>{status}</span>;
};

export default StatusBadge;
