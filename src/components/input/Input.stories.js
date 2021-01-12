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
    right: false
};
