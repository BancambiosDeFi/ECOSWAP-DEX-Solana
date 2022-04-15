import * as assert from 'assert';
import React, { useContext, useState, useEffect } from 'react';
import { useAsync } from 'react-async-hook';
import {
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  Signer,
  TransactionSignature,
} from '@solana/web3.js';
import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN, Provider } from '@project-serum/anchor';
import { Market } from '../../../serum';
import { SRM_MINT, USDC_MINT, USDT_MINT } from '../utils/pubkeys';
import {
  useFairRoute,
  useRouteVerbose,
  useDexContext,
  useMarket,
  useOpenOrders,
  FEE_MULTIPLIER,
} from './Dex';
import {
  useTokenListContext,
  SPL_REGISTRY_SOLLET_TAG,
  SPL_REGISTRY_WORM_TAG,
} from './TokenList';
import { useMint, useOwnedTokenAccount } from './Token';
import { SOL_MINT, WRAPPED_SOL_MINT } from '../utils/pubkeys';
import { TransferTokens } from 'impact-pool-api/dist/schema';
import { converterNumberToBN, getImpactPool } from '../utils/impactPool';

const DEFAULT_SLIPPAGE_PERCENT = 0.1;
const DEFAULT_IMPACT_USDT_VALUE = 0.5;

export type SwapContext = {
  // Mint being traded from. The user must own these tokens.
  fromMint: PublicKey;
  setFromMint: (m: PublicKey) => void;

  // Mint being traded to. The user will receive these tokens after the swap.
  toMint: PublicKey;
  setToMint: (m: PublicKey) => void;

  // Amount used for the swap.
  fromAmount: number;
  setFromAmount: (a: number) => void;

  // *Expected* amount received from the swap.
  toAmount: number;
  setToAmount: (a: number) => void;

  // Function to flip what we consider to be the "to" and "from" mints.
  swapToFromMints: () => void;

  // The amount (in units of percent) a swap can be off from the estimate
  // shown to the user.
  slippage: number;
  setSlippage: (n: number) => void;

  // The amount of USDT for deduction for swap transaction to eco-contribution
  impact: number;
  setImpact: (n: number) => void;

  // Null if the user is using fairs directly from DEX prices.
  // Otherwise, a user specified override for the price to use when calculating
  // swap amounts.
  fairOverride: number | null;
  setFairOverride: (n: number | null) => void;

  // The referral *owner* address. Associated token accounts must be created,
  // first, for this to be used.
  referral?: PublicKey;

  // True if all newly created market accounts should be closed in the
  // same user flow (ideally in the same transaction).
  isClosingNewAccounts: boolean;

  // True if the swap exchange rate should be a function of nothing but the
  // from and to tokens, ignoring any quote tokens that may have been
  // accumulated by performing the swap.
  //
  // Always false (for now).
  isStrict: boolean;
  setIsStrict: (isStrict: boolean) => void;

  setIsClosingNewAccounts: (b: boolean) => void;
};
const _SwapContext = React.createContext<null | SwapContext>(null);

export function SwapContextProvider(props: any) {
  const [fromMint, setFromMint] = useState(props.fromMint ?? SRM_MINT);
  const [toMint, setToMint] = useState(props.toMint ?? USDC_MINT);
  const [fromAmount, _setFromAmount] = useState(props.fromAmount ?? 0);
  const [toAmount, _setToAmount] = useState(props.toAmount ?? 0);
  const [isClosingNewAccounts, setIsClosingNewAccounts] = useState(false);
  const [isStrict, setIsStrict] = useState(false);
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE_PERCENT);
  const [impact, setImpact] = useState(DEFAULT_IMPACT_USDT_VALUE);
  const [fairOverride, setFairOverride] = useState<number | null>(null);
  const fair = _useSwapFair(fromMint, toMint, fairOverride);
  const { referral } = props;

  assert.ok(slippage >= 0);

  useEffect(() => {
    if (!fair) {
      return;
    }
    setFromAmount(fromAmount);
  }, [fair]);

  const swapToFromMints = () => {
    const oldFrom = fromMint;
    const oldTo = toMint;
    const oldToAmount = toAmount;
    _setFromAmount(oldToAmount);
    setFromMint(oldTo);
    setToMint(oldFrom);
  };

  const setFromAmount = (amount: number) => {
    if (fair === undefined) {
      _setFromAmount(0);
      _setToAmount(0);
      return;
    }
    _setFromAmount(amount);
    _setToAmount(FEE_MULTIPLIER * (amount / fair));
  };

  const setToAmount = (amount: number) => {
    if (fair === undefined) {
      _setFromAmount(0);
      _setToAmount(0);
      return;
    }
    _setToAmount(amount);
    _setFromAmount((amount * fair) / FEE_MULTIPLIER);
  };

  return (
    <_SwapContext.Provider
      value={{
        fromMint,
        setFromMint,
        toMint,
        setToMint,
        fromAmount,
        setFromAmount,
        toAmount,
        setToAmount,
        swapToFromMints,
        slippage,
        setSlippage,
        impact,
        setImpact,
        fairOverride,
        setFairOverride,
        isClosingNewAccounts,
        isStrict,
        setIsStrict,
        setIsClosingNewAccounts,
        referral,
      }}
    >
      {props.children}
    </_SwapContext.Provider>
  );
}

