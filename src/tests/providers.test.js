import { Connection } from '@solana/web3.js';
import { Liquidity } from '@raydium-io/raydium-sdk';
import { TokenListProvider } from '@solana/spl-token-registry';

describe('get data from providers', () => {
  it('should return array of objects from RaydiumProvider', async () => {
    const connection = new Connection('https://solana-api.projectserum.com');
    const data = await Liquidity.fetchAllPoolKeys(connection);
    expect(data.length).toBeTruthy();
  }, 80000);
  it('should return array of objects from SolanaProvider', async () => {
    const response = await new TokenListProvider().resolve();
    const data = response.getList();
    expect(data).toBeTruthy();
  });
});
