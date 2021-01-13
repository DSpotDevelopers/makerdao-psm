import React, {useState} from "react";
import PropTypes from "prop-types";
import "./Input.scss";

const Input = ({value = '', left = false, right = false, onChange = () => {}, placeholder = 'Enter Amount...'}) => {
    const [focused, setFocused] = useState(false);
    return <div className={`Input ${left ? 'Left' : ''} ${right ? 'Right' : ''} ${focused ? 'Focused' : ''}`}>
        <input type="number" value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder}/>
    </div>
};

Input.propTypes = {
    value: PropTypes.string,
    right: PropTypes.bool,
    left: PropTypes.bool,
};

export default Input;
