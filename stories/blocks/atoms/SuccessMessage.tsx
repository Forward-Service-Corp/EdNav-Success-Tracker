import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function SuccessMessage({
                                         message,
                                         setOpen
                                       }: {
  message: string;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div className={`rounded-md bg-green-50 p-4`}>
      <div className="flex">
        <div
          onClick={() => {
            setOpen(false);
          }}
          className="shrink-0"
        >
          <CheckCircleIcon
            aria-hidden="true"
            className="size-5 text-green-400"
          />
        </div>
        <div className="ml-3">
          <p className="font-medium text-green-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
