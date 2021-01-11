import React from 'react';

import Button from './Button';

const info = {
    title: 'Button',
    component: Button,
};

export default info;

const Template = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: 'Button',
};
