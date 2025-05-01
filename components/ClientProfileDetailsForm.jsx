'use client';
import { useEffect, useState } from 'react';
import { useClient } from '../contexts/ClientContext';
import { useClientList } from '../contexts/ClientListContext';
import { adultSchools, navigators, wisconsinCounties, youthSchools } from '../lib/schools';

export default function ClientProfileDetailsForm({ isNarrow, isMedium }) {
  const { selectedClient, setSelectedClient } = useClient();
  const { setClientList } = useClientList();
  const [clientCopy, setClientCopy] = useState({ ...selectedClient });
  const [feps, setFeps] = useState([]);

  useEffect(() => {
    const fetchFeps = async () => {
      const response = await fetch('/api/feps');
      const data = await response.json();
      await setFeps(data);
    };
    fetchFeps().then();
  }, []);

  useEffect(() => {
    setClientCopy({ ...selectedClient });
  }, [selectedClient]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientCopy(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const response = await fetch(`/api/clients/update?clientId=${selectedClient._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientCopy)
    });

    const data = await response.json();
    if (data) {
      await setSelectedClient(data.client);
      await setClientList(prev =>
        [...prev.filter(c => c._id !== selectedClient._id), data.client]
      );
    } else {
      console.error('There was an error updating the client.');
    }
  };

  const handleCancel = () => {
    setClientCopy({ ...selectedClient });
    // if (onCancel) onCancel();
  };

  const validatePhone = (phone) =>
    /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <form className={`space-y-4 w-full grid ${getGridClasses()}`}>
      {[
        { name: 'first_name', label: 'First Name', type: 'text', minLength: 2 },
        { name: 'last_name', label: 'Last Name', type: 'text', minLength: 2 },
        { name: 'email', label: 'Email', type: 'email', validate: validateEmail },
        { name: 'contactNumber', label: 'Contact Number', type: 'tel', validate: validatePhone },
        { name: 'caseNumber', label: 'Case Number', type: 'text' },
        { name: 'dateReferred', label: 'Date Referred', type: 'date' },
        { name: 'dob', label: 'DOB', type: 'date' },
        { name: 'pin', label: 'PIN', type: 'text' }
      ].map(({ name, label, type, minLength, validate }) => (
        <div key={name} className="form-control">
          <label htmlFor={name} className="label">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            value={clientCopy[name] || ''}
            onChange={handleChange}
            className="input input-bordered"
            minLength={minLength}
            pattern={validate ? undefined : null}
          />
        </div>
      ))}

      {

        <div className="form-control">
          <label htmlFor={'fep'} className="label">
            FEP
          </label>
          <select
            id={'fep'}
            name={'fep'}
            value={clientCopy['fep'] || ''}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="">-- Select --</option>
            {feps.map((option) => (
              <option key={option?.name} value={option?.name}>{option?.name}</option>
            ))}
          </select>
        </div>
      }

      {[
        { field: 'navigator', list: navigators },
        { field: 'region', list: ['1', '2', '3', '4', '5', '6'] },
        { field: 'clientStatus', list: ['active', 'inactive', 'in progress', 'graduated'] },
        { field: 'county', list: wisconsinCounties },
        { field: 'group', list: ['adult', 'youth'] }
      ].map((item) => {
        console.log(item);
        if (clientCopy[item.field] !== undefined && clientCopy[item.field] !== null && clientCopy[item.field].toString().split('').length > 0) {
          return (
            <div key={item.field} className="form-control">
              <label htmlFor={item.field} className="label">
                {item?.field?.charAt(0).toUpperCase() + item?.field?.slice(1)}
              </label>
              <select
                id={item.field}
                name={item.field}
                value={clientCopy[item?.field]?.toString().toLowerCase() || ''}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">-- Select --</option>
                {item?.list?.map((option) => (
                  <option key={option} value={option?.toLowerCase()}>{option}</option>
                ))}
                {/* Option values should be populated dynamically based on your app */}
              </select>
            </div>
          );
        }
      })}

      {
        selectedClient?.group.toLowerCase() === 'adult' && (
          <div className="form-control">
            <label htmlFor={'schoolIfEnrolled'} className="label">
              schoolIfEnrolled
            </label>
            <select
              id={'schoolIfEnrolled'}
              name={'schoolIfEnrolled'}
              value={clientCopy['schoolIfEnrolled']?.toLowerCase() || ''}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">-- Select --</option>
              {adultSchools.map((option) => (
                <option key={option} value={option?.toLowerCase()}>{option}</option>
              ))}
            </select>
          </div>
        )
      }

      {
        selectedClient?.group.toLowerCase() === 'youth' && (
          <div className="form-control">
            <label htmlFor={'schoolIfEnrolled'} className="label">
              schoolIfEnrolled
            </label>
            <select
              id={'schoolIfEnrolled'}
              name={'schoolIfEnrolled'}
              value={clientCopy['schoolIfEnrolled']?.toLowerCase() || ''}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="">-- Select --</option>
              {youthSchools.map((option) => (
                <option key={option} value={option?.toLowerCase()}>{option}</option>
              ))}
            </select>
          </div>
        )
      }

      {
        <div className="form-control">
          <label htmlFor={'ttsDream'} className="label">
            TTS Dream
          </label>
          <textarea
            id={'ttsDream'}
            name={'ttsDream'}
            value={clientCopy['ttsDream'] || ''}
            onChange={handleChange}
            className="textarea textarea-bordered"
          />
        </div>
      }

      <div className="flex gap-2 mt-4">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}