function ButtonMaster({ type, label, onClick, color, disabled }) {
  return (
    <button
      className={`btn btn-${color} btn-${type} sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default ButtonMaster;
