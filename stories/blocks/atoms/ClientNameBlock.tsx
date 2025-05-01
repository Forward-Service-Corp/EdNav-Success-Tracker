// /components/atoms/ClientNameBlock.tsx

import React from 'react';

type ClientNameBlockProps = {
  firstName: string;
  lastName: string;
  latestInteraction: string;
};

const ClientNameBlock: React.FC<ClientNameBlockProps> = ({
                                                           firstName,
                                                           lastName,
                                                           latestInteraction
                                                         }) => {
  return (
    <div>
      <div className="font-medium">
        {firstName || 'John'} {lastName || 'Doe'}
      </div>
      <div className={`invisible max-lg:visible text-xs text-base-content/20`}>{latestInteraction || '2025-02-21'}</div>
    </div>
  );
};

export default ClientNameBlock;
