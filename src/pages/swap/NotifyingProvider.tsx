import { Provider } from '@project-serum/anchor';
import Wallet from '@project-serum/sol-wallet-adapter';
import {
  Signer,
  ConfirmOptions,
  Connection,
  Transaction,
  TransactionSignature,
  PublicKey,
} from '@solana/web3.js';

// Cast wallet to AnchorWallet in order to be compatible with Anchor's Provider class
interface AnchorWallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

// Custom provider to display notifications whenever a transaction is sent.
//
// Note that this is an Anchor wallet/network provider--not a React provider,
// so all transactions will be flowing through here, which allows us to
// hook in to display all transactions sent from the `Swap` component
// as notifications in the parent app.
export class NotifyingProvider extends Provider {
  // Function to call whenever the provider sends a transaction;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onTransaction: (tx: TransactionSignature | undefined, err?: Error) => void;

  constructor(
    connection: Connection,
    wallet: Wallet,
    opts: ConfirmOptions,
    onTransaction: (tx: TransactionSignature | undefined, err?: Error) => void,
  ) {
    const newWallet = wallet as AnchorWallet;
    super(connection, newWallet, opts);
    this.onTransaction = onTransaction;
  }

  async send(
    tx: Transaction,
    signers?: Array<Signer | undefined>,
    opts?: ConfirmOptions,
  ): Promise<TransactionSignature> {
    try {
      const txSig = await super.send(tx, signers, opts);
      this.onTransaction(txSig);

      return txSig;
    } catch (err) {
      if (err instanceof Error || err === undefined) {
        this.onTransaction(undefined, err);
      }

      return '';
    }
  }

  async sendAll(
    txs: Array<{ tx: Transaction; signers: Array<Signer | undefined> }>,
    opts?: ConfirmOptions,
  ): Promise<Array<TransactionSignature>> {
    try {
      const txSigs = await super.sendAll(txs, opts);
      txSigs.forEach(sig => {
        this.onTransaction(sig);
      });

      return txSigs;
    } catch (err) {
      if (err instanceof Error || err === undefined) {
        this.onTransaction(undefined, err);
      }

      return [];
    }
  }
}
