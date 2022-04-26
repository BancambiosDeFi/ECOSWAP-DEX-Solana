import { Menu } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Connection } from '@solana/web3.js';
import { makeStyles } from '@mui/styles';
import logo from '../srm-assets/logo.png';
import { useWallet } from '../components/wallet/wallet';
import { ENDPOINTS, useConnectionConfig } from '../srm-utils/connection';
import { EndpointInfo } from '../srm-utils/types';
import { notify } from '../srm-utils/notifications';
import WalletConnect from '../components/wallet/WalletConnect';
import { getTradePageUrl } from '../srm-utils/markets';
import UserWalletHeaderMenu from '../components/wallet/UserWalletHeaderMenu';

const Wrapper = styled.div`
  background-color: #04030a;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0px 100px;
  flex-wrap: wrap;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #0156ff !important;
  font-weight: bold;
  padding-bottom: 10px;
  cursor: pointer;
  img {
    height: 56px;
    margin-right: 8px;
  }
`;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles(theme => ({
  headerItem: {
    'fontFamily': 'Saira',
    'fontStyle': 'normal',
    'fontWeight': '800',
    'fontSize': '16px',
    'lineHeight': '250%',
    '&:hover': {
      color: '#0156ff !important',
    },
    '&:selected': {
      color: '#0156ff !important',
    },
  },
}));

const EXTERNAL_LINKS = {
  '/learn': 'https://docs.projectserum.com/trade-on-serum-dex/trade-on-serum-dex-1',
  '/add-market': 'https://serum-academy.com/en/add-market/',
  '/wallet-support': 'https://serum-academy.com/en/wallet-support',
  '/dex-list': 'https://serum-academy.com/en/dex-list/',
  '/developer-resources': 'https://serum-academy.com/en/developer-resources/',
  '/explorer': 'https://solscan.io',
  '/srm-faq': 'https://projectserum.com/srm-faq',
  // '/swap': 'https://swap.projectserum.com',
};

export default function TopBar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { connected, wallet } = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    // endpoint,
    endpointInfo,
    setEndpoint,
    availableEndpoints,
    setCustomEndpoints,
  } = useConnectionConfig();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addEndpointVisible, setAddEndpointVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [testingConnection, setTestingConnection] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const handleClick = useCallback(
    e => {
      if (!(e.key in EXTERNAL_LINKS)) {
        history.push(e.key);
      }
    },
    [history],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onAddCustomEndpoint = (info: EndpointInfo) => {
    const existingEndpoint = availableEndpoints.some(e => e.endpoint === info.endpoint);
    if (existingEndpoint) {
      notify({
        message: `An endpoint with the given url already exists`,
        type: 'error',
      });

      return;
    }

    const handleError = e => {
      console.log(`Connection to ${info.endpoint} failed: ${e}`);
      notify({
        message: `Failed to connect to ${info.endpoint}`,
        type: 'error',
      });
    };

    try {
      const connection = new Connection(info.endpoint, 'recent');
      connection
        .getBlockTime(0)
        .then(() => {
          setTestingConnection(true);
          console.log(`testing connection to ${info.endpoint}`);
          const newCustomEndpoints = [...availableEndpoints.filter(e => e.custom), info];
          setEndpoint(info.endpoint);
          setCustomEndpoints(newCustomEndpoints);
        })
        .catch(handleError);
    } catch (e) {
      handleError(e);
    } finally {
      setTestingConnection(false);
    }
  };

  const endpointInfoCustom = endpointInfo && endpointInfo.custom;
  useEffect(() => {
    const handler = () => {
      if (endpointInfoCustom) {
        setEndpoint(ENDPOINTS[0].endpoint);
      }
    };
    window.addEventListener('beforeunload', handler);

    return () => window.removeEventListener('beforeunload', handler);
  }, [endpointInfoCustom, setEndpoint]);

  const tradePageUrl = location.pathname.startsWith('/market/')
    ? location.pathname
    : getTradePageUrl();

  return (
    <>
      <Wrapper
        style={{
          height: '95px',
          background: '#04030A',
          display: 'flex',
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        <LogoWrapper style={{ paddingBottom: '10px' }} onClick={() => history.push(tradePageUrl)}>
          <img src={logo} alt="" />
        </LogoWrapper>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Menu
            mode="horizontal"
            onClick={handleClick}
            selectedKeys={[location.pathname]}
            style={{
              borderBottom: 'none',
              backgroundColor: 'transparent',
              justifyContent: 'flex-end',
              paddingBottom: '16px',
            }}
          >
            <Menu.Item key="/home" className={classes.headerItem}>
              Home
            </Menu.Item>
            <Menu.Item key="/swap" className={classes.headerItem}>
              Stableswap
            </Menu.Item>
            <Menu.Item key="/staking" className={classes.headerItem}>
              Staking
            </Menu.Item>
            <Menu.Item key={tradePageUrl} className={classes.headerItem}>
              Alphatrade
            </Menu.Item>
            <Menu.Item key="/catapult" className={classes.headerItem}>
              Catapult
            </Menu.Item>
            <Menu.Item key="/nft" className={classes.headerItem}>
              NFT
            </Menu.Item>
            <Menu.Item key="/tokenSale" className={classes.headerItem}>
              Token Sale
            </Menu.Item>
          </Menu>
          {!connected ? <WalletConnect /> : <UserWalletHeaderMenu />}
        </div>
      </Wrapper>
    </>
  );
}
