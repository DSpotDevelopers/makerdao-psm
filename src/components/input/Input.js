import React from "react";
import PropTypes from "prop-types";
import "./Input.scss";

const Input = ({value = '', right = false}) => {
    return <div className={`Input ${right ? 'Right' : ''}`}>{value}</div>
};

Input.propTypes = {
    value: PropTypes.string,
    right: PropTypes.bool
};

export default Input;
