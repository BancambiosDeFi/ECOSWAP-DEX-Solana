import React, { FC } from 'react';
import { notification } from 'antd';

export function notify({
  message,
  description,
  txid,
  type,
  placement = 'topRight',
}: {
  message: string;
  description?: string | JSX.Element;
  txid?: string;
  type: 'error' | 'success' | 'info';
  placement?: string;
}) {
  notification[type]({
    message: message,
    description: <span style={{ color: '#fff' }}>{description}</span>,
    style: {
      padding: '25px',
      border: '1px solid #0156FF',
      borderRadius: '8px',
      backgroundColor: '#0A0C0E',
    },
  });
}
