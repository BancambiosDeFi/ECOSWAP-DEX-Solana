import React from 'react';
import { notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import BodyText from '../components/typography/BodyText';
import H3Text from '../components/typography/H3Text';
import SuccessIcon from '../srm-assets/check-circle.svg';
import ErrorIcon from '../srm-assets/close-circle.svg';

export function notify({
  message,
  description,
  type,
}: {
  message: string;
  description?: string | JSX.Element;
  txid?: string;
  type: 'error' | 'success';
  placement?: string;
}) {
  const successMessage = <H3Text style={{ color: 'rgba(236, 38, 245, 1)' }} text={message} />;
  const errorMessage = <H3Text style={{ color: 'rgba(238, 60, 153, 1)' }} text={message} />;
  const successIcon = (
    <img
      alt={'success-icon'}
      src={SuccessIcon}
      style={{ height: '30px', width: '30px', marginTop: '3px' }}
    />
  );
  const errorIcon = (
    <img
      alt={'error-icon'}
      src={ErrorIcon}
      style={{ height: '30px', width: '30px', marginTop: '3px' }}
    />
  );

  notification[type]({
    placement: 'topRight',
    message: type === 'success' ? successMessage : errorMessage,
    description:
      typeof description !== 'string' ? (
        description
      ) : (
        <BodyText style={{ textAlign: 'left' }} text={description} />
      ),
    icon: type === 'success' ? successIcon : errorIcon,
    closeIcon: <CloseOutlined style={{ fontSize: '24px', color: '#FFFFFF' }} />,
    style: {
      width: '495px',
      height: '168px',
      padding: '25px',
      border: '1px solid #0156FF',
      borderRadius: '8px',
      backgroundColor: '#0A0C0E',
    },
  });
}
