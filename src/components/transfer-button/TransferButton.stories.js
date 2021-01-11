import React from 'react';
import TransferButton from "./TransferButton";

const info = {
    title: 'Transfer Button',
    component: TransferButton
};

export default info;

const Template = args => <TransferButton {...args}/>

export const Default = Template.bind({});
