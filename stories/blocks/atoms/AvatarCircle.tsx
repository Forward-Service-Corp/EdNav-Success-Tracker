// /components/atoms/AvatarCircle.tsx

import Avvvatars from 'avvvatars-react';
import React from 'react';

type AvatarCircleProps = {
  firstName: string;
  lastName: string;
  size?: number;
};

const AvatarCircle: React.FC<AvatarCircleProps> = ({
                                                     firstName,
                                                     lastName,
                                                     size = 35
                                                   }) => {
  const initials = `${firstName[0]} ${lastName[0]}`;

  return (
    <div className={`flex items-center justify-center`}>
    <div className="avatar">
      <div className="mask mask-squircle h-12 w-12 p-1">
        <Avvvatars
          value={firstName || ''}
          size={size || 36}
          displayValue={initials || 'rs'}
        ></Avvvatars>
      </div>
    </div>
    </div>
  );
};

export default AvatarCircle;
