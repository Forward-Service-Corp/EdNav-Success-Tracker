// /components/atoms/AvatarCircle.tsx

import Avvvatars from "avvvatars-react";
import React from "react";

type AvatarCircleProps = {
  firstName: string;
  lastName: string;
  size?: number;
};

const AvatarCircle: React.FC<AvatarCircleProps> = ({
  firstName,
  lastName,
  size = 36,
}) => {
  const initials = `${firstName[0]} ${lastName[0]}`;

  return (
    <div className="avatar">
      <div className="mask mask-squircle h-12 w-12">
        <Avvvatars
          value={firstName}
          size={size}
          displayValue={initials}
        ></Avvvatars>
      </div>
    </div>
  );
};

export default AvatarCircle;
