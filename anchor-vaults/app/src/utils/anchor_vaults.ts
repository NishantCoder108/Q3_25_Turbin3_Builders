"use client";
import {
    PublicKey,
} from "@solana/web3.js";
import { AnchorVault, idl } from "./solana_idltypes";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { VaultError } from "@/lib/error";

// get the vault program to interact
export function getVaultProgram(
    provider: AnchorProvider
): Program<AnchorVault> {
    return new Program(idl as AnchorVault, provider);
}

// vault state pda
export const getVaultStatePDA = (
    userPubkey: PublicKey,
    programId: PublicKey
) => {
    const [vaultState] = PublicKey.findProgramAddressSync(
        [Buffer.from("userstate"), userPubkey.toBuffer()],
        programId
    );
    return vaultState;
};

// vault pda
export const getVaultPDA = (
    vaultStatePubkey: PublicKey,
    programId: PublicKey
) => {
    const [vault] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), vaultStatePubkey.toBuffer()],
        programId
    );
    return vault;
};
// --- initialize vault
export const initializeVault = async (program: Program<AnchorVault>) => {
    try {
        const wallet = program.provider.wallet;

        if (!wallet || !wallet.publicKey) {
            throw new Error("Wallet or wallet publicKey is undefined");
        }

        const user = wallet.publicKey;

        const vaultState = getVaultStatePDA(user, program.programId);
        const vault = getVaultPDA(vaultState, program.programId);

        const tx = await program.methods
            .initialize()
            .accountsPartial({
                user,
                vault_state: vaultState,
                vault,
                system_program: PublicKey.default,

            })
            .rpc();

        if (!tx) {
            throw new VaultError("Transaction failed");
        }

    } catch (e) {
        console.error("error initializing vault : ", e);
        throw e;
    }
};

// Deposit SOL to the vault
export const deposit = async (
    amount: number,
    program: Program<AnchorVault>
) => {
    try {
        const wallet = program.provider.wallet;

        if (!wallet || !wallet.publicKey) {
            throw new Error("Wallet or wallet publicKey is undefined");
        }

        const user = wallet.publicKey;
        const vaultState = getVaultStatePDA(user, program.programId);
        const vault = getVaultPDA(vaultState, program.programId);

        const tx = await program.methods
            .deposit(new BN(amount))
            .accountsPartial({
                user,
                vault_state: vaultState,
                vault,
                system_program: PublicKey.default,
            })
            .rpc();
        if (!tx) {
            throw new VaultError("Transaction failed");
        }

        console.log("tx : ", tx);
    } catch (e) {
        console.error("error depositing SOL : ", e);
        throw e;
    }
};

// Withdraw SOL from the vault
export const withdraw = async (
    amount: number,
    program: Program<AnchorVault>
) => {
    try {
        const wallet = program.provider.wallet;

        if (!wallet || !wallet.publicKey) {
            throw new Error("Please connect your wallet to withdraw funds");
        }

        const user = wallet.publicKey;
        const vaultState = getVaultStatePDA(user, program.programId);
        const vault = getVaultPDA(vaultState, program.programId);

        const tx = await program.methods
            .withdraw(new BN(amount))
            .accountsPartial({
                user,
                vault_state: vaultState,
                vault,
                system_program: PublicKey.default,
            })
            .rpc();


        if (!tx) {
            throw new VaultError("Transaction failed");
        }
        console.log("tx : ", tx);

    } catch (e) {
        console.error("error depositing SOL : ", e);
        throw e;
    }


};

//  Closing the vault
export const closeVault = async (program: Program<AnchorVault>) => {
    try {
        const wallet = program.provider.wallet;

        if (!wallet || !wallet.publicKey) {
            throw new Error("Please connect your wallet to close the vault");
        }

        const user = wallet.publicKey;
        const vaultState = getVaultStatePDA(user, program.programId);
        const vault = getVaultPDA(vaultState, program.programId);

        const tx = await program.methods
            .close()
            .accountsPartial({
                user,
                vault_state: vaultState,
                vault,
                system_program: PublicKey.default,
            })
            .rpc();

        if (!tx) {
            throw new VaultError("Transaction failed");
        }

        console.log("tx : ", tx);
    } catch (e) {
        console.error("error depositing SOL : ", e);
        throw e;
    }




};



export const isVaultInitialized = async (
    provider: AnchorProvider,
    publicKey: PublicKey
): Promise<boolean> => {
    try {
        const program = getVaultProgram(provider);
        const vaultPubkey = getVaultStatePDA(publicKey, program.programId);

        console.log("Vault PubKey:", vaultPubkey.toString());

        if (!program.account.vaultState) {
            throw new VaultError("vaultState account not found in program.account");
        }

        const vaultAccount = await program.account.vaultState.fetch(vaultPubkey);

        console.log("Vault account found:", vaultAccount);
        return true;
    } catch (error: unknown) {
        const msg =
            error && typeof error === "object" && "message" in error
                ? (error as { message: string }).message
                : String(error);

        if (msg.includes("Account does not exist")) {
            console.log("Vault is not initialized.");
            return false;
        }

        // For other unexpected issues
        console.error("Unexpected error while checking vault:", error);
        throw new VaultError("Failed to check vault status: " + msg);
    }
};
