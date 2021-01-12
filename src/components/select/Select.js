import React from "react";
import PropTypes from "prop-types";
import "../input/Input.scss";
import "./Select.scss";

const Select = ({right = false, value = ''}) => {
    return <div className={`Input ${right ? 'Right' : ''}`}><div className="Img"/>{value}</div>
};

Select.propTypes = {
    value: PropTypes.string,
    right: PropTypes.bool
}

export default Select;
