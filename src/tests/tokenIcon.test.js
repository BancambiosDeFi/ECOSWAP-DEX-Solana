import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { TokenIcon } from '../pages/swap/components/TokenIcon';

jest.mock('../../serum/packages/swap-ui', () => {
  return {
    useOwnedTokenAccount: () => ({ account: { amount: { toNumber: jest.fn() } } }),
    useMint: () => ({ decimals: 0 }),
    useTokenMap: () => ({
      get: jest.fn(() => {
        return { logoURI: 'a' };
      }),
    }),
  };
});

test('should render tokenIcon component', async () => {
  const { getByRole } = render(
    <TokenIcon style={{ margin: '20px' }} mint="kmk" onError={undefined} />,
  );
  const listNode = await waitForElement(() => getByRole('isExistTokenIconComponent'));
  expect(listNode).toBeTruthy();
});
