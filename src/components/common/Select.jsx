import { useId } from 'react';

/**
 * Reusable Select dropdown component
 */
export function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // [{ value: string, label: string }] or string[]
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const selectId = id || name || generatedId;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`form-select ${error ? 'form-input-error' : ''}`}
          {...props}
        >
          {options.map((opt, idx) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const text = isObj ? opt.label : opt;
            return (
              <option key={idx} value={val}>
                {text}
              </option>
            );
          })}
        </select>
      </div>
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && <p className="form-helper">{helperText}</p>}
    </div>
  );
}

export default Select;
