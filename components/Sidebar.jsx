import { useFepsLeft } from "../contexts/FepsLeftContext";

export default function Sidebar({ setOpenPanel }) {
  const { setSelectedFepLeft } = useFepsLeft();

  const handleFilters = ({ name, val }) => {
    setSelectedFepLeft((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  return <div className="bg-base-300 flex h-full w-full flex-col"></div>;
}
