import React from 'react';
import PropTypes from 'prop-types';
import '../input/Input.scss';
import './Info.scss';

const Info = ({
  value, img, children,
}) => (
  <div className={`Input Info ${img ? 'HasImg' : ''}`}>
    {img && <img className="Img" src={img} alt="Icon" />}
    {!children && value}
    {children && children}
  </div>
);

Info.propTypes = {
  value: PropTypes.string,
  img: PropTypes.string,
  children: PropTypes.element,
};

Info.defaultProps = {
  value: '',
  img: '',
  children: null,
};

export default Info;
