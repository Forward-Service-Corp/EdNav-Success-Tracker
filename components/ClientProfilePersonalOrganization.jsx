import React, { useEffect, useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import ClientProfileDetailsInput from '@/components/ClientProfileDetailsInput';

function ClientProfilePersonalOrganization() {
  const { selectedClient } = useClients();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [change, setChange] = useState({
    first_name: selectedClient?.first_name || '',
    last_name: selectedClient?.last_name || '',
    email: selectedClient?.email || '',
    contactNumber: selectedClient?.contactNumber || '',
    caseNumber: selectedClient?.caseNumber || '',
    dob: selectedClient?.dob || '',
    fep: selectedClient?.fep || '',
    navigator: selectedClient?.navigator || '',
    dateReferred: selectedClient?.dateReferred || '',
    lastGrade: selectedClient?.lastGrade || '',
    pin: selectedClient?.pin || '',
    region: selectedClient?.region || '',
    clientStatus: selectedClient?.clientStatus || '',
    county: selectedClient?.county || '',
    group: selectedClient?.group || '',
    schoolIfEnrolled: selectedClient?.schoolIfEnrolled || '',
    ttsDream: selectedClient?.ttsDream || ''
  });
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Reset form when editing state changes
  useEffect(() => {
    setChange({
      first_name: selectedClient?.first_name || '',
      last_name: selectedClient?.last_name || '',
      email: selectedClient?.email || '',
      contactNumber: selectedClient?.contactNumber || '',
      caseNumber: selectedClient?.caseNumber || '',
      dob: selectedClient?.dob || '',
      fep: selectedClient?.fep || '',
      navigator: selectedClient?.navigator || '',
      dateReferred: selectedClient?.dateReferred || '',
      lastGrade: selectedClient?.lastGrade || '',
      pin: selectedClient?.pin || '',
      region: selectedClient?.region || '',
      clientStatus: selectedClient?.clientStatus || '',
      transcripts: selectedClient?.transcripts || false,
      county: selectedClient?.county || '',
      group: selectedClient?.group || '',
      schoolIfEnrolled: selectedClient?.schoolIfEnrolled || '',
      ttsDream: selectedClient?.ttsDream || ''
    });
    setError('');
    setSuccessMessage('');
  }, [selectedClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setChange({ ...change, [name]: value });
  };

  return (
    <div
      className={`bg-base-300 border-1 border-base-content/10 mx-6 rounded-lg transition-all duration-700 ${detailsOpen ? 'p-6' : 'py-4 px-6 h-20 overflow-hidden'} `}>
      <div className={`flex items-center justify-between mb-6`}>
        <div className={`text-2xl`}>Personal Details</div>
        <div className={``} onClick={() => setDetailsOpen(!detailsOpen)}>
          <button className={`btn btn-soft btn-primary`}>View & Edit</button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8`}>

        {error && (
          <div className="col-span-full bg-error/20 text-error px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="col-span-full bg-success/20 text-success px-4 py-2 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {selectedClient && selectedClient._id && Object.keys(change).map((field, index) => (
          <ClientProfileDetailsInput field={field} change={change} onChange={handleChange} key={index} />
        ))}
      </div>
    </div>
  );
}

export default ClientProfilePersonalOrganization;