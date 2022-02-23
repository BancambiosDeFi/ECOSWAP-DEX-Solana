import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import SearchForPairingsComponent from '../pages/swap/components/SearchForPairings';

test('should render render search input', async () => {
  const { getByRole } = render(<SearchForPairingsComponent />);
  const listNode = await waitForElement(() => getByRole('isExistSearchComponent'));
  expect(listNode).toBeTruthy();
});