export function useSwapContext(): SwapContext {
  const ctx = useContext(_SwapContext);
  if (ctx === null) {
    throw new Error('Context not available');
  }
  return ctx;
}

export function useSwapFair(): number | undefined {
  const { fairOverride, fromMint, toMint } = useSwapContext();
  return _useSwapFair(fromMint, toMint, fairOverride);
}

function _useSwapFair(
  fromMint: PublicKey,
  toMint: PublicKey,
  fairOverride: number | null,
): number | undefined {
  const fairRoute = useFairRoute(fromMint, toMint);
  const fair = fairOverride === null ? fairRoute : fairOverride;
  return fair;
}

// Returns true if the user can swap with the current context.
export function useCanSwap(): boolean {
  const { fromMint, toMint, fromAmount, toAmount } = useSwapContext();
  const { swapClient } = useDexContext();
  const { wormholeMap, solletMap } = useTokenListContext();
  const fromWallet = useOwnedTokenAccount(fromMint);
  const fair = useSwapFair();
  const route = useRouteVerbose(fromMint, toMint);
  const fromMarket = useMarket(
    route && route.markets ? route.markets[0] : undefined,
  );
  if (route === null) {
    return false;
  }

  return (
    // From wallet exists.
    fromWallet !== undefined &&
    fromWallet !== null &&
    // Fair price is defined.
    fair !== undefined &&
    fair > 0 &&
    // Mints are distinct.
    fromMint.equals(toMint) === false &&
    // Wallet is connected.
    swapClient.program.provider.wallet.publicKey !== null &&
    // Trade amounts greater than zero and more than or equal to the min order size.
    fromAmount > 0 &&
    toAmount > 0 &&
    fromAmount >= fromMarket?.minOrderSize! &&
    // Trade route exists.
    route !== null &&
    // Wormhole <-> native markets must have the wormhole token as the
    // *from* address since they're one-sided markets.
    (route.kind !== 'wormhole-native' ||
      wormholeMap
        .get(fromMint.toString())
        ?.tags?.includes(SPL_REGISTRY_WORM_TAG) !== undefined) &&
    // Wormhole <-> sollet markets must have the sollet token as the
    // *from* address since they're one sided markets.
    (route.kind !== 'wormhole-sollet' ||
      solletMap
        .get(fromMint.toString())
        ?.tags?.includes(SPL_REGISTRY_SOLLET_TAG) !== undefined)
  );
}

export function useReferral(fromMarket?: Market): PublicKey | undefined {
  const { referral } = useSwapContext();
  const asyncReferral = useAsync(async () => {
    if (!referral) {
      return undefined;
    }
    if (!fromMarket) {
      return undefined;
    }
    if (
      !fromMarket.quoteMintAddress.equals(USDC_MINT) &&
      !fromMarket.quoteMintAddress.equals(USDT_MINT)
    ) {
      return undefined;
    }

    return Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      fromMarket.quoteMintAddress,
      referral,
    );
  }, [fromMarket]);

  if (!asyncReferral.result) {
    return undefined;
  }
  return asyncReferral.result;
}

