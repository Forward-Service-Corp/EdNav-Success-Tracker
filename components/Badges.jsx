export default function Badges({ type, label }) {
  switch (type) {
    case 'success':
      return (
        <span
          className="inline-flex items-center rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success-content ring-1 ring-inset ring-success/30">
        {label}
      </span>
      );
    case 'error':
      return (
        <span
          className="inline-flex items-center rounded-md bg-error/10 px-2 py-1 text-xs font-medium text-error-content ring-1 ring-inset ring-error/30">
        {label}
      </span>
      );
    case 'warning':
      return (
        <span
          className="inline-flex items-center rounded-md bg-warning/10 px-2 py-1 text-xs font-medium text-warning-content ring-1 ring-inset ring-warning/30">
        {label}
      </span>
      );
    case 'info':
      return (
        <span
          className="inline-flex items-center rounded-md bg-info/10 px-2 py-1 text-xs font-medium text-info-content ring-1 ring-inset ring-info/30">
        {label}
      </span>
      );
    default:
      return (
        <span
          className="inline-flex items-center rounded-md bg-base-300/10 px-2 py-1 text-xs font-medium text-base-content ring-1 ring-inset ring-base-300/30">
        {label}
      </span>
      );
  }
}
