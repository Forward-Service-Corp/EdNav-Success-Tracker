'use client';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useClient } from '../contexts/ClientContext';
import { useClientList } from '../contexts/ClientListContext';
import { adultSchools, navigators, wisconsinCounties, youthSchools } from '../lib/schools';

export default function ClientProfileDetailsForm({ isNarrow, isMedium }) {
  const { selectedClient, setSelectedClient } = useClient();
  const { setClientList } = useClientList();
  const [clientCopy, setClientCopy] = useState({ ...selectedClient });
  const [feps, setFeps] = useState([]);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

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

  const getGridClasses = () => {
    if (isNarrow) {
      return 'grid-cols-1 gap-3';
    } else if (isMedium) {
      return 'grid-cols-1 md:grid-cols-2 gap-4';
    } else {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8';
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    const match = numbers.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (!match) return value;
    const [, area, middle, last] = match;
    let formatted = '';
    if (area) formatted += `(${area}`;
    if (area && area.length === 3) formatted += ')';
    if (middle) formatted += ` ${middle}`;
    if (last) formatted += `-${last}`;
    return formatted.trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'contactNumber') {
      newValue = formatPhone(value);
    }

    setClientCopy(prev => ({ ...prev, [name]: newValue }));

    if (name === 'email') {
      setErrors(prev => ({ ...prev, [name]: newValue && !validateEmail(newValue) ? 'Invalid email format' : '' }));
    } else if (name === 'contactNumber') {
      setErrors(prev => ({
        ...prev,
        [name]: newValue && !validatePhone(newValue) ? 'Format must be (xxx) xxx-xxxx' : ''
      }));
    } else if ((name === 'first_name' || name === 'last_name')) {
      setErrors(prev => ({ ...prev, [name]: newValue.length < 2 ? 'Must be at least 2 characters' : '' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
      setIsEditing(false);
    } else {
      console.error('There was an error updating the client.');
    }
  };

  const handleCancel = () => {
    setClientCopy({ ...selectedClient });
    setErrors({});
    setIsEditing(false);
  };

  const validatePhone = (phone) =>
    /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  const validateEmail = (email) =>
    /^[^\s@]+@[^"]+\.[^"]+$/.test(email);

  const isDirty = JSON.stringify(clientCopy) !== JSON.stringify(selectedClient);
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form className={`space-y-4 w-full grid ${getGridClasses()}`} autoComplete="on">
      {[
        { name: 'first_name', label: 'First Name', type: 'text', minLength: 2, autoComplete: 'given-name' },
        { name: 'last_name', label: 'Last Name', type: 'text', minLength: 2, autoComplete: 'family-name' },
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { name: 'contactNumber', label: 'Contact Number', type: 'tel', autoComplete: 'tel' },
        { name: 'caseNumber', label: 'Case Number', type: 'text', autoComplete: 'off' },
        { name: 'dateReferred', label: 'Date Referred', type: 'date', autoComplete: 'off' },
        { name: 'dob', label: 'DOB', type: 'date', autoComplete: 'bday' },
        { name: 'pin', label: 'PIN', type: 'text', autoComplete: 'new-password' }
      ].map(({ name, label, type, minLength, autoComplete }) => {
        const isValid = clientCopy[name] && !errors[name];
        return (
          <div key={name} className="form-control relative">
            <label htmlFor={name} className="label">
              {label}
            </label>
            {!isEditing ? (
              <p className="py-2 text-base-content/80">{clientCopy[name] || <em>—</em>}</p>
            ) : (
              <>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={clientCopy[name] || ''}
                  onChange={handleChange}
                  className={`input input-bordered pr-10 ${errors[name] ? 'input-error' : isValid ? 'input-success' : ''}`}
                  minLength={minLength}
                  autoComplete={autoComplete}
                  inputMode={name === 'contactNumber' ? 'numeric' : undefined}
                  pattern={name === 'contactNumber' ? '[0-9]*' : undefined}
                />
                {isValid && (
                  <Check className="w-4 h-4 text-success absolute right-3 top-10" />
                )}
              </>
            )}
            {errors[name] && <p className="text-error text-sm mt-1">{errors[name]}</p>}
          </div>
        );
      })}
      {
        <div className="form-control">
          <label htmlFor={'fep'} className="label">
            FEP
          </label>
          {!isEditing ? (
            <p className="py-2 text-base-content/80">{clientCopy['fep'] || <em>—</em>}</p>
          ) : (
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
          )}
        </div>}

      {[{ field: 'navigator', list: navigators },
        { field: 'region', list: ['1', '2', '3', '4', '5', '6'] },
        { field: 'clientStatus', list: ['active', 'inactive', 'in progress', 'graduated'] },
        { field: 'county', list: wisconsinCounties },
        { field: 'group', list: ['adult', 'youth'] }].map((item) => {
        if (clientCopy[item.field] !== undefined && clientCopy[item.field] !== null && clientCopy[item.field].toString().split('').length > 0) {
          return (
            <div key={item.field} className="form-control">
              <label htmlFor={item.field} className="label">
                {item?.field?.charAt(0).toUpperCase() + item?.field?.slice(1)}
              </label>
              {!isEditing ? (
                <p className="py-2 text-base-content/80">{clientCopy[item.field] || <em>—</em>}</p>
              ) : (
                <select
                  autoComplete={item.field}
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
                </select>
              )}
            </div>
          );
        }
      })}

      {selectedClient?.group.toLowerCase() === 'adult' && (
        <div className="form-control">
          <label htmlFor={'schoolIfEnrolled'} className="label">
            schoolIfEnrolled
          </label>
          {!isEditing ? (
            <p className="py-2 text-base-content/80">{clientCopy['schoolIfEnrolled'] || <em>—</em>}</p>
          ) : (
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
          )}
        </div>
      )}

      {selectedClient?.group.toLowerCase() === 'youth' && (
        <div className="form-control">
          <label htmlFor={'schoolIfEnrolled'} className="label">
            schoolIfEnrolled
          </label>
          {!isEditing ? (
            <p className="py-2 text-base-content/80">{clientCopy['schoolIfEnrolled'] || <em>—</em>}</p>
          ) : (
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
          )}
        </div>
      )}

      <div className="form-control">
        <label htmlFor={'ttsDream'} className="label">
          TTS Dream
        </label>
        {!isEditing ? (
          <p className="py-2 text-base-content/80">{clientCopy['ttsDream'] || <em>—</em>}</p>
        ) : (
          <textarea
            id={'ttsDream'}
            name={'ttsDream'}
            value={clientCopy['ttsDream'] || ''}
            onChange={handleChange}
            className="textarea textarea-bordered"
          />
        )}
      </div>

      <div className="flex gap-2 mt-4">
        {!isEditing ? (
          <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSave}
              disabled={!isDirty || hasErrors}
            >
              Save
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </form>
  );
}
