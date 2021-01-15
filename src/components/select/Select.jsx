import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../input/Input.scss';
import './Select.scss';
import arrowUp from '../../assets/arrow-up.svg';

const Select = ({
  right, left, value, img,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [opened, setOpened] = useState(false);
  const toggleOpened = () => setOpened(!opened);

  return (
    <div className={`SelectWrapper ${left ? 'Left' : ''} ${right ? 'Right' : ''} ${opened ? 'Opened' : ''} no-select`} onMouseLeave={() => setOpened(false)}>
      <div
        className={`Background ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}
        style={{
          height: !opened ? '64px' : `${64 + 64 * 2}px`,
          top: '0',
        }}
      />
      {left && <img className="ArrowLeft" src={arrowUp} alt="left" />}
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <div className={`Input Select ${left ? 'Left' : ''} ${right ? 'Right' : ''}`} onClick={toggleOpened} role="list">
        {img && <img className="Img" src={img} alt="currency" />}
        {value}
      </div>
      {opened && (
      <div className={`Options ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}>
        <div className={`Input Select ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}>
          {img && <img className="Img" src={img} alt="currency" />}
          {value}
        </div>
        <div className={`Input Select ${left ? 'Left' : ''} ${right ? 'Right' : ''} Last`}>
          {img && <img className="Img" src={img} alt="currency" />}
          {value}
        </div>
      </div>
      )}
      {right && <img className="ArrowRight" src={arrowUp} alt="right" />}
    </div>
  );
};

Select.propTypes = {
  value: PropTypes.string,
  left: PropTypes.bool,
  right: PropTypes.bool,
  img: PropTypes.string,
};

Select.defaultProps = {
  value: '',
  left: false,
  right: false,
  img: '',
};

export default Select;
