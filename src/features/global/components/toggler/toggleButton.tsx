import React from 'react';

import './toggleButton.styles.css';

const ToggleSwitch = ({
  label = '',
  value,
  onChange,
  isHorizontal = true,
  isDisabled = false
}: {
  label?: string;
  value: boolean;
  onChange: () => void;
  isHorizontal?: boolean;
  isDisabled?: boolean;
}) => {
  const className = `container ${
    isHorizontal ? 'flagTrueHorizontal' : 'flagFalseHorizontal'
  }`;

  return (
    <div className={className}>
      <p>{label} </p>
      <div className="toggle-switch">
        <input
          disabled={isDisabled}
          type="checkbox"
          className="checkbox"
          name={label}
          id={label}
          checked={value}
          onChange={onChange}
        />
        <label className="label" htmlFor={label}>
          <span
            className={`inner ${isDisabled ? 'inner-disabled' : ''}`}
            data-disabled={isDisabled}
          />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
