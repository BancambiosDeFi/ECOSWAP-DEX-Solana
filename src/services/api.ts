import axios from 'axios';

// export const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical';
export const API_URL = 'https://api.nomics.com/v1/exchange-rates/history';
export const API_KEY = 'a0d947e2da0f40f0cf0b078c07100329c1e25369';

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
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
  });
};
