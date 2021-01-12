import React from "react";
import PropTypes from "prop-types";
import "../input/Input.scss";
import "./Select.scss";
import arrowUp from "../../assets/arrow-up.svg";

const Select = ({right = false, left = false, value = '', img = ''}) => {
    return <div className={'SelectWrapper'}>
        {left && <img className={'ArrowLeft'} src={arrowUp} alt="left"/>}
        <div className={`Input Select ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}>
            {img && <img className="Img" src={img} alt={'currency'}/>}
            {value}
        </div>
        {right && <img className={'ArrowRight'} src={arrowUp} alt="right"/>}
    </div>
};

Select.propTypes = {
    value: PropTypes.string,
    left: PropTypes.bool,
    right: PropTypes.bool,
    img: PropTypes.string
}

export default Select;
