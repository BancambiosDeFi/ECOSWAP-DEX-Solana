import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
  AccountInfo as TokenAccountInfo,
  u64,
} from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { deserialize, serialize } from "@solvei/borsh";
import { generateSchemas } from "@solvei/borsh/schema";
import BN from "bn.js";
import { ImpactPoolAccount } from "./models";
import { ImpactPoolStatistics } from "./query";
import {
  TransferTokens,
  WithdrawFromPool,
  CreateImpactPool,
  Instruction,
  schemas,
} from "./schema";
import {
  getTokenPoolSeed,
  getImpactPoolSeed,
  AccountValidation,
  validateAccountExist,
  validateAccountDoesNotExist,
} from "./utils";

export interface IImpactPool {
  TransferTokens(
    TransferTokens: TransferTokens
  ): Promise<Transaction>;

  WithdrawFromPool(
    WithdrawFromPool: WithdrawFromPool
  ): Promise<Transaction>;
  CreateImpactPool(
    amountLamports: BN,
    CreateImpactPool: CreateImpactPool
  ): Promise<Transaction>;
  getImpactPool(): Promise<ImpactPoolAccount>;

}
export class ImpactPool implements IImpactPool {
  constructor(
    private connection: Connection,
    private programId: PublicKey,
    private mint: PublicKey,
    private creator: PublicKey,
    private impactName: string
  ) {}

  async CreateImpactPool(
    amountLamorts: BN,
    CreateImpactPool: CreateImpactPool
  ): Promise<Transaction> {
    const { pubkey: tokenAccountPubkey } =
      await this.getAssociatedTokenAccountContext(
        this.creator,
        validateAccountExist
      );
    const { seed: tokenPoolSeed, pubkey: tokenPoolPubkey } =
      await this.getTokenPoolAccountContext(validateAccountDoesNotExist);

    const { seed: impactPoolSeed, pubkey: impactPoolPubkey } =
      await this.getImpactPoolAccountContext(validateAccountDoesNotExist);

    const lamportsForTokenPool =
      await this.connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
      );

    const createTokenPool = SystemProgram.createAccountWithSeed({
      fromPubkey: this.creator,
      basePubkey: this.creator,
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
      this.creator
    );
    const transferToTokenPool = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      tokenPoolPubkey,
      this.creator,
      [],
      new u64(amountLamorts.toString())
    );

    const lamportsForImpactPool =
      await this.connection.getMinimumBalanceForRentExemption(
        ImpactPoolAccount.space
      );

    const createImpactPool = SystemProgram.createAccountWithSeed({
      fromPubkey: this.creator,
      basePubkey: this.creator,
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
        { pubkey: this.creator, isSigner: true, isWritable: true },
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


async TransferTokens () {
  return new Transaction();
}

async WithdrawFromPool () {
   return new Transaction();
}
  // async withdrawFromImpactPool(
  //   receiverPubkey: PublicKey,
  //   withdrawFromVestingInstruction: WithdrawFromVestingInstruction
  // ): Promise<Transaction> {
  //   const { pubkey: tokenAccountPubkey } =
  //     await this.getAssociatedTokenAccountContext(
  //       receiverPubkey,
  //       validateAccountExist
  //     );

  //   const { pubkey: vestingTypePubkey } =
  //     await this.getVestingTypeAccountContext(validateAccountExist);

  //   const vestingType = await this.getVestingType();
  //   if (!vestingType.token_pool) throw "";
  //   const { pubkey: vestingPubkey } = await this.getVestingAccountContext(
  //     vestingType.token_pool,
  //     receiverPubkey,
  //     validateAccountExist
  //   );

  //   const [pda, bumpSeed] = await PublicKey.findProgramAddress(
  //     [vestingTypePubkey.toBuffer()],
  //     this.programId
  //   );

  //   const tokenPoolPubkey = vestingType.token_pool;
  //   if (tokenPoolPubkey === undefined)
  //     throw Error("Vesting type does not have token pool");

  //   const instance = new Instruction(withdrawFromVestingInstruction);
  //   const instructionData = serialize(schemas, instance);

  //   const withdrawInstruction = new TransactionInstruction({
  //     keys: [
  //       { pubkey: vestingTypePubkey, isSigner: false, isWritable: true },
  //       { pubkey: vestingPubkey, isSigner: false, isWritable: true },
  //       { pubkey: tokenAccountPubkey, isSigner: false, isWritable: true },
  //       { pubkey: tokenPoolPubkey, isSigner: false, isWritable: true },
  //       { pubkey: pda, isSigner: false, isWritable: false },
  //       { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  //     ],
  //     programId: this.programId,
  //     data: Buffer.from(instructionData),
  //   });

  //   const transaction = new Transaction();
  //   transaction.add(withdrawInstruction);
  //   return transaction;
  // }




  async getAssociatedTokenAccount(
    receiver: PublicKey
  ): Promise<TokenAccountInfo> {
    const { pubkey } = await this.getAssociatedTokenAccountContext(
      receiver,
      validateAccountExist
    );
    const token = new Token(
      this.connection,
      this.mint,
      TOKEN_PROGRAM_ID,
      null as unknown as Signer // signer is required but isn't used
    );
    return await token.getAccountInfo(pubkey);
  }

  async getAssociatedTokenAccountContext(
    receiver: PublicKey,
    validation: AccountValidation | null
  ) {
    let pubkey = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      this.mint,
      receiver,
      true
    );
    const account = await this.connection.getAccountInfo(pubkey);
    if (validation !== null) {
      validation(account, "Associated Token Account");
    }

    return { pubkey, account };
  }

  async getTokenPoolAccountContext(validation: AccountValidation | null) {
    const seed = getTokenPoolSeed(this.programId, this.impactName);
    return this.getAccountContext(
      seed,
      TOKEN_PROGRAM_ID,
      validation,
      "Token Pool Account"
    );
  }

  async getImpactPoolAccountContext(validation: AccountValidation | null) {
    const seed = getImpactPoolSeed(this.programId, this.impactName);
    return this.getAccountContext(
      seed,
      this.programId,
      validation,
      "Vesting Type Account"
    );
  }


  async getAccountContext(
    seed: string,
    programId: PublicKey,
    validation: AccountValidation | null,
    name: string
  ) {
    const pubkey = await PublicKey.createWithSeed(
      this.creator,
      seed,
      programId
    );
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
    const { account } = await this.getImpactPoolAccountContext(
      validateAccountExist
    );
    return deserialize(
      generateSchemas([ImpactPoolAccount]),
      ImpactPoolAccount,
      (account as AccountInfo<Buffer>).data
    );
  }

  async getImpactPoolStatistics(): Promise<ImpactPoolStatistics> {
    const impactPool = await this.getImpactPool();
    const { pubkey: tokenPoolPubkey } = await this.getTokenPoolAccountContext(
      validateAccountExist
    );
    const tokensInTokenPool = await this.connection.getTokenAccountBalance(
      tokenPoolPubkey
    );

    if (
      !impactPool.token_pool ||
      !impactPool.is_initialized ||
      !impactPool.amount ||
      !impactPool.administrator
    )
      throw Error("Deserialization error");

    return new ImpactPoolStatistics(
      impactPool,
      impactPool.amount,
      impactPool.administrator,
      impactPool.is_initialized,
      impactPool.token_pool,
      new BN(tokensInTokenPool.value.amount)
    );
  }
}
