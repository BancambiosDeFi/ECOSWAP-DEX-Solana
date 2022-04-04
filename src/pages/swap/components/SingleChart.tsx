import { createChart } from 'lightweight-charts';
import React, { useRef, useEffect } from 'react';
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import { PublicKey } from '@solana/web3.js';
// eslint-disable-next-line import/no-unresolved
import { useTokenMap } from '@serum/swap-ui';
import { chart_api_key } from '../../utils';

const SingleChart = ({ mint }: { mint: PublicKey }) => {
  const tokenMap = useTokenMap();
  const tokenInfo = tokenMap.get(mint.toString());

  const chartContainerRef = useRef() as any;

  const chart_api = `https://min-api.cryptocompare.com/data/exchange/histoday?tsym=${tokenInfo?.symbol}&limit=7&api_key=${chart_api_key}`;

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    const chart = createChart(chartContainerRef.current, {
      width: 320,
      height: 60,
      layout: {
        backgroundColor: 'transparent',
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
      },
      grid: {
        vertLines: {
          color: 'transparent',
        },
        horzLines: {
          color: 'transparent',
        },
      },
    });

    const newSeries = chart.addAreaSeries({
      topColor: '#6FE65C',
      bottomColor: 'transparent',
      lineColor: '#6FE65C',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      priceLineVisible: false,
    });

    fetch(chart_api)
      .then(response => response.json())
      .then(data => {
        const prepeared = data?.Data.map(({ time, volume }) => {
          return {
            value: volume,
            time: moment.unix(time).format('YYYY-MMM-DD'),
          };
        });
        newSeries.setData(prepeared);
        chart.timeScale().fitContent();
      })
      .catch(error => {
        console.error(error);
      });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, []);

  return (
    <section>
      <div ref={chartContainerRef} className="chart-container" />
    </section>
  );
};

export { SingleChart };