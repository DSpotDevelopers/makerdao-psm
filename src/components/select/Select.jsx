import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../input/Input.scss';
import './Select.scss';
import arrowUp from '../../assets/arrow-up.svg';

const Select = ({
  right, left, value, elements, handleClick,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [opened, setOpened] = useState(false);
  const toggleOpened = () => setOpened(!opened);
  const elementsToShow = elements.filter((x) => x.name !== value.name);

  return (
    <div className={`SelectWrapper ${left ? 'Left' : ''} ${right ? 'Right' : ''} ${opened ? 'Opened' : ''} no-select`} onMouseLeave={() => setOpened(false)}>
      <div
        className={`Background ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}
        style={{
          height: !opened ? '64px' : `${64 + 64 * elementsToShow.length}px`,
          top: '0',
        }}
      />
      {left && <img className="ArrowLeft" src={arrowUp} alt="left" />}
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <div className={`Input Select ${left ? 'Left' : ''} ${right ? 'Right' : ''}`} onClick={toggleOpened} role="list">
        {value.image && <img className="Img" src={value.image} alt="currency" />}
        {value.name}
      </div>
      {opened && (
      <div className={`Options ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}>
        {elementsToShow.map((el, i) => (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div
            className={`Input Select ${left ? 'Left' : ''} ${right ? 'Right' : ''} ${i === elementsToShow.length - 1 ? 'Last' : ''}`}
            onClick={() => {
              setOpened(false);
              handleClick(el, left);
            }}
          >
            {el.image && <img className="Img" src={el.image} alt="currency" />}
            {el.name}
          </div>
        ))}
      </div>
      )}
      {right && <img className="ArrowRight" src={arrowUp} alt="right" />}
    </div>
  );
};

Select.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  left: PropTypes.bool,
  right: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  elements: PropTypes.array,
  handleClick: PropTypes.func,
};

Select.defaultProps = {
  value: '',
  left: false,
  right: false,
  elements: [],
  handleClick: () => {},
};

export default Select;
