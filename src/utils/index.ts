import BN from 'bn.js';
import { Connection, PublicKey } from '@solana/web3.js';
import { ImpactPool } from 'impact-pool-api';
// const bigNumber = require('bignumber.js');

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

export const getImpactPool = (impactName: string): ImpactPool => {
  console.log('network =', network);
  console.log('Program ID =', pubKey);
  console.log('mint =', mint);
  console.log('creator =', creator);
  return new ImpactPool(
    new Connection(network),
    new PublicKey(pubKey),
    new PublicKey(mint),
    new PublicKey(creator),
    impactName,
  );
};

// export const converterBN = (number: { toString: () => string }): string =>
//   new bigNumber(number.toString())
//     // .dividedBy(LAMPORTS_PER_SOL)
//     .toString();
