import React from 'react';
import { notification } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { makeStyles } from '@mui/styles';
import BodyText from '../components/typography/BodyText';
import H3Text from '../components/typography/H3Text';
import { ReactComponent as SuccessIcon } from '../srm-assets/check-circle.svg';
import { ReactComponent as ErrorIcon } from '../srm-assets/close-circle.svg';

const getNotificationData = (
  type: 'success' | 'error' | 'info',
  message: string,
): { icon: JSX.Element; notificationMessage: JSX.Element } => {
  const successMessage = <H3Text style={{ color: 'rgba(236, 38, 245, 1)' }} text={message} />;
  const infoMessage = <H3Text style={{ color: 'rgba(1, 86, 255, 1)' }} text={message} />;
  const errorMessage = <H3Text style={{ color: 'rgba(238, 60, 153, 1)' }} text={message} />;
  const successIcon = (
    <SuccessIcon
      style={{ height: '30px', width: '30px', marginTop: '3px', stroke: 'rgba(236, 38, 245, 1)' }}
    />
  );
  const infoIcon = (
    <SuccessIcon
      style={{ height: '30px', width: '30px', marginTop: '3px', stroke: 'rgba(1, 86, 255, 1)' }}
    />
  );
  const errorIcon = <ErrorIcon style={{ height: '30px', width: '30px', marginTop: '3px' }} />;

  switch (type) {
    case 'success':
      return { icon: successIcon, notificationMessage: successMessage };
    case 'info':
      return { icon: infoIcon, notificationMessage: infoMessage };
    case 'error':
      return { icon: errorIcon, notificationMessage: errorMessage };
    default:
      throw new Error(`Unrecognized notification type: ${type}`);
      break;
  }
};

export function notify({
  message,
  description,
  type,
}: {
  message: string;
  description?: string | JSX.Element;
  txid?: string;
  type: 'error' | 'success' | 'info';
  placement?: string;
}) {
  const { notificationMessage, icon } = getNotificationData(type, message);

  notification[type]({
    placement: 'topRight',
    message: notificationMessage,
    description:
      typeof description !== 'string' ? (
        description
      ) : (
        <BodyText style={{ textAlign: 'left' }} text={description} />
      ),
    icon,
    closeIcon: <CloseOutlined style={{ fontSize: '24px', color: '#FFFFFF' }} />,
    style: {
      padding: '25px',
      border: '1px solid #0156FF',
      borderRadius: '8px',
      backgroundColor: '#0A0C0E',
    },
  });
}

const useStyles = makeStyles(() => ({
  text: {
    color: '#fff',
    marginRight: '5px',
  },
  link: {
    'color': '#fff',
    '&:hover': {
      underline: '1px solid #fff',
    },
  },
}));

export function SolscanDescription({ txid }: { txid: string }) {
  const styles = useStyles();

  return (
    <div>
      <span className={styles.text}>View on</span>
      <a
        className={styles.link}
        href={`https://solscan.io/tx/${txid}`}
        target="_blank"
        rel="noreferrer"
      >
        Solscan
      </a>
    </div>
  );
}
