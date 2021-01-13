import React from 'react';
import TransferButton from './TransferButton';

const info = {
  title: 'Transfer Button',
  component: TransferButton,
};

export default info;

// eslint-disable-next-line react/jsx-filename-extension,react/jsx-props-no-spreading
const Template = (args) => <TransferButton {...args} />;

export const Default = Template.bind({});
