import styled from 'styled-components';
import { Col, Row } from 'antd';
import ConvertForm from '../srm-components/ConvertForm';
import { DEFAULT_MARKET, MarketProvider } from '../srm-utils/markets';
import { useLocalStorageState } from '../srm-utils/utils';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px;
  .borderNone .ant-select-selector {
    border: none !important;
  }
`;

export default function ConvertPage() {
  const [marketAddress, setMarketAddress] = useLocalStorageState(
    'marketAddress',
    DEFAULT_MARKET?.address.toBase58(),
  );

  return (
    <Wrapper style={{ flex: 1, paddingTop: 10 }}>
      <Row justify="center">
        <Col>
          <MarketProvider marketAddress={marketAddress} setMarketAddress={setMarketAddress}>
            <ConvertForm />
          </MarketProvider>
        </Col>
      </Row>
    </Wrapper>
  );
}
