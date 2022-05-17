import { ConfirmOptions, Connection, PublicKey, Signer } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import Wallet from '@project-serum/sol-wallet-adapter';
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountInfo,
} from '@solana/spl-token';
import { IDL } from '../staking-contract/idl';
import { Staking } from '../staking-contract/staking';

export const getStaking = (wallet: Wallet): Staking => {
  const opts: ConfirmOptions = {
    preflightCommitment: 'recent',
    commitment: 'recent',
  };
  const provider = new Provider(new Connection('https://api.devnet.solana.com'), wallet, opts);

  return new Staking(
    IDL,
    new PublicKey(process.env.REACT_APP_STAKING_PROGRAM_ID as string),
    {
      mainTokenMint: new PublicKey(process.env.REACT_APP_BX_TOKEN_MINT_PUBKEY as string),
      stakingTokenMint: new PublicKey(process.env.REACT_APP_STAKING_TOKEN_MINT_PUBKEY as string),
    },
    provider,
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

export const getAssociatedStakingTokenAccount = async (
  owner: PublicKey,
  address: PublicKey,
  payer: Signer,
): Promise<AccountInfo> => {
  return await new Token(
    new Connection('https://api.devnet.solana.com'),
    owner,
    TOKEN_PROGRAM_ID,
    payer,
  ).getAccountInfo(address);
};
