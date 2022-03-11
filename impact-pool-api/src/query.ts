import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { ImpactPoolAccount } from "./models";
import BigNumber from "bignumber.js";


export class ImpactPoolStatistics {
  constructor(
    public impact_pool: ImpactPoolAccount,
    public amount: BN,
    public administrator: PublicKey,
    public is_initialized: boolean,
    public token_pool: PublicKey,
    public tokensInTokenPool: BN
  ) {}

  toString(): string {
    const tokensInTokenPool = new BigNumber(
      this.tokensInTokenPool.toString()
    ).div(LAMPORTS_PER_SOL);

    return (
      `Administrator: ${this.administrator.toString()}\n` +
      `Token pool: ${this.token_pool.toString()}\n` +
      `Tokens in token pool: ${tokensInTokenPool}\n` +
      `IS initialized: ${this.administrator.toString()}\n` +
      `Token pool: ${this.token_pool.toString()}\n` +
      `Tokens in token pool: ${tokensInTokenPool}\n` 
    );
  }
}
