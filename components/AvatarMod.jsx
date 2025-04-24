import Avvvatars from 'avvvatars-react';

export default function MyAvatar(
  val,
  dv,
  size,
  shadow,
  border,
  borderColor,
  borderSize,
) {
  return (
    <Avvvatars
      value={val}
      displayValue={dv}
      size={size}
      shadow={shadow}
      border={border}
      borderColor={borderColor}
      borderSize={borderSize}
    />
  );
}
