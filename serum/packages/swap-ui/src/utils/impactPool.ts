import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { ImpactPool } from 'impact-pool-api';
import BN from 'bn.js';
import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

const network: string = process.env.REACT_APP_NETWORK as string;
const pubKey: string = process.env.REACT_APP_IMPACT_PROGRAM_ID as string;
const mint: string = process.env.REACT_APP_MINT as string;
const creator: string = process.env.REACT_APP_CREATOR as string;

export const getNetwork = (): string => {
  return network;
};

export const getPubKey = (): string => {
  return pubKey;
};

export const getImpactPool = (
  payer: PublicKey,
  impactName: string,
): ImpactPool => {
  return new ImpactPool(
    new Connection(network),
    new PublicKey(pubKey),
    new PublicKey(mint),
    new PublicKey(creator),
    payer,
    impactName,
  );
};

export const converterNumberToBN = (value: number): BN => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // @ts-ignore
  return new BN(value * +process.env.REACT_APP_USDT_DECIMALS_MULTIPLIER);
};

export const createAssociatedTokenAccount = async (
  mint: PublicKey,
  owner: PublicKey,
): Promise<{ associatedToken: PublicKey; transaction: Transaction }> => {
  const associatedToken = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    owner,
    false,
  );

  const transaction: Transaction = new Transaction().add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      associatedToken,
      owner,
      owner,
    ),
  );
  return {
    associatedToken,
    transaction,
  };
};
