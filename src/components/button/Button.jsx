import React from 'react';
import './Button.scss';
import PropTypes from 'prop-types';

const Button = ({ label }) => <button type="button" className="Button">{label}</button>;

Button.propTypes = {
  label: PropTypes.string,
};

Button.defaultProps = {
  label: 'Button',
};

export default Button;
