import React from "react";
import PropTypes from "prop-types";
import "./Input.scss";

const Input = ({value = '', left = false, right = false}) => {
    return <div className={`Input ${left ? 'Left' : ''} ${right ? 'Right' : ''}`}>{value}</div>
};

Input.propTypes = {
    value: PropTypes.string,
    right: PropTypes.bool,
    left: PropTypes.bool,
};

export default Input;
