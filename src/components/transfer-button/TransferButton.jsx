import React, { useState } from 'react';
import './TransferButton.scss';
import arrowUp from '../../assets/arrow-up.svg';

const TransferButton = () => {
  const [clicked, setClicked] = useState(false);
  const [fulfilled, setFulfilled] = useState(false);

  const handleClick = () => {
    if (!clicked) setClicked(true);
    if (clicked) setFulfilled(true);

    if (clicked && fulfilled) {
      setClicked(false);
      setFulfilled(false);
    }
  };

  return (
    <button type="button" className={`TransferButton ${fulfilled ? 'Fulfilled' : ''} ${clicked ? 'Clicked' : ''}`} onClick={handleClick}>
      {!fulfilled && (
      <>
        <img src={arrowUp} className="img img1" alt="arrow" />
        <img src={arrowUp} className="img img2" alt="arrow" />
      </>
      )}
    </button>
  );
};

export default TransferButton;
