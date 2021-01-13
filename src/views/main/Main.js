import React from "react";
import "./Main.scss";
import logo from "../../assets/logo.svg";
import ConnectButton from "../../components/connect-button/ConnectButton";
import TransferButton from "../../components/transfer-button/TransferButton";
import Input from "../../components/input/Input";
import Select from "../../components/select/Select";
import DaiImg from "../../assets/dai.png";
import Usdc from "../../assets/usdc.png";
import Button from "../../components/button/Button";

const Main = () => {
    return <div className={'MainContainer'}>
        <div className={'LogoContainer'}>
            <img src={logo} alt="Logo"/>
            <div>PSM</div>
        </div>
        <ConnectButton/>
        <div className={'TradeContainer'}>
            <div className="Side Left">
                <span className={'Label'}>From</span>
                <div style={{marginBottom: '16px'}}>
                    <Input left={true} value={'Enter Amount...'}/>
                </div>
                <Select left={true} value={'DAI'} img={DaiImg}/>
            </div>
            <div className="Center">
                <TransferButton/>
            </div>
            <div className="Side Right">
                <span className={'Label'}>To</span>
                <div style={{marginBottom: '16px'}}>
                    <Input right={true} value={'0.00'}/>
                </div>
                <Select right={true} value={'USDC'} img={Usdc}/>
            </div>
        </div>
        <Button label={'Trade'}/>
        <div className="Copyright">A Maker Community Project</div>
    </div>
};

export default Main;
