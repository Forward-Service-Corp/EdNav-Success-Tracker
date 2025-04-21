import React, { useEffect, useState } from 'react';
import { EditIcon, SaveIcon, XSquareIcon } from 'lucide-react';
import { useClients } from '@/contexts/ClientsContext';
import { adultSchools, youthSchools } from '@/lib/schools';

const counties = ['Brown',
  'Calumet',
  'Columbia',
  'Dane',
  'Fond du Lac',
  'Grant',
  'Green',
  'Jefferson',
  'Manitowoc',
  'Marathon',
  'Outagamie',
  'Portage',
  'Rock',
  'Shawano',
  'Sheboygan',
  'Waupaca',
  'Waushara',
  'Winnebago',
  'Wood'];
const lastGrades = [
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th - No Diploma',
  'Foreign Diploma',
  'GED',
  'No Formal Education'
];
const navigators = [
  'Andrew McCauley',
  'Ashleigh Chesney',
  'Corine Boelk',
  'Hailey Jester',
  'Kecia Thompson-Gordon',
  'Marissa Foth',
  'Morgan Sole',
  'Rachael Banerdt',
  'Rich Basche',
  'Sara Jackson',
  'Stacy Martinez',
  'Trevor Brunette'
];

function ClientProfileDetailsInput({ field, index, feps }) {
  const { selectedClient } = useClients();
  const [updating, setUpdating] = useState(false);
  const [clientCopy, setClientCopy] = useState({});

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
    fep: 'select',
    navigator: 'select',
    dateReferred: 'date',
    lastGrade: 'select',
    pin: 'text',
    region: 'select',
    clientStatus: 'select',
    county: 'select',
    schoolIfEnrolled: 'select',
    ttsDream: 'textarea'
  };

  useEffect(() => {
    if (selectedClient) {
      const copy = JSON.parse(JSON.stringify(selectedClient));
      setClientCopy(copy);
    }
  }, [selectedClient]);

// Format date values properly
  const formatDateValue = () => {

    if (!clientCopy[field]) return '';

    try {

      const date = new Date(clientCopy[field]);
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

  const handleChange = (e) => {
    setClientCopy(prev => {
      return {
        ...prev,
        [field]: e.target.value
      };
    });
  };

  const handleSave = async () => {
    const response = await fetch(`/api/clients/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: clientCopy._id,
        data: { [field]: clientCopy[field] }
      })
      }
    );

    const data = await response.json();
    if (data) {
      setUpdating(false);
    } else {
      console.error(
        `There was an error updating the client.`
      );
    }
  };

  const handleCancel = () => {
    setUpdating(false);
  };

  if (fieldType === 'date') {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <input disabled={!updating} type={fieldType} name={field} id={field} defaultValue={formatDateValue}
                 onChange={handleChange} className={`input input-sm`} placeholder={fieldLabelMap[field]} />

          <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button>
          {updating ?
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button> : null}
          {!updating ?
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button> : null}
        </div>
      </div>
    );
  } else if (fieldType === 'select') {

    let options = [];
    if (field === 'fep') {
      options = feps;
    } else if (field === 'navigator') {
      options = navigators;
    } else if (field === 'county') {
      options = counties;
    } else if (field === 'lastGrade') {
      options = lastGrades;
    } else if (field === 'region') {
      options = ['1', '2', '3', '4', '5', '6'];
    } else if (field === 'clientStatus') {
      options = ['Active', 'In Progress', 'Graduated', 'Inactive'];
    } else if (field === 'schoolIfEnrolled') {
      if (clientCopy?.group === 'Adult') {
        options = adultSchools;
      } else {
        options = youthSchools;
      }
    }

    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <select disabled={!updating} name={field} id={field} value={clientCopy[field]} onChange={handleChange}
                  className={`input input-sm`}>
            <option value="">Select {fieldLabelMap[field]}</option>
            {options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
          {updating &&
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button>}
          {updating &&
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button>}
          {!updating &&
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button>}
        </div>
      </div>
    );
  } else if (fieldType === 'textarea') {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <textarea disabled={!updating} name={field} id={field} defaultValue={clientCopy[field]}
                    onChange={handleChange}
                    className={`input input-sm`} placeholder={fieldLabelMap[field]} rows={4} />
          {updating &&
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button>}
          {updating &&
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button>}
          {!updating &&
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button>}
        </div>
      </div>
    );
  } else {
    return (
      <div className={`flex flex-col`} key={index}>
        <label className={`text-xs mb-1`}>{fieldLabelMap[field]}</label>
        <div className={`flex flex-row gap-2`}>
          <input disabled={!updating} type={fieldTypes[field]} name={field} id={field}
                 defaultValue={clientCopy[field] || ''} onChange={handleChange} className={`input input-sm`}
                 placeholder={fieldLabelMap[field]} />
          {updating &&
            <button onClick={handleSave}><SaveIcon className={`text-success`} size={20} /></button>}
          {updating &&
            <button onClick={handleCancel}><XSquareIcon className={`text-warning`} size={20} /></button>}
          {!updating &&
            <button className={`opacity-30 hover:opacity-100`} onClick={() => setUpdating(true)}><EditIcon size={20} />
            </button>}
        </div>

      </div>
    );
  }
}

export default ClientProfileDetailsInput;