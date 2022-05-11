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
    public impact_pool_address: PublicKey,
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
      `Impact pool address: ${this.impact_pool_address.toString()}\n` 
    );
  }
}


export class UserImpactStatistics {
  constructor(
    public amount: BN | undefined,
    public user: PublicKey | undefined,
    public is_initialized: Boolean | undefined,

  ) {}
}
