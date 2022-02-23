import { AccountInfo, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import crypto from "crypto";

export function getTokenPoolSeed(
  programId: PublicKey,
pool_token_name: string
): string {
  return getSeed(programId.toBase58(), "TokenPool", pool_token_name);
}

export function getImpactPoolSeed(
  programId: PublicKey,
  vestingName: string
): string {
  return getSeed(programId.toBase58(), "VestingType", vestingName);
}

function getSeed(...params: string[]): string {
  const concatenated = params.reduce((sum, current) => sum + current, "");
  const digest = crypto
    .createHash("sha256")
    .update(concatenated)
    .digest("base64");
  return digest.slice(-32);
}

export type AccountValidation = (
  account: AccountInfo<Buffer> | null,
  name: string
) => void;

export function validateAccountExist(
  account: AccountInfo<Buffer> | null,
  name: string
) {
  if (account === null) {
    throw Error(`${name} does not exist`);
  }
}

export function validateAccountDoesNotExist(
  account: AccountInfo<Buffer> | null,
  name: string
) {
  if (account !== null) {
    throw Error(`${name} already exist`);
  }
}