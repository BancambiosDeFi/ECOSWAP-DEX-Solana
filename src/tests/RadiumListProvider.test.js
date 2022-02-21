import { Connection } from '@solana/web3.js';
import { Liquidity } from '@raydium-io/raydium-sdk';

describe('RadiumTokenListProvider', () => {
  it('should return array of objects', async () => {
    const connection = new Connection('https://solana-api.projectserum.com');
    const data = await Liquidity.fetchAllPoolKeys(connection);
    expect(data.length).toBeTruthy();
  });
});
