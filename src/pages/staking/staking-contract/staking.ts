import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, Provider } from '@project-serum/anchor';
import BN from 'bn.js';
import { BigNumber } from 'bignumber.js';

import { BxStaking, IDL } from './idl';

export class ProgramState {
  constructor(
    public admin: PublicKey,
    public earlyUnstakeFee: number,
    public feePool: BN,
    public rewardPerSecond: BN,
    public price: BigNumber,
    public defaultPrice: BigNumber,
    public totalStakedTokens: BN,
    public lockedRewards: BN,
    public lockupTime: BN,
    public lastUpdate: Date,
  ) {}

  public toString(): string {
    return `ProgramState
    admin=${this.admin}
    earlyUnstakeFee=${this.earlyUnstakeFee}
    feePool=${this.feePool}
    rewardPerSecond=${this.rewardPerSecond}
    price=${this.price}
    defaultPrice=${this.defaultPrice}
    totalStakedTokens=${this.totalStakedTokens}
    lockedRewards=${this.lockedRewards}
    lockupTime=${this.lockupTime}
    lastUpdate=${this.lastUpdate}`;
  }

  public projectedPrice(stakingTokenSupply: BN): BigNumber {
    const unlocked = BN.min(this.getUnlockedRewards(new Date()), this.lockedRewards);
    let result = this.defaultPrice;
    if (stakingTokenSupply.gtn(0)) {
      const totalTokens = this.totalStakedTokens.add(unlocked);
      result = new BigNumber(totalTokens.toString()).dividedBy(
        new BigNumber(stakingTokenSupply.toString()),
      );
    }

    return result;
  }

  public getPossibleUnstake(
    userStakeInfo: StakeInfo,
    stakingTokenAmount: BN,
    stakingTokenSupply: BN,
  ): { amountUnstaked: BN; amountTransfered: BN } {
    const price = this.projectedPrice(stakingTokenSupply);
    const possibleUnstake = price.multipliedBy(new BigNumber(stakingTokenAmount.toString()));
    const now = new Date();
    const lockupEnd = new Date(
      userStakeInfo.stakeTime.getMilliseconds() + this.lockupTime.toNumber() * 1000,
    );
    const possibleUnstakeTrasferred =
      lockupEnd > now
        ? possibleUnstake.multipliedBy(100 - this.earlyUnstakeFee).dividedBy(100)
        : possibleUnstake;

    return {
      amountUnstaked: new BN(possibleUnstake.integerValue(BigNumber.ROUND_FLOOR).toString()),
      amountTransfered: new BN(
        possibleUnstakeTrasferred.integerValue(BigNumber.ROUND_FLOOR).toString(),
      ),
    };
  }

  public getUnlockedRewards(now: Date): BN {
    if (now < this.lastUpdate) {
      return new BN(0);
    }
    const seconds = Math.floor(now.getTime() / 1000) - Math.floor(this.lastUpdate.getTime() / 1000);

    return this.rewardPerSecond.muln(seconds);
  }
}

export class StakeInfo {
  constructor(public stakeTime: Date) {}
}

/// `Decimal` represents a 128 bit representation of a fixed-precision decimal number.
/// The finite set of values of type `Decimal` are of the form m / 10<sup>e</sup>,
/// where m is an integer such that -2<sup>96</sup> < m < 2<sup>96</sup>, and e is an integer
/// between 0 and 28 inclusive.
class Decimal {
  constructor(
    // Bits 0-15: unused
    // Bits 16-23: Contains "e", a value between 0-28 that indicates the scale
    // Bits 24-30: unused
    // Bit 31: the sign of the Decimal value, 0 meaning positive and 1 meaning negative.
    public flags: number, // u32
    // The lo, mid, hi, and flags fields contain the representation of the
    // Decimal value as a 96-bit integer.
    public hi: number,
    public lo: number,
    public mid: number,
  ) {}

  private SCALE_MASK: number = 0x00ff_0000;
  private SCALE_SHIFT: number = 16;
  private SIGN_MASK: number = 0x8000_0000;

  private scale(): number {
    return Math.floor((this.flags & this.SCALE_MASK) >> this.SCALE_SHIFT);
  }

  private isNegative(): boolean {
    return (this.flags & this.SIGN_MASK) > 0;
  }

