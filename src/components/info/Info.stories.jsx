import React from 'react';
import Info from './Info';
import dollar from '../../assets/dollar.svg';

const info = {
  title: 'Info',
  component: Info,
};

export default info;

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <Info {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 'Some information',
  img: dollar,
};
