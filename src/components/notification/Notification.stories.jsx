import React from 'react';
import Notification from './Notification';

const info = {
  title: 'Notification',
  component: Notification,
};

export default info;

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <Notification {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 'An error has accrued: something something bad',
  type: '',
};

export const Error = Template.bind({});
Error.args = {
  value: 'An error has accrued: something something bad',
  type: 'Error',
};

export const Success = Template.bind({});
Success.args = {
  value: 'Transaction Successful!',
  type: 'Success',
};
