import React from "react";
import PropTypes from "prop-types";
import error from "../../assets/error-icon.svg";
import "./Notification.scss";

const Notification = ({value = '', type = ''}) => {
    return <div className={`Notification ${type}`}>
        {type === 'Error' && <img className={'Img'} src={error} alt=""/>}
        {value}
    </div>
};

Notification.propTypes  = {
    value: PropTypes.string,
    type: PropTypes.string,
}

export default Notification;
