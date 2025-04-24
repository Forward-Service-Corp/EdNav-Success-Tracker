function Button({ type, label, onClick, disabled }) {

  const buttonColor = {
    primary: 'btn-success btn-soft',
    secondary: 'btn-info btn-outline',
    accent: 'btn-warning btn-ghost'
  };

  return (
    <button
      className={`btn btn-${buttonColor[type]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;
