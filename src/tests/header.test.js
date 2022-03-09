import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import TopBar from '../srm-components/TopBar';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/example/path',
  }),
}));
jest.mock('../components/wallet/wallet', () => {
  return {
    useWallet: () => {
      return {
        wallet: { autoApprove: false },
      };
    },
  };
});
jest.mock('../srm-utils/connection', () => {
  return {
    useConnectionConfig: () => {
      return {
        endpoint: '',
        endpointInfo: '',
        setEndpoint: '',
        availableEndpoints: [],
        setCustomEndpoints: '',
      };
    },
  };
});

test('should render header', async () => {
  const { getByRole } = render(<TopBar />);
  const listNode = await waitForElement(() => getByRole('isExistHeaderComponent'));
  expect(listNode).toBeTruthy();
});
