import React, { useEffect, useState } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import InputVariants from '@/components/InputVariants';
import { clientFormFields } from '@/lib/clientFormFields';

function ClientProfilePersonalOrganization() {
  const { selectedClient } = useClients();
  const [editing, setEditing] = useState(false);
  const [change, setChange] = useState({
    _id: selectedClient?._id || '',
    first_name: selectedClient?.first_name || '',
    last_name: selectedClient?.last_name || '',
    name: selectedClient?.name || '', // Full name
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form when editing state changes
  useEffect(() => {
    setChange({
      _id: selectedClient?._id || '',
      first_name: selectedClient?.first_name || '',
      last_name: selectedClient?.last_name || '',
      name: selectedClient?.name || '',
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

    if (name === 'first_name' || name === 'last_name') {
      // Update the full name when first or last name changes
      const firstName = name === 'first_name' ? value : change.first_name;
      const lastName = name === 'last_name' ? value : change.last_name;
      const fullName = `${firstName} ${lastName}`.trim();

      setChange({
        ...change,
        [name]: value,
        name: fullName
      });
    } else {
      setChange({ ...change, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify(change),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('Client information updated successfully!');
        setEditing(false);
        // If you have a refresh function in the ClientsContext to reload the client data, you could call it here
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update client information');
      }
    } catch (error) {
      setError('An error occurred while updating client information');
      console.error('Error updating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we have required fields for form submission
  const canSubmit = change.last_name &&
    change.email &&
    change.contactNumber &&
    change.fep &&
    editing &&
    !isSubmitting;

  return (
    <form className={`profile-section`} onSubmit={handleSubmit}>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8`}>
        <div className={`text-2xl col-span-3`}>Personal Details</div>

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

        {clientFormFields.map((field, index) => (
          <InputVariants
            key={index}
            name={field.name}
            id={field.name}
            type={field.type}
            label={field.label}
            options={field.options || []}
            placeholder={field.placeholder}
            value={change[field.name] || ''}
            disabled={!editing}
            handleChange={handleChange}
          />
        ))}

        <div className={`col-span-full flex w-full justify-end items-center gap-4 mt-6`}>
          {editing ? (
            <>
              <button
                disabled={!canSubmit}
                className="btn btn-sm btn-outline btn-success disabled:opacity-40"
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Saving...
                  </>
                ) : 'Save'}
              </button>
              <button
                className="btn btn-sm btn-outline btn-warning"
                type="button"
                onClick={() => setEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-outline btn-primary"
              type="button"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default ClientProfilePersonalOrganization;