import axios from 'axios';

export const API_URL = 'https://api.nomics.com/v1/exchange-rates/history';
export const API_URL_PAIR = 'https://api.nomics.com/v1/exchange_candles';
export const API_KEY = process.env.REACT_APP_NOMICS_API_KEY as string;

export const getQuotesHistorical = (tokenSymbol: string, start: string, end: string) => {
  return axios.get(`${API_URL}`, {
    params: {
      key: API_KEY,
      currency: tokenSymbol,
      start,
      end,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'crossorigin': true,
    },
  });
};

export const getPairQuotesHistorical = (tokensSymbol: string, start: string, end: string) => {
  return axios.get(`${API_URL_PAIR}`, {
    params: {
      key: API_KEY,
      interval: '1d',
      exchange: 'binance',
      market: tokensSymbol,
      start,
      end,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'crossorigin': true,
    },
  });
};
