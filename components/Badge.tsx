import React from 'react';

function Badge({ use }: {
  use: 'active' | 'in progress' | 'graduated' | 'inactive'
}) {
  const useMap = {
    'active': 'badge-info',
    'in progress': 'badge-success',
    'graduated': 'badge-warning',
    'inactive': 'badge-error'
  };
  return (
    <div className={`badge badge-sm ${useMap[use]} whitespace-nowrap w-auto capitalize`}>{use}</div>
  );
}

export default Badge;