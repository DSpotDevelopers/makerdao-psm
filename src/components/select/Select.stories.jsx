import React from 'react';
import Select from './Select';
import usdc from '../../assets/usdc.png';
import dai from '../../assets/dai.png';

const info = {
  title: 'Select',
  component: Select,
};

export default info;

// eslint-disable-next-line react/jsx-filename-extension,react/jsx-props-no-spreading
const Template = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 'select',
  right: false,
};

export const Left = Template.bind({});
Left.args = {
  value: 'left select',
  right: false,
  left: true,
  img: dai,
};

export const Right = Template.bind({});
Right.args = {
  value: 'right select',
  right: true,
  left: false,
  img: usdc,
};