  public toBigNumber(): BigNumber {
    if (this.scale() === 0) {
      // If scale is zero, we are storing a 96-bit integer value, that would
      // always fit into i128, which in turn is always representable as f64,
      // albeit with loss of precision for values outside of -2^53..2^53 range.
      return new BigNumber(this.hi)
        .multipliedBy(new BigNumber(new BN(1).shln(64).toString()))
        .plus(new BigNumber(this.mid).multipliedBy(new BigNumber(new BN(1).shln(32).toString())))
        .plus(new BigNumber(this.lo));
    } else {
      const sign = this.isNegative() ? -1.0 : 1.0;
      let mantissa: BN = new BN(this.lo);
      mantissa = mantissa.add(new BN(this.mid).shln(32));
      mantissa = mantissa.add(new BN(this.hi).shln(64));

      const scale = this.scale();
      const precision = new BN(10).pow(new BN(scale));
      const integral_part = mantissa.div(precision);
      const frac_part = mantissa.mod(precision);
      const frac = new BigNumber(frac_part.toString()).dividedBy(
        new BigNumber(precision.toString()),
      );
      const value = new BigNumber(integral_part.toString()).plus(frac).multipliedBy(sign);

      return value;
    }
  }
}

class UnixTimestamp {
  constructor(public value: BN) {}
}

export class Staking {
  private program: Program<BxStaking>;
  public mainTokenMint: PublicKey;
  public stakingTokenMint: PublicKey;

  public async programAddress(seeds: (Buffer | Uint8Array)[]): Promise<[PublicKey, number]> {
    return await PublicKey.findProgramAddress(seeds, this.program.programId);
  }

  public constructor(
    programId: PublicKey,
    tokens: { mainTokenMint: PublicKey; stakingTokenMint: PublicKey },
    provider?: Provider,
  ) {
    this.program = new Program(IDL, programId, provider);
    this.mainTokenMint = tokens.mainTokenMint;
    this.stakingTokenMint = tokens.stakingTokenMint;
  }

  public async programStateAddress(): Promise<PublicKey> {
    return (await this.programAddress([Buffer.from('state', 'utf8')]))[0];
  }

  public async tokenPoolAddress(): Promise<PublicKey> {
    return (await this.programAddress([Buffer.from('token-pool', 'utf8')]))[0];
  }

  public async stakingTokenMintAuthorityAddress(): Promise<PublicKey> {
    return (await this.programAddress([Buffer.from('mint-authority', 'utf8')]))[0];
  }

  public async userStakeInfoAddress(user: PublicKey): Promise<PublicKey> {
    return (await this.programAddress([Buffer.from('stake-info', 'utf8'), user.toBytes()]))[0];
  }

  public async tokenPoolAuthorityAddress(): Promise<PublicKey> {
    return (await this.programAddress([Buffer.from('token-pool-authority', 'utf8')]))[0];
  }

  public async programState(): Promise<ProgramState> {
    const rawProgramState = await this.program.account.programState.fetch(
      await this.programStateAddress(),
    );
    const price = new Decimal(
      rawProgramState.price.flags,
      rawProgramState.price.hi,
      rawProgramState.price.lo,
      rawProgramState.price.mid,
    ).toBigNumber();
    const defaultPrice = new Decimal(
      rawProgramState.defaultPrice.flags,
      rawProgramState.defaultPrice.hi,
      rawProgramState.defaultPrice.lo,
      rawProgramState.defaultPrice.mid,
    ).toBigNumber();

    return new ProgramState(
      rawProgramState.admin,
      rawProgramState.earlyUnstakeFee,
      rawProgramState.feePool,
      rawProgramState.rewardPerSecond,
      price,
      defaultPrice,
      rawProgramState.totalStakedTokens,
      rawProgramState.lockedRewards,
      rawProgramState.lockupTime,
      new Date((rawProgramState.lastUpdate as UnixTimestamp).value.muln(1000).toNumber()),
    );
  }

  public async userStakeInfo(user: PublicKey): Promise<StakeInfo> {
    const rawStakeInfo = await this.program.account.stakeInfo.fetch(
      await this.userStakeInfoAddress(user),
    );

    return new StakeInfo(
      new Date((rawStakeInfo.stakeTime as UnixTimestamp).value.muln(1000).toNumber()),
    );
  }

