import React from 'react';
import './Button.scss';
import PropTypes from 'prop-types';
import arrowUp from '../../assets/arrow-up.svg';

const Button = ({ label, onClick }) => (
  <button type="button" className="Button" onClick={onClick}>
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
  onClick: PropTypes.func,
};

Button.defaultProps = {
  label: 'Button',
  onClick: () => {},
};

export default Button;
