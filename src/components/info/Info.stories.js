import React from 'react';
import Info from "./Info";
import dollar from "../../assets/dollar.svg";

const info = {
    title: 'Info',
    component: Info
};

export default info;

const Template = (args) => <Info {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: 'Some information',
    img: dollar
};
