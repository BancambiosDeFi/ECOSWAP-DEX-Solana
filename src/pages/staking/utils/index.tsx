import { ConfirmOptions, Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import Wallet from '@project-serum/sol-wallet-adapter';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountInfo,
  MintInfo,
} from '@solana/spl-token';
import { BigNumber } from 'bignumber.js';
import BN from 'bn.js';
import { Staking } from '../staking-contract/staking';

export const getNetwork = (): string => {
  // return process.env.REACT_APP_NETWORK as string;
  return 'https://api.devnet.solana.com';
};

export const getStaking = (wallet: Wallet): Staking => {
  const opts: ConfirmOptions = {
    preflightCommitment: 'recent',
    commitment: 'recent',
  };

  const provider = new Provider(new Connection(getNetwork()), wallet, opts);

  return new Staking(
    new PublicKey(process.env.REACT_APP_STAKING_PROGRAM_ID as string),
    {
      mainTokenMint: new PublicKey(process.env.REACT_APP_BX_TOKEN_MINT_PUBKEY as string),
      stakingTokenMint: new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
    },
    provider,
  );
};

export const getAssociatedBxTokenAddress = async (owner: PublicKey): Promise<PublicKey> => {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(process.env.REACT_APP_BX_TOKEN_MINT_PUBKEY as string),
    owner,
  );
};

export const getAssociatedStakingTokenAddress = async (owner: PublicKey): Promise<PublicKey> => {
  return await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
    owner,
  );
};

export const getAssociatedTokenAccount = async (
  owner: PublicKey,
  mint: PublicKey,
  address: PublicKey,
): Promise<AccountInfo> => {
  return await new Token(new Connection('https://api.devnet.solana.com'), mint, TOKEN_PROGRAM_ID, {
    publicKey: owner,
    secretKey: new Uint8Array(),
  }).getAccountInfo(address);
};

export const createAssociatedStakingTokenAccountInstruction = (
  owner: PublicKey,
  address: PublicKey,
): TransactionInstruction => {
  return Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
    address,
    owner,
    owner,
  );
};

export const convertStakingValueToBnAmount = (value: number, decimals: number): BN => {
  return new BN(
    new BigNumber(value)
      .multipliedBy(Math.pow(10, decimals))
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString(),
  );
};

export const convertBnAmountToDisplayBalance = (amount: BN, decimals: number): number => {
  return new BigNumber(amount.toString()).dividedBy(Math.pow(10, decimals)).toNumber();
};

export const calculateApr = (totalStaked: number, accumulatedReward: number): string => {
  return (
    new BigNumber(process.env.REACT_APP_STAKING_YEARLY_REWARD as string)
      .dividedBy(new BigNumber(totalStaked))
      .multipliedBy(new BigNumber(accumulatedReward))
      .integerValue(BigNumber.ROUND_FLOOR)
      // .toPrecision(3)
      .toString()
  );
};

export const getStakingTokenMintInfo = async (owner: PublicKey): Promise<MintInfo> => {
  return await new Token(
    new Connection('https://api.devnet.solana.com'),
    new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
    TOKEN_PROGRAM_ID,
    {
      publicKey: owner,
      secretKey: new Uint8Array(),
    },
  ).getMintInfo();
};
