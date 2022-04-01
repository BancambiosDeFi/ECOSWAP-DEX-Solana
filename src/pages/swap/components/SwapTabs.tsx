import { useState } from 'react';
import styled from 'styled-components';

const TabsStyled = styled.div`
  display: flex;
  user-select: none;
  margin-bottom: 20px;
`;
const ButtonTabs = styled.button`
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: ${({ background }) => background};
  width: 123px;
  height: 52px;
  border-radius: 12px;
  &:hover {
    border: 1px solid #0156ff;
  }
`;

export default function SwapTabs() {
  const [activeTab, setActiveTab] = useState('swap');
  const TabsButtons = ['Swap', 'Liquidity'];
  const tabContent = {
    swap: 1,
    liquidity: 2,
  };

  return (
    <TabsStyled>
      {TabsButtons.map(tab => {
        return (
          <ButtonTabs
            key={tab}
            onClick={() => setActiveTab(tab.toLocaleLowerCase())}
            background={
              activeTab === tab.toLocaleLowerCase()
                ? 'linear-gradient(267.38deg, #EC26F5 6.33%, #9F5AE5 108.12%);'
                : '#202124'
            }
          >
            {tab}
          </ButtonTabs>
        );
      })}
    </TabsStyled>
  );
}
