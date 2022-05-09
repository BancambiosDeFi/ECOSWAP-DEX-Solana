import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { parse } from 'query-string';
import { useLocation } from 'react-router-dom';
import { useReferrer } from '../srm-utils/referrer';
import { notify } from '../srm-utils/notifications';
import { SwapFooter } from './SwapFooter';
import TopBar from './TopBar';

const { Header, Content } = Layout;

export default function BasicLayout({ children }) {
  const { refCode, setRefCode, allowRefLink } = useReferrer();
  const { search } = useLocation();
  const parsed = parse(search);

  useEffect(() => {
    if (!!parsed.refCode && parsed.refCode !== refCode && allowRefLink) {
      notify({ message: `New referrer ${parsed.refCode} added` });
      setRefCode(parsed.refCode);
    }
  }, [parsed, refCode, setRefCode, allowRefLink]);

  return (
    <React.Fragment>
      <Layout style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <Header style={{ padding: 0, minHeight: 54, height: 'unset' }}>
          <TopBar />
        </Header>
        <Content style={{ flex: 1 }}>{children}</Content>
        <SwapFooter />
      </Layout>
    </React.Fragment>
  );
}
