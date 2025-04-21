import React from 'react';

export default function InputVariants({
                                        label,
                                        name,
                                        handleChange,
                                        disabled,
                                        options,
                                        value,
                                        type,
                                        placeholder,
                                        error
                                      }) {
  // Format date values properly
  const formatDateValue = () => {
    if (!value) return '';

    try {

      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return '';
    } catch (error) {
      console.error(`Error formatting date for ${name}:`, error);
      return '';
    }
  };

  return (
    <div>
      {type === 'select' ? (
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{label}</legend>
            <select
              value={value || ''}
              className="select w-full"
              disabled={disabled}
              name={name}
              onChange={handleChange}
            >
              <option value="">Select {label}</option>
              {Array.isArray(options) && options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </fieldset>
        </div>
      ) : type === 'textarea' ? (
        <div className="flex flex-col">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{label}</legend>
            <textarea
              className="textarea"
              name={name}
              onChange={handleChange}
              value={value || ''}
              disabled={disabled}
              placeholder={placeholder}
              rows={4}
            />
          </fieldset>
        </div>
      ) : (
        <div className="flex flex-col">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">{label}</legend>
            <input
              type={type}
              className={`input w-full ${error ? 'input-error' : ''}`}
              name={name}
              onChange={handleChange}
              defaultValue={type === 'date' ? formatDateValue() : (value || '')}
              disabled={disabled}
              placeholder={placeholder}
            />
          </fieldset>
        </div>
      )}
      {error && <div className={`text-xs text-error p-1`}>{error}</div>}
    </div>
  );
}
