import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
  AccountInfo as TokenAccountInfo,
  u64,
} from '@solana/spl-token';
import {
  AccountInfo,
  Connection,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { deserialize, serialize } from '@solvei/borsh';
import { generateSchemas } from '@solvei/borsh/schema';
import BN from 'bn.js';
import { ImpactPoolAccount } from './models';
import { ImpactPoolStatistics } from './query';
import { TransferTokens, WithdrawFromPool, CreateImpactPool, Instruction, schemas } from './schema';
import {
  getTokenPoolSeed,
  getImpactPoolSeed,
  getImpactSeed,
  AccountValidation,
  validateAccountExist,
  validateAccountDoesNotExist,
} from './utils';

export interface IImpactPool {
  TransferTokens(TransferTokens: TransferTokens): Promise<Transaction>;

  WithdrawFromPool(
    receiverPubkey: PublicKey,
    WithdrawFromPool: WithdrawFromPool,
  ): Promise<Transaction>;
  CreateImpactPool(amountLamports: BN, CreateImpactPool: CreateImpactPool): Promise<Transaction>;
  getImpactPool(): Promise<ImpactPoolAccount>;
}
export class ImpactPool implements IImpactPool {
  constructor(
    private connection: Connection,
    private programId: PublicKey,
    private mint: PublicKey,
    private creator: PublicKey,
    private signer: PublicKey,
    private impactName: string,
  ) {}

  async CreateImpactPool(
    amountLamorts: BN,
    CreateImpactPool: CreateImpactPool,
  ): Promise<Transaction> {
    const { pubkey: tokenAccountPubkey } = await this.getAssociatedTokenAccountContext(
      this.signer,
      validateAccountExist,
    );
    const { seed: tokenPoolSeed, pubkey: tokenPoolPubkey } = await this.getTokenPoolAccountContext(
      validateAccountDoesNotExist,
    );

    const { seed: impactPoolSeed, pubkey: impactPoolPubkey } =
      await this.getImpactPoolAccountContext(validateAccountDoesNotExist);

    const lamportsForTokenPool = await this.connection.getMinimumBalanceForRentExemption(
      AccountLayout.span,
    );

    const createTokenPool = SystemProgram.createAccountWithSeed({
      fromPubkey: this.signer,
      basePubkey: this.signer,
      newAccountPubkey: tokenPoolPubkey,
      lamports: lamportsForTokenPool,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID,
      seed: tokenPoolSeed,
    });
    const initTokenPool = Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      this.mint,
      tokenPoolPubkey,
      this.signer,
    );
    const transferToTokenPool = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      tokenPoolPubkey,
      this.signer,
      [],
      new u64(amountLamorts.toString()),
    );

    const lamportsForImpactPool = await this.connection.getMinimumBalanceForRentExemption(
      ImpactPoolAccount.space,
    );

    const createImpactPool = SystemProgram.createAccountWithSeed({
      fromPubkey: this.signer,
      basePubkey: this.signer,
      newAccountPubkey: impactPoolPubkey,
      lamports: lamportsForImpactPool,
      space: ImpactPoolAccount.space,
      programId: this.programId,
      seed: impactPoolSeed,
    });

    const instance = new Instruction(CreateImpactPool);

    const instructionData = serialize(schemas, instance);

    const createImpactPoolTransaction = new TransactionInstruction({
      keys: [
        { pubkey: this.signer, isSigner: true, isWritable: true },
        { pubkey: impactPoolPubkey, isSigner: false, isWritable: true },
        {
          pubkey: tokenPoolPubkey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: this.programId,
      data: Buffer.from(instructionData),
    });
    const transaction = new Transaction();
    transaction.add(createTokenPool);
    transaction.add(initTokenPool);
    transaction.add(transferToTokenPool);
    transaction.add(createImpactPool);
    transaction.add(createImpactPoolTransaction);

    return transaction;
  }

  async TransferTokens(transferTokensInstruction: TransferTokens): Promise<Transaction> {
    const { pubkey: tokenAccountPubkey } = await this.getAssociatedTokenAccountContext(
      this.signer,
      validateAccountExist,
    );

    const impactPool = await this.getImpactPool();
    const tokenPoolPubkey = impactPool.token_pool;
    if (tokenPoolPubkey === undefined) throw Error('Token pool is not initialized');

    const instance = new Instruction(transferTokensInstruction);
    const instructionData = serialize(schemas, instance);

    const transferInstruction = new TransactionInstruction({
      keys: [
        { pubkey: this.signer, isSigner: true, isWritable: false },
        { pubkey: tokenAccountPubkey, isSigner: false, isWritable: true },
        { pubkey: tokenPoolPubkey, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: Buffer.from(instructionData),
    });

    const transaction = new Transaction();
    transaction.add(transferInstruction);
    return transaction;
  }

  async WithdrawFromPool(
    receiverPubkey: PublicKey,
    withdrawFromPoolInstruction: WithdrawFromPool,
  ): Promise<Transaction> {
    const { pubkey: impactPoolPubkey } = await this.getImpactPoolAccountContext(
      validateAccountExist,
    ); //4
    const { pubkey: recieverTokenPubkey } = await this.getAssociatedTokenAccountContext(
      receiverPubkey,
      validateAccountExist,
    );
    const impactPool = await this.getImpactPool();
    if (impactPool.token_pool === undefined) throw Error('Token pool is not initialized');
    const tokenPoolPubkey = impactPool.token_pool; //3
    const [pda, bumpSeed] = await PublicKey.findProgramAddress(
      [impactPoolPubkey.toBuffer()],
      this.programId,
    );

    const instance = new Instruction(withdrawFromPoolInstruction);
    const instructionData = serialize(schemas, instance);
    const withdrawInstruction = new TransactionInstruction({
      keys: [
        { pubkey: this.signer, isSigner: true, isWritable: false }, //singner
        { pubkey: recieverTokenPubkey, isSigner: false, isWritable: true }, // tra
        { pubkey: pda, isSigner: false, isWritable: false }, //pda
        { pubkey: impactPoolPubkey, isSigner: false, isWritable: false },
        { pubkey: tokenPoolPubkey, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data: Buffer.from(instructionData),
    });

    const transaction = new Transaction();
    transaction.add(withdrawInstruction);
    return transaction;
  }

  async getAssociatedTokenAccount(receiver: PublicKey): Promise<TokenAccountInfo> {
    const { pubkey } = await this.getAssociatedTokenAccountContext(receiver, validateAccountExist);
    const token = new Token(
      this.connection,
      this.mint,
      TOKEN_PROGRAM_ID,
      null as unknown as Signer, // signer is required but isn't used
    );
    return await token.getAccountInfo(pubkey);
  }

  async getAssociatedTokenAccountContext(
    receiver: PublicKey,
    validation: AccountValidation | null,
  ) {
    let pubkey = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      this.mint,
      receiver,
      true,
    );
    const account = await this.connection.getAccountInfo(pubkey);
    if (validation !== null) {
      validation(account, 'Associated Token Account');
    }

    return { pubkey, account };
  }

  async getTokenPoolAccountContext(validation: AccountValidation | null) {
    const seed = getTokenPoolSeed(this.programId, this.impactName);
    return this.getAccountContext(seed, TOKEN_PROGRAM_ID, validation, 'Token Pool Account');
  }

  async getImpactPoolAccountContext(validation: AccountValidation | null) {
    const seed = getImpactPoolSeed(this.programId, this.impactName);
    return this.getAccountContext(seed, this.programId, validation, 'Impact Pool Account');
  }
  async getImpactAccountContext(
    tokenPoolPubkey: PublicKey,
    receiver: PublicKey,
    validation: AccountValidation | null,
  ) {
    const seed = getImpactSeed(this.programId, tokenPoolPubkey, receiver);
    return this.getAccountContext(seed, this.programId, validation, 'Impact Account');
  }

  async getAccountContext(
    seed: string,
    programId: PublicKey,
    validation: AccountValidation | null,
    name: string,
  ) {
    const pubkey = await PublicKey.createWithSeed(this.creator, seed, programId);
    const account = await this.connection.getAccountInfo(pubkey);
    if (validation !== null) {
      validation(account, name);
    }
    return {
      seed,
      pubkey,
      account,
    };
  }

  async getImpactPool(): Promise<ImpactPoolAccount> {
    const { account } = await this.getImpactPoolAccountContext(validateAccountExist);
    return deserialize(
      generateSchemas([ImpactPoolAccount]),
      ImpactPoolAccount,
      (account as AccountInfo<Buffer>).data,
    );
  }

  async getImpactPoolStatistics(): Promise<ImpactPoolStatistics> {
    const impactPool = await this.getImpactPool();
    const { pubkey: tokenPoolPubkey } = await this.getTokenPoolAccountContext(validateAccountExist);
    const { pubkey: impactPoolPubkey } = await this.getImpactPoolAccountContext(
      validateAccountExist,
    );
    const tokensInTokenPool = await this.connection.getTokenAccountBalance(tokenPoolPubkey);

    if (
      !impactPool.token_pool ||
      !impactPool.is_initialized ||
      !impactPool.amount ||
      !impactPool.administrator
    )
      throw Error('Deserialization error');

    return new ImpactPoolStatistics(
      impactPool,
      impactPool.amount,
      impactPool.administrator,
      impactPool.is_initialized,
      impactPool.token_pool,
      impactPoolPubkey,
      new BN(tokensInTokenPool.value.amount),
    );
  }
}
