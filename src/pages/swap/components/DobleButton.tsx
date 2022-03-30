import { useState } from 'react';
import styled from 'styled-components';

const TabsStyled = styled.div`
  display: flex;
  user-select: none;
  margin-bottom: 20px;
`;
const ButtonTabs = styled.button`
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: ${({ background }) => background};
  width: 136px;
  height: 56px;
  border-radius: 12px;
`;

export default function DoubleButton() {
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
                ? 'linear-gradient(#ec26f5 100%, #9f5ae5 100%)'
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
