// eslint-disable react/forbid-prop-types

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const Input = ({
  value, left, right, onChange, placeholder,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`Input ${left ? 'Left' : ''} ${right ? 'Right' : ''} ${focused ? 'Focused' : ''}`}>
      <input
        type="number"
        value={value}
        step="0.01"
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
      />
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  right: PropTypes.bool,
  left: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

Input.defaultProps = {
  value: '',
  right: false,
  left: false,
  onChange: () => {},
  placeholder: 'Enter Amount...',
};

export default Input;
