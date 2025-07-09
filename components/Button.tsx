import React from 'react';

// @ts-ignore
function Button({ use, label, onClick, customStyle, disabled }: {
  use: 'primary' | 'secondary' | 'accent' | 'destructive',
  label: string,
  onClick: () => void,
  customStyle?: string
}) {
  const useMap = {
    'primary': 'btn-primary btn-soft',
    'secondary': 'btn-secondary btn-outline',
    'accent': 'btn-accent btn-ghost',
    'destructive': 'btn-error btn-destructive'
  };
  return (
    <button disabled={disabled} onClick={onClick}
            className={`btn btn-sm ${useMap[use]} ${customStyle || null}`}>{label}</button>
  );
}

export default Button;