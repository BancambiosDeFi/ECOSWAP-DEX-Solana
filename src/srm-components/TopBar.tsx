import { Menu } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Connection } from '@solana/web3.js';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { ReactComponent as KebubMenuIcon } from '../assets/icons/Kabab_Menu.svg';
import { ReactComponent as WalletIcon } from '../assets/icons/Wallet.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/Close_icon.svg';
import logo from '../srm-assets/logo.png';
import { useWallet } from '../components/wallet/wallet';
import { ENDPOINTS, useConnectionConfig } from '../srm-utils/connection';
import { EndpointInfo } from '../srm-utils/types';
import { notify } from '../srm-utils/notifications';
import WalletConnect from '../components/wallet/WalletConnect';
import { getTradePageUrl } from '../srm-utils/markets';
import UserWalletHeaderMenu from '../components/wallet/UserWalletHeaderMenu';

const RESPONSIVE_SIZE = 785;

const pages = [
  {
    label: 'Home',
    key: '/home',
  },
  {
    label: 'Stableswap',
    key: '/swap',
  },
  {
    label: 'Staking',
    key: '/staking',
  },
  {
    label: 'Alphatrade',
    key: getTradePageUrl(),
  },
  {
    label: 'Catapult',
    key: '/catapult',
  },
  {
    label: 'NFT',
    key: '/nft',
  },
  {
    label: 'Token Sale',
    key: '/tokenSale',
  },
];

const Wrapper = styled.div`
  background-color: #04030a;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0px 100px;
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
const useStyles = makeStyles(() => ({
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
      color: '#0156ff ',
    },
    '@media(max-width: 1050px)': {
      fontSize: '15px',
      margin: 'auto 14px !important',
    },
    '@media(max-width: 850px)': { fontSize: '14px', margin: 'auto 7px !important' },
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

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: '191px',
    backgroundColor: 'rgba(30, 32, 34, 1)',
  },
}));

const StyledListItemText = styled(ListItemText)(() => ({
  '& .MuiTypography-root': {
    fontFamily: 'Saira',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '40px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#FFFFFF',
    paddingLeft: '16px',
  },
}));

const TopBar: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { connected, connect, disconnect, wallet } = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    // endpoint,
    endpointInfo,
    setEndpoint,
    availableEndpoints,
    setCustomEndpoints,
  } = useConnectionConfig();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addEndpointVisible, setAddEndpointVisible] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const [isScreenLess, setIsScreenLess] = useState<boolean>(window.innerWidth < RESPONSIVE_SIZE);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('');

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const resizeHandler = (): void => {
    setIsScreenLess(window.innerWidth < RESPONSIVE_SIZE);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [resizeHandler]);

  const handleClick = useCallback(
    e => {
      if (!(e.key in EXTERNAL_LINKS)) {
        history.push(e.key);
      }
    },
    [history],
  );

  const handleClickDrawer = pageKey => {
    if (!(pageKey in EXTERNAL_LINKS)) {
      history.push(pageKey);
    }
  };

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

  useEffect(() => {
    const pageIndex = pages.findIndex(page => page.key === location.pathname);
    if (pageIndex !== -1) {
      setSelectedTab(pages[pageIndex].label);
    }
  }, [location.pathname]);

  const smallScreenTopBar = (
    <>
      <Wrapper
        style={{
          height: '54px',
          background: '#1E2022',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: '54px',
          padding: '0 20px',
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ mr: 2, ...(isDrawerOpen && { display: 'none' }) }}
        >
          <KebubMenuIcon />
        </IconButton>
        <Typography
          sx={{
            fontFamily: 'Saira',
            fontStyle: 'normal',
            fontWeight: '700',
            fontSize: '20px',
            lineHeight: '31px',
            letterSpacing: '0em',
            textAlign: 'left',
            color: '#FFFFFF',
          }}
        >
          {selectedTab}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="connect wallet"
          onClick={connected ? disconnect : connect}
          edge="start"
        >
          <WalletIcon />
        </IconButton>
      </Wrapper>
      <StyledDrawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
        <Box role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '19px 14px 13px 24px',
            }}
          >
            <Box sx={{ marginLeft: '2px' }} onClick={() => history.push(tradePageUrl)}>
              <img src={logo} alt="" style={{ width: '107px', height: '29px' }} />
            </Box>
            <IconButton
              color="inherit"
              aria-label="close drawer"
              onClick={handleDrawerToggle}
              sx={{ padding: 0 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider
            sx={{
              border: '0.5px solid',
              borderImage:
                'linear-gradient(to right, rgba(236, 38, 245, 0.5), rgba(1, 86, 255, 0.5)) 0.5',
            }}
          />
          <List>
            {pages.map(page => (
              <ListItem
                button
                onClick={() => {
                  handleClickDrawer(page.key);
                }}
                key={page.key}
              >
                <StyledListItemText primary={page.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </StyledDrawer>
    </>
  );

  return (
    <>
      {isScreenLess ? (
        smallScreenTopBar
      ) : (
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
              {pages.map(page => (
                <Menu.Item
                  key={page.label === 'Alphatrade' ? tradePageUrl : page.key}
                  className={classes.headerItem}
                >
                  {page.label}
                </Menu.Item>
              ))}
            </Menu>
            {!connected ? <WalletConnect /> : <UserWalletHeaderMenu />}
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default TopBar;
