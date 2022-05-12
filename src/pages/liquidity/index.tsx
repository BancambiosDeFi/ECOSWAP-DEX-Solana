import { useScreenSize } from '../../utils/screenSize';
import { StakingTabs } from '../../components/StakingTabs';
import SearchForPairingsComponent from '../swap/components/SearchForPairings';
import LiquidityCard from './LiquidityCard';

export const LiquidityContainer = () => {
  const { isMobile } = useScreenSize();
  const searchSize = !isMobile ? '470px' : '100%'

  return (
    <>
      <StakingTabs />
      <SearchForPairingsComponent type={'none'} width="470px" />
      <LiquidityCard />
    </>
  );
};
