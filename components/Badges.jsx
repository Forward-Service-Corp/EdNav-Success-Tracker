export default function Badges({ color, label }) {
  return (
    <span
      className={`inline-flex items-center rounded-md ${color} w-24 px-2 py-1 text-xs font-medium`}
    >
      {label}
    </span>
  );
}
