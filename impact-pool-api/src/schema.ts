import { field, generateSchemas, variant } from "@solvei/borsh/schema";
import BN from "bn.js";

class Super {}

@variant(0)
export class TransferTokens extends Super {
  @field({ type: "u64" })
  public amount: BN;

  constructor(amount: BN) {
    super();
    this.amount = amount;
  }
}


@variant(1)
export class WithdrawFromPool extends Super {
  @field({ type: "u64" })
  public amount: BN;

  constructor(amount: BN) {
    super();
    this.amount = amount;
  }
}
@variant(2)
export class CreateImpactPool extends Super {
  @field({ type: "u64" })
  public impact_pool_id: number;

  constructor(impact_pool_id: number) {
    super();
    this.impact_pool_id = impact_pool_id;
  }
}







export class Instruction {
  @field({ type: Super })
  public enum: Super;

  constructor(value: Super) {
    this.enum = value;
  }
}
 
export const schemas = generateSchemas([  CreateImpactPool, 
  TransferTokens,
  WithdrawFromPool,
  Instruction,]);