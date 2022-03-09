import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { SwapFooter } from '../srm-components/SwapFooter';

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

test('should render footer', async () => {
  const { getByRole } = render(<SwapFooter />);
  const listNode = await waitForElement(() => getByRole('isExistFooterComponent'));
  expect(listNode).toBeTruthy();
});
