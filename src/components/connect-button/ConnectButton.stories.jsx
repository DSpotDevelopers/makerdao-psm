import React from 'react';
import ConnectButton from './ConnectButton';

const info = {
  title: 'Connect Button',
  component: ConnectButton,
};

export default info;

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <ConnectButton {...args} />;

export const Default = Template.bind({});
