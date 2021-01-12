import React from 'react';
import Select from "./Select";

const info = {
    title: 'Select',
    component: Select
};

export default info;

const Template = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: 'select',
    right: false
};

export const Right = Template.bind({});
Right.args = {
    value: 'right select',
    right: true
};
