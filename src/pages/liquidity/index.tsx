import { StakingTabs } from '../../components/StakingTabs';
import SearchForPairingsComponent from '../swap/components/SearchForPairings';
import LiquidityCard from './LiquidityCard';

export const LiquidityContainer = () => {
  return (
    <>
      <StakingTabs />
      <SearchForPairingsComponent type={'none'} width={'600'} />
      <LiquidityCard />
    </>
  );
};
