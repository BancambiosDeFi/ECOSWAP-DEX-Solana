import { TokenListProvider } from '@solana/spl-token-registry';

describe('TokenListProvider', () => {
  it('should return array of objects', async () => {
    const response = await new TokenListProvider().resolve();
    const data = response.getList();
    expect(data).toBeTruthy();
  });
});
