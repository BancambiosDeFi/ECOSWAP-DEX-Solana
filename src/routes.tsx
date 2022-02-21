import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import TradePage from './srm-pages/TradePage';
import OpenOrdersPage from './srm-pages/OpenOrdersPage';
import BalancesPage from './srm-pages/BalancesPage';
import ConvertPage from './srm-pages/ConvertPage';
import ListNewMarketPage from './srm-pages/ListNewMarketPage';
import NewPoolPage from './srm-pages/pools/NewPoolPage';
import PoolPage from './srm-pages/pools/PoolPage';
import PoolListPage from './srm-pages/pools/PoolListPage';
// import { getTradePageUrl } from './srm-utils/markets';
import DesignSystemPage from './srm-pages/DesignSystemPage';
import SwapPage from './pages/swap';
import WithdrawPage from './pages/withdraw';

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <Switch>
          <Route exact path="/">
            {/* <Redirect to={getTradePageUrl()} /> */}
            <Redirect to="/swap" />
          </Route>
          <Route exact path="/market/:marketAddress">
            <TradePage />
          </Route>
          <Route exact path="/orders" component={OpenOrdersPage} />
          <Route exact path="/balances" component={BalancesPage} />
          <Route exact path="/convert" component={ConvertPage} />
          <Route exact path="/list-new-market" component={ListNewMarketPage} />
          <Route exact path="/pools">
            <PoolListPage />
          </Route>
          <Route exact path="/pools/new">
            <NewPoolPage />
          </Route>
          <Route exact path="/pools/:poolAddress">
            <PoolPage />
          </Route>
          <Route exact path="/design-system">
            <DesignSystemPage />
          </Route>
          <Route exact path="/swap">
            <SwapPage />
          </Route>
          <Route exact path="/withdraw">
            <WithdrawPage />
          </Route>
        </Switch>
      </HashRouter>
    </>
  );
}
