import React from 'react';
import PropTypes from 'prop-types';
import error from '../../assets/error-icon.svg';
import './Notification.scss';

const Notification = ({ value, type }) => (
  <div className={`Notification ${type}`}>
    {type === 'Error' && <img className="Img" src={error} alt="" />}
    {value.length > 120 ? `${value.substr(0, 120)}...` : value}
  </div>
);

Notification.propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
};

Notification.defaultProps = {
  value: '',
  type: '',
};

export default Notification;
