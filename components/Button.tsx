import React from 'react';

function Button({ use, label, onClick, customStyle }: {
  use: 'primary' | 'secondary' | 'accent' | 'destructive',
  label: string,
  onClick: () => void,
  customStyle?: string
}) {
  const useMap = {
    'primary': 'btn-success btn-soft',
    'secondary': 'btn-info btn-outline',
    'accent': 'btn-warning btn-ghost',
    'destructive': 'btn-error btn-destructive'
  };
  return (
    <button onClick={onClick} className={`btn ${useMap[use]} ${customStyle || null}`}>{label}</button>
  );
}

export default Button;