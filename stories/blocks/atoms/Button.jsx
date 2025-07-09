// /components/Button.jsx

import React from 'react';

const Button = ({
                  type,
                  label,
                  onClick,
                  disabled
                }) => {

  return (
    <button
      className={`btn btn-${type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
