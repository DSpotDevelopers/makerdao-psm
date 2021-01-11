import React from 'react';
import "./Button.scss";
import PropTypes from "prop-types";

const Button = ({label}) => {
    return <button className={`Button`}>{label}</button>;
}

Button.propTypes = {
    label: PropTypes.string
}


Button.defaultProps = {
    label: 'Footer title'
};


export default Button;
