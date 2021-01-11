import React from 'react';
import ConnectButton from "./ConnectButton";

const info = {
    title: 'Connect Button',
    component: ConnectButton
};

export default info;

const Template = (args) => <ConnectButton {...args} />;

export const Default = Template.bind({});