export function useOnSwap() {
  const {
    fromMint,
    toMint,
    fromAmount,
    slippage,
    isClosingNewAccounts,
    isStrict,
  } = useSwapContext();
  const { swapClient } = useDexContext();
  const { impact } = useSwapContext();
  const fromMintInfo = useMint(fromMint);
  const toMintInfo = useMint(toMint);
  const openOrders = useOpenOrders();
  const route = useRouteVerbose(fromMint, toMint);
  const fromMarket = useMarket(
    route && route.markets ? route.markets[0] : undefined,
  );
  const toMarket = useMarket(
    route && route.markets ? route.markets[1] : undefined,
  );
  const canSwap = useCanSwap();
  const referral = useReferral(fromMarket);
  const fair = useSwapFair();
  const fromWallet = useOwnedTokenAccount(fromMint);
  const toWallet = useOwnedTokenAccount(toMint);
  const quoteMint = fromMarket && fromMarket.quoteMintAddress;
  const quoteMintInfo = useMint(quoteMint);
  const quoteWallet = useOwnedTokenAccount(quoteMint);

  // Click handler.
  const sendSwapTransaction = async (): Promise<
    Array<TransactionSignature> | Promise<any>
  > => {
    if (!fromMintInfo || !toMintInfo) {
      throw new Error('Unable to calculate mint decimals');
    }
    if (!fair) {
      throw new Error('Invalid fair');
    }
    if (!quoteMint || !quoteMintInfo) {
      throw new Error('Quote mint not found');
    }

    const amount = new BN(fromAmount * 10 ** fromMintInfo.decimals);
    const isSol = fromMint.equals(SOL_MINT) || toMint.equals(SOL_MINT);
    const wrappedSolAccount = isSol ? Keypair.generate() : undefined;

    // Build the swap.
    const txs = await (async () => {
      if (!fromMarket) {
        throw new Error('Market undefined');
      }
      const minExchangeRate = {
        rate: new BN((10 ** toMintInfo.decimals * FEE_MULTIPLIER) / fair)
          .muln(100 - slippage)
          .divn(100),
        fromDecimals: fromMintInfo.decimals,
        quoteDecimals: quoteMintInfo.decimals,
        strict: isStrict,
      };
      const fromOpenOrders = fromMarket
        ? openOrders.get(fromMarket?.address.toString())
        : undefined;
      const toOpenOrders = toMarket
        ? openOrders.get(toMarket?.address.toString())
        : undefined;
      const fromWalletAddr = fromMint.equals(SOL_MINT)
        ? wrappedSolAccount!.publicKey
        : fromWallet
        ? fromWallet.publicKey
        : undefined;
      const toWalletAddr = toMint.equals(SOL_MINT)
        ? wrappedSolAccount!.publicKey
        : toWallet
        ? toWallet.publicKey
        : undefined;

      // if (!toWalletAddr) {
      //   const {
      //     transaction,
      //     associatedToken,
      //   } = await createAssociatedTokenAccount(
      //     toMint,
      //     swapClient.program.provider.wallet.publicKey,
      //   );
      //
      //   const signedTransaction = await swapClient.program.provider.wallet.signTransaction(
      //     transaction,
      //   );
      //
      //   await swapClient.program.provider.send(signedTransaction, undefined, {
      //     commitment: 'confirmed',
      //   });
      //   toWalletAddr = associatedToken;
      // }

      const serumTransaction = await swapClient.swapTxs({
        fromMint,
        toMint,
        quoteMint,
        amount,
        minExchangeRate,
        referral,
        fromMarket,
        toMarket,
        // Automatically created if undefined.
        fromOpenOrders: fromOpenOrders ? fromOpenOrders[0].address : undefined,
        toOpenOrders: toOpenOrders ? toOpenOrders[0].address : undefined,
        fromWallet: fromWalletAddr,
        toWallet: toWalletAddr,
        quoteWallet: quoteWallet ? quoteWallet.publicKey : undefined,
        // Auto close newly created open orders accounts.
        close: isClosingNewAccounts,
      });

      if (impact && !isSol) {
        const impactPool = getImpactPool(
          swapClient.program.provider.wallet.publicKey,
          'USDT',
        );

        const impactTransaction = await impactPool.TransferTokens(
          new TransferTokens(converterNumberToBN(impact)),
        );

        serumTransaction[serumTransaction.length - 1].tx.add(impactTransaction);
      }

      return serumTransaction;
    })();

    // If swapping SOL, then insert a wrap/unwrap instruction.
    if (isSol) {
      if (txs.length > 1) {
        throw new Error('SOL must be swapped in a single transaction');
      }
      const { tx: wrapTx, signers: wrapSigners } = await wrapSol(
        swapClient.program.provider,
        wrappedSolAccount as Keypair,
        fromMint,
        amount,
      );
      const { tx: unwrapTx, signers: unwrapSigners } = unwrapSol(
        swapClient.program.provider,
        wrappedSolAccount as Keypair,
      );
      const tx = new Transaction();
      tx.add(wrapTx);
      tx.add(txs[0].tx);
      tx.add(unwrapTx);
      txs[0].tx = tx;
      txs[0].signers.push(...wrapSigners);
      txs[0].signers.push(...unwrapSigners);
    }

    return swapClient.program.provider.sendAll(txs, {
      commitment: 'confirmed',
    });
  };

  return { canSwap, onSwap: sendSwapTransaction };
}

async function wrapSol(
  provider: Provider,
  wrappedSolAccount: Keypair,
  fromMint: PublicKey,
  amount: BN,
): Promise<{ tx: Transaction; signers: Array<Signer | undefined> }> {
  const tx = new Transaction();
  const signers = [wrappedSolAccount];
  // Create new, rent exempt account.
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: wrappedSolAccount.publicKey,
      lamports: await Token.getMinBalanceRentForExemptAccount(
        provider.connection,
      ),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    }),
  );
  // Transfer lamports. These will be converted to an SPL balance by the
  // token program.
  if (fromMint.equals(SOL_MINT)) {
    tx.add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: wrappedSolAccount.publicKey,
        lamports: amount.toNumber(),
      }),
    );
  }
  // Initialize the account.
  tx.add(
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      WRAPPED_SOL_MINT,
      wrappedSolAccount.publicKey,
      provider.wallet.publicKey,
    ),
  );
  return { tx, signers };
}

function unwrapSol(
  provider: Provider,
  wrappedSolAccount: Keypair,
): { tx: Transaction; signers: Array<Signer | undefined> } {
  const tx = new Transaction();

  tx.add(
    Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      wrappedSolAccount.publicKey,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      [],
    ),
  );
  return { tx, signers: [] };
}
