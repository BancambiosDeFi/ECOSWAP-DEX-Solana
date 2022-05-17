import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { ImpactPool } from 'impact-pool-api';
import BN from 'bn.js';
import { MintInfo } from '@solana/spl-token';

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
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // @ts-ignore
  return (value.toNumber() / +process.env.REACT_APP_USDT_DECIMALS_MULTIPLIER).toString();
};

export const getFormattedAmount = (
  mintAccount: MintInfo | undefined | null,
  amount: number,
): number => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // @ts-ignore
  return mintAccount && amount
    ? parseFloat(
        amount
          .toLocaleString('en-IN', {
            maximumFractionDigits: mintAccount.decimals,
            useGrouping: false,
          })
          .replace(/,/, '.'),
      )
    : amount;
};

export const getBalance = (connection: Connection, userWallet: PublicKey): Promise<number> => {
  return connection.getBalance(userWallet);
};

export const getUserImpactValue = async (impactPool: ImpactPool): Promise<number> => {
  const userImpactStatistics = await impactPool.getUserImpactStatistics();

  console.log('userImpactStatistics.amount =', userImpactStatistics);
  // console.log('userImpactStatistics.amount.toNumber() =', userImpactStatistics.amount?.toNumber());

  // return userImpactStatistics.amount ? userImpactStatistics.amount.toNumber() : 0;
  return 0;
};

export const converterLamportsToSol = (value: number): number => {
  return value / LAMPORTS_PER_SOL;
};

export const formattedBallance = (balance: number): string => {
  return parseFloat(
    converterLamportsToSol(balance)
      .toLocaleString('en-IN', {
        maximumFractionDigits: 5,
        useGrouping: false,
      })
      .replace(/,/, '.'),
  ).toString();
};