  public async init(
    earlyUnstakeFee: number,
    rewardPerSecond: BN,
    lockupTime: BN,
    admin: PublicKey,
  ): Promise<TransactionInstruction> {
    return this.program.instruction.initialize(earlyUnstakeFee, rewardPerSecond, lockupTime, {
      accounts: {
        programState: await this.programStateAddress(),
        tokenPool: await this.tokenPoolAddress(),
        tokenPoolAuthority: await this.tokenPoolAuthorityAddress(),
        bxTokenMint: this.mainTokenMint,
        stakingTokenMint: this.stakingTokenMint,
        stakingTokenMintAuthority: await this.stakingTokenMintAuthorityAddress(),
        admin: admin,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      },
    });
  }

  public async stake(
    amount: BN,
    staker: { publicKey: PublicKey; bxTokenAccount: PublicKey; stakingTokenAccount: PublicKey },
  ): Promise<TransactionInstruction> {
    return this.program.instruction.stake(amount, {
      accounts: {
        programState: await this.programStateAddress(),
        tokenPool: await this.tokenPoolAddress(),
        stakingTokenMint: this.stakingTokenMint,
        stakingTokenMintAuthority: await this.stakingTokenMintAuthorityAddress(),
        userStakingTokenAccount: staker.stakingTokenAccount,
        userBxTokenAccount: staker.bxTokenAccount,
        userStakeInfo: await this.userStakeInfoAddress(staker.publicKey),
        user: staker.publicKey.toString(),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
    });
  }

  public async increasePool(
    amount: BN,
    user: { bxTokenAccount: PublicKey; publicKey: PublicKey },
  ): Promise<TransactionInstruction> {
    return this.program.instruction.increasePool(amount, {
      accounts: {
        programState: await this.programStateAddress(),
        tokenPool: await this.tokenPoolAddress(),
        stakingTokenMint: this.stakingTokenMint,
        bxTokenAccount: user.bxTokenAccount,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  }

  public async decreasePool(
    amount: BN,
    admin: { bxTokenAccount: PublicKey; publicKey: PublicKey },
  ): Promise<TransactionInstruction> {
    return this.program.instruction.decreasePool(amount, {
      accounts: {
        programState: await this.programStateAddress(),
        tokenPool: await this.tokenPoolAddress(),
        tokenPoolAuthority: await this.tokenPoolAuthorityAddress(),
        stakingTokenMint: this.stakingTokenMint,
        bxTokenAccount: admin.bxTokenAccount,
        admin: admin.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  }

  public async unstake(
    amount: BN,
    staker: { publicKey: PublicKey; bxTokenAccount: PublicKey; stakingTokenAccount: PublicKey },
  ): Promise<TransactionInstruction> {
    return this.program.instruction.unstake(amount, {
      accounts: {
        programState: await this.programStateAddress(),
        tokenPool: await this.tokenPoolAddress(),
        tokenPoolAuthority: await this.tokenPoolAuthorityAddress(),
        stakingTokenMint: this.stakingTokenMint,
        userStakingTokenAccount: staker.stakingTokenAccount,
        userBxTokenAccount: staker.bxTokenAccount,
        userStakeInfo: await this.userStakeInfoAddress(staker.publicKey),
        user: staker.publicKey.toString(),
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  }

  public async claimFees(
    admin: PublicKey,
    bxTokenAccount: PublicKey,
  ): Promise<TransactionInstruction> {
    return this.program.instruction.claimFees({
      accounts: {
        programState: await this.programStateAddress(),
        tokenPool: await this.tokenPoolAddress(),
        tokenPoolAuthority: await this.tokenPoolAuthorityAddress(),
        bxTokenAccount: bxTokenAccount,
        admin: admin,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  }

  public async updateParams(
    earlyUnstakeFee: number | null,
    rewardPerSecond: BN | null,
    lockupTime: BN | null,
    admin: PublicKey,
  ): Promise<TransactionInstruction> {
    return this.program.instruction.updateParams(earlyUnstakeFee, rewardPerSecond, lockupTime, {
      accounts: {
        programState: await this.programStateAddress(),
        admin: admin,
      },
    });
  }
}
