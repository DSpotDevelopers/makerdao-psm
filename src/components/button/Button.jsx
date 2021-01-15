import React from 'react';
import './Button.scss';
import PropTypes from 'prop-types';
import arrowUp from '../../assets/arrow-up.svg';

const Button = ({ label }) => (
  <button type="button" className="Button">
    {label}
    <div className="ArrowGroup">
      <img src={arrowUp} alt="arrow" />
      <img src={arrowUp} alt="arrow" />
      <img src={arrowUp} alt="arrow" />
    </div>
  </button>
);

Button.propTypes = {
  label: PropTypes.string,
};

Button.defaultProps = {
  label: 'Button',
};

export default Button;
