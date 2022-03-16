import { Connection, PublicKey } from '@solana/web3.js';
import { ImpactPool } from 'impact-pool-api';
import BN from 'bn.js';

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

export const getImpactPool = (payer: PublicKey, impactName: string): ImpactPool => {
  return new ImpactPool(
    new Connection(network),
    new PublicKey(pubKey),
    new PublicKey(mint),
    new PublicKey(creator),
    payer,
    impactName,
  );
};

export const converterBNtoString = (value: BN): string => {
  return value.div(new BN(process.env.REACT_APP_LAMPORTS_PER_SOL as string)).toString();
};
