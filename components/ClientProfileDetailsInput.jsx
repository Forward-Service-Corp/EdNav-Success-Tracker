import React, { useState } from 'react';
import { EditIcon, SaveIcon, XSquareIcon } from 'lucide-react';
import { useClients } from '@/contexts/ClientsContext';

function ClientProfileDetailsInput({ field, index, change, handleChange }) {
  const { selectedClient } = useClients();
  const [updating, setUpdating] = useState(false);
  const [value, setValue] = useState('');
  const fieldLabelMap = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    contactNumber: 'Contact Number',
    caseNumber: 'Case Number',
    dob: 'Date of Birth',
    fep: 'FEP',
    navigator: 'Navigator',
    dateReferred: 'Date Referred',
    lastGrade: 'Last Grade',
    pin: 'PIN',
    region: 'Region',
    clientStatus: 'Client Status',
    county: 'County',
    group: 'Group',
    schoolIfEnrolled: 'School If Enrolled',
    ttsDream: 'TTS Dream'
  };
  const fieldTypes = {
    first_name: 'text',
    last_name: 'text',
    email: 'email',
    contactNumber: 'text',
    caseNumber: 'text',
    dob: 'date',
    fep: 'select',
    navigator: 'select',
    dateReferred: 'date',
    lastGrade: 'select',
    pin: 'text',
    region: 'select',
    clientStatus: 'select',
    county: 'select',
    group: 'select',
    schoolIfEnrolled: 'select',
    ttsDream: 'textarea'
  };
  console.log(change);

// Format date values properly
  const formatDateValue = () => {
    const value = change[field];
    if (!value) return '';

    try {

      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return '';
    } catch (error) {
      console.error(`Error formatting date for ${field}:`, error);
      return '';
    }
  };

  const fieldType = fieldTypes[field];
  console.log(fieldType);

  const handleSave = () => {
  };

  const handleCancel = () => {
    setUpdating(false);
    setValue('');
  };

  if (fieldType === 'date') {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <input disabled={!updating} type={fieldType} name={field} id={field} defaultValue={formatDateValue}
                 onChange={handleChange} className={`input input-sm`} placeholder={fieldLabelMap[field]} />
          {updating && value !== '' ?
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button> : null}
          {updating ?
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button> : null}
          {!updating ?
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button> : null}
        </div>

      </div>
    );
  } else if (fieldType === 'select') {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <select disabled={!updating} name={field} id={field} defaultValue={change[field]} onChange={handleChange}
                  className={`input input-sm`}>
            <option value="">Select {fieldLabelMap[field]}</option>
            {Array.isArray(change[field]) && change[field].map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
          {updating && value !== '' ?
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button> : null}
          {updating ?
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button> : null}
          {!updating ?
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button> : null}
        </div>
      </div>
    );
  } else if (fieldType === 'textarea') {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <textarea disabled={!updating} name={field} id={field} defaultValue={change[field]} onChange={handleChange}
                    className={`input input-sm`} placeholder={fieldLabelMap[field]} rows={4} />
          {updating && value !== '' ?
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button> : null}
          {updating ?
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button> : null}
          {!updating ?
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button> : null}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <input disabled={!updating} type={fieldTypes[field]} name={field} id={field}
                 defaultValue={change[field] || ''} onChange={handleChange} className={`input input-sm`}
                 placeholder={fieldLabelMap[field]} />
          {updating && value !== '' ?
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button> : null}
          {updating ?
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button> : null}
          {!updating ?
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button> : null}
        </div>

      </div>
    );
  }
}

export default ClientProfileDetailsInput;