import React from 'react';
import Input from "./Input";

const info = {
    title: 'Input',
    component: Input
};

export default info;

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: '0.00',
    right: false,
    left: false
};

export const Right = Template.bind({});
Right.args = {
    value: '0.00',
    right: true,
    left: false
};


export const Left = Template.bind({});
Left.args = {
    value: '0.00',
    right: false,
    left: true
};
