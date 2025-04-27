import React, { useEffect, useState } from 'react';
import { useClient } from '@/contexts/ClientContext';
import ClientProfileDetailsInput from '@/components/ClientProfileDetailsInput';
import Button from './Button';

function ClientProfilePersonalOrganization({ isNarrow, isMedium }) {
  const { selectedClient } = useClient();
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feps, setFeps] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [change, setChange] = useState({
    first_name: selectedClient?.first_name || "",
    last_name: selectedClient?.last_name || "",
    email: selectedClient?.email || "",
    contactNumber: selectedClient?.contactNumber || "",
    caseNumber: selectedClient?.caseNumber || "",
    dob: selectedClient?.dob || "",
    fep: selectedClient?.fep || "",
    navigator: selectedClient?.navigator || "",
    dateReferred: selectedClient?.dateReferred || "",
    lastGrade: selectedClient?.lastGrade || "",
    pin: selectedClient?.pin || "",
    region: selectedClient?.region || "",
    clientStatus: selectedClient?.clientStatus || "",
    county: selectedClient?.county || "",
    group: selectedClient?.group || "",
  });

  // Reset form when editing state changes
  useEffect(() => {
    setChange({
      first_name: selectedClient?.first_name || "",
      last_name: selectedClient?.last_name || "",
      email: selectedClient?.email || "",
      contactNumber: selectedClient?.contactNumber || "",
      caseNumber: selectedClient?.caseNumber || "",
      fep: selectedClient?.fep || "",
      navigator: selectedClient?.navigator || "",
      dateReferred: selectedClient?.dateReferred || "",
      lastGrade: selectedClient?.lastGrade || "",
      pin: selectedClient?.pin || "",
      region: selectedClient?.region || "",
      clientStatus: selectedClient?.clientStatus || "",
      county: selectedClient?.county || "",
      ttsDream: selectedClient?.ttsDream || "",
    });
    setError("");
    setSuccessMessage("");
  }, [selectedClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChange({ ...change, [name]: value });
  };

  const fetchFeps = async () => {
    let feps = [];
    const response = await fetch(`/api/feps`);
    const data = await response.json();
    await data.forEach((fep) => {
      feps.push(fep.name);
    });
    setFeps(feps);
  };

  useEffect(() => {
    fetchFeps().then();
  }, []);

  // Get grid classes based on container width
  const getGridClasses = () => {
    if (isNarrow) {
      return 'grid-cols-1 gap-3';
    } else if (isMedium) {
      return 'grid-cols-1 md:grid-cols-2 gap-4';
    } else {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8';
    }
  };

  return (
    <div
      className={`bg-base-100 p-6 rounded shadow transition-all duration-700 ${detailsOpen ? '' : 'h-[80px] overflow-hidden '} `}
    >
      <div className={`flex justify-between mb-8 h-[80px] ${!detailsOpen ? 'items-start' : 'items-center'}`}>
        <div className={`text-lg md:text-2xl`}>Personal Details</div>
        <Button label={`${detailsOpen ? 'Close' : 'View & Edit'} Details`} use={`secondary`}
                onClick={() => setDetailsOpen(!detailsOpen)} />
      </div>

      <div className={`grid ${getGridClasses()}`}>
        {error && (
          <div className="bg-error/20 text-error col-span-full mb-4 rounded px-4 py-2">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-success/20 text-success col-span-full mb-4 rounded px-4 py-2">
            {successMessage}
          </div>
        )}

        {selectedClient &&
          selectedClient._id &&
          Object.keys(change).map((field, index) => (
            <ClientProfileDetailsInput
              field={field}
              change={change}
              setChange={setChange}
              onChange={handleChange}
              feps={feps}
              key={index}
              isNarrow={isNarrow}
            />
          ))}
      </div>
    </div>
  );
}

// Default props
ClientProfilePersonalOrganization.defaultProps = {
  isNarrow: false,
  isMedium: false
};

export default ClientProfilePersonalOrganization;