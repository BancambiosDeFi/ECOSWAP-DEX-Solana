import { PublicKey } from "@solana/web3.js";
import { field } from "@solvei/borsh/schema";
import BN from "bn.js";

const PublicKeyCreator = {
  serialize: (value: PublicKey, writer: any) => {
    writer.writeU256(new BN(value.encode(), 16, "be"));
  },
  deserialize: (reader: any): PublicKey => {
    let value = reader.readU256();
    let buffer = value.toArrayLike(Buffer, "be");
    return PublicKey.decode(buffer);
  },
};

export class ImpactPoolAccount {
  @field({ type: "u8" })
  public is_initialized: boolean | undefined; //1
  @field(PublicKeyCreator)
  public administrator: PublicKey | undefined; //32
  @field(PublicKeyCreator)
  public token_pool: PublicKey | undefined; //32
  @field( {type: "u64" })
  public amount: BN | undefined; //73


  static readonly space: number = 73;

  constructor(properties?: {
    is_initialized: boolean;
    administrator: PublicKey;
    token_pool: PublicKey;
    amount: BN;
  }) {
    if (properties) {
      this.is_initialized = properties.is_initialized;
      this.administrator = properties.administrator;
      this.token_pool = properties.token_pool;
      this.amount = properties.amount;
    }
  }
} //73 bytes

export class UserImpactAccount {
  @field({ type: "u8" })
  public is_initialized: Boolean | undefined; //1  byte
  @field(PublicKeyCreator)
  public user_key: PublicKey | undefined; //32  bytes
  @field( {type: "u64" })
  public amount_of_transferred: BN | undefined; //8 bytes


  static readonly space: number = 41;

  constructor(properties?: {
    is_initialized: boolean;
    user_key: PublicKey;
    amount_of_transferred: BN;
  }) {
    if (properties) {
      this.is_initialized = properties.is_initialized;
      this.user_key = properties.user_key;
      this.amount_of_transferred = properties.amount_of_transferred;
    }
  }
}