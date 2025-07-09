// /components/blocks/molecules/ClientRow.tsx
import { useClient } from "@/contexts/ClientContext";
import { useEditing } from "@/contexts/EditingContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useNavigator } from "@/contexts/NavigatorsContext";
import { Dispatch, SetStateAction } from "react";
import Badge from "../../../components/Badge";
import ClientNameBlock from "../atoms/ClientNameBlock";

type Edit = "client" | null;
type ClientRowProps = {
  person: {
    fep: string;
    contactNumber: string;
    email: string;
    _id: string;
    first_name: string;
    last_name: string;
    latestInteraction: string;
    clientStatus: "active" | "in progress" | "graduated" | "inactive";
    county: string;
    navigator: string;
    group: string;
  };
  selected: boolean;
  open?: (
    url?: string | URL,
    target?: string,
    features?: string,
  ) => WindowProxy | null;
  setOpen?: any;
};

export default function ClientRow({ person, open, setOpen, selected }: ClientRowProps) {
  const { setSelectedClient } = useClient();
  const { selectedNavigator } = useNavigator();
  const { currentLayout } = useLayout();
  const { setEditing } = useEditing() as {
    setEditing: Dispatch<SetStateAction<Edit>>;
  };

  const setVisibility = (val: number) => {
    if (currentLayout.table <= val) {
      return "hidden";
    }
    return "visible";
  };

  const handleClick = () => {
    setEditing("client");
    setOpen("profile");
    if (selected) {
      setSelectedClient(null);
    } else {
      setSelectedClient(person);
    }
  };

  return (
    <tr
      className={`bg-base-200 hover:bg-base-200/20 w-full min-w-full cursor-pointer transition-colors duration-300 ${
        selected ? "bg-accent/20" : ""
      }`}
      onClick={handleClick}
    >
      <td>
        <ClientNameBlock
          firstName={person?.first_name || "John"}
          lastName={person?.last_name || "Doe"}
          latestInteraction={person?.latestInteraction || "2021-01-01"}
        />
      </td>
      <td className={`${setVisibility(0)}`}>
        <span className={`w-1/2 truncate`}>{person?.email}</span>
      </td>
      <td className={`${setVisibility(50)} whitespace-nowrap`}>
        {person?.contactNumber}
      </td>
      <td className={`${setVisibility(50)} whitespace-nowrap`}>
        {person?.county || ""}
      </td>
      <td>
        <Badge
          use={
            person?.clientStatus?.toLowerCase() as
              | "active"
              | "in progress"
              | "graduated"
              | "inactive"
          }
        />
      </td>
      <td className={`${setVisibility(50)} whitespace-nowrap`}>
        {person?.fep || ""}
      </td>
      <td>
        {selectedNavigator
          ? selectedNavigator["pinned"]?.includes(person._id)
            ? "Pinned"
            : person?.navigator
          : person?.navigator || ""}
      </td>
    </tr>
  );
}
