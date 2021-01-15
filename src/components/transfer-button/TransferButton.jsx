import React from 'react';
import './TransferButton.scss';
import PropTypes from 'prop-types';
import arrowUp from '../../assets/arrow-up.svg';

const TransferButton = ({ circleState }) => (
  <button type="button" className={`TransferButton ${circleState === 1 ? 'Hovered' : ''} ${circleState === 3 ? 'Fulfilled' : ''} ${circleState === 2 ? 'Clicked' : ''}`}>
    {!circleState < 3 && (
      <>
        <img src={arrowUp} className="img img1" alt="arrow" />
        <img src={arrowUp} className="img img2" alt="arrow" />
      </>
    )}
  </button>
);

TransferButton.propTypes = {
  circleState: PropTypes.number,
};

TransferButton.defaultProps = {
  circleState: 0,
};

export default TransferButton;
