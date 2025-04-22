import Avvvatars from "avvvatars-react";

export default function MyAvatar(
  val,
  dv,
  size,
  shadow,
  border,
  borderColor,
  borderSize,
) {
  // const defaultValue = {
  //   value: "A" || val,
  //   displayValue: "A" || dv,
  //   size: 100 || size,
  //   shadow: true,
  //   border: true,
  //   borderColor: "#000" || borderColor,
  //   borderSize: 1 || borderSize,
  //   borderStyle: "solid" || "solid",
  // };
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
