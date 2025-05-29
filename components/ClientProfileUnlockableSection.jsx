import { useClient } from "../contexts/ClientContext";
import ClientProfileUnlockableLeft from "./ClientProfileUnlockableLeft";
import ClientProfileUnlockableRight from "./ClientProfileUnlockableRight";

function ClientProfileUnlockableSection({ section }) {
  const { selectedClient } = useClient();

  function hasValidKey(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) && !!obj[key];
  }

  return (
    <div id={section} className={`relative w-full`}>
      <div
        className={`absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ${selectedClient[section]?.completed === true ? "invisible" : "visible"}`}
      >
        <div
          className={`text-base-content bg-base-300/70 m-auto rounded-lg p-4 text-center text-sm shadow md:p-6 md:text-base`}
        >
          Add an activity regarding {section} to activate this area.
        </div>
      </div>
      <div
        className={`bg-base-200 border-base-content/10 relative rounded-lg border-1 p-6 shadow ${selectedClient[section] ? "" : "opacity-50 blur-[2px]"}`}
      >
        <ClientProfileUnlockableLeft
          selectedClient={selectedClient}
          section={section}
          hasValidKey={hasValidKey}
        />
        <ClientProfileUnlockableRight
          selectedClient={selectedClient}
          section={section}
          hasValidKey={hasValidKey}
        />
      </div>
    </div>
  );
}

export default ClientProfileUnlockableSection;
