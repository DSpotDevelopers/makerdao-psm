import React from "react";
import "./TransferButton.scss";
import arrowUp from "../../assets/arrow-up.svg";

const TransferButton = () => {
    return <button className={`TransferButton`}><img src={arrowUp} className="img img1" alt={'arrow'}/> <img src={arrowUp} className="img img2" alt={'arrow'}/> </button>;
};

export default TransferButton;
