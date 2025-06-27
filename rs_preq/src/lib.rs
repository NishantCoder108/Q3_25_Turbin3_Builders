use solana_client::rpc_client::RpcClient;
use solana_sdk::signature::read_keypair_file;
use solana_sdk::signer::keypair::Keypair;
const RPC_URL: &str =
    "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";

#[cfg(test)]
mod tests {
    use crate::{RPC_URL, read_keypair_from_env};
    use solana_client::rpc_client::RpcClient;
    use solana_program::system_instruction::transfer;
    use solana_sdk::{
        instruction::{AccountMeta, Instruction},
        message::Message,
        pubkey::Pubkey,
        signature::{Keypair, Signer, read_keypair_file},
        system_program,
        transaction::Transaction,
    };
    use std::str::FromStr;

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!("Wallet pubkey: {}", kp.pubkey());
        println!("Save private key as JSON:");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn airdrop() {
        let client = RpcClient::new(RPC_URL.to_string());
        let keypair = read_keypair_file("dev-wallet.json").expect("Failed to read keypair file");

        // We're going to claim 2 devnet SOL tokens (2 billion lamports)
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(sig) => {
                println!("Success! Check your TX here:");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
            }
            Err(err) => {
                println!("Airdrop failed: {}", err);
            }
        }
    }

    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Failed to read keypair");
        let from_pubkey = keypair.pubkey();

        let to_pubkey = Pubkey::from_str("HiMmuCbieNgDNFd9GbcbVSHYPGPuEgZWwQxJULaJVoVs").unwrap();

        let client = RpcClient::new(RPC_URL.to_string());

        let blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get blockhash");

        let tx = Transaction::new_signed_with_payer(
            &[transfer(&from_pubkey, &to_pubkey, 1_000_000)], // 0.001 SOL
            Some(&from_pubkey),
            &[&keypair],
            blockhash,
        );

        let sig = client
            .send_and_confirm_transaction(&tx)
            .expect("Failed to send tx");

        println!("✅ Transfer Success! Explorer:");
        println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
    }

    #[test]
    fn empty_wallet() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Failed to read wallet");
        let from_pubkey = keypair.pubkey();

        let to_pubkey = Pubkey::from_str("HiMmuCbieNgDNFd9GbcbVSHYPGPuEgZWwQxJULaJVoVs").unwrap();

        let client = RpcClient::new(RPC_URL.to_string());

        let blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get blockhash");

        let balance = client
            .get_balance(&from_pubkey)
            .expect("Failed to get balance");

        println!("Current balance: {} lamports", balance);

        //Create mock tx to estimate fee
        let msg = Message::new_with_blockhash(
            &[transfer(&from_pubkey, &to_pubkey, balance)],
            Some(&from_pubkey),
            &blockhash,
        );

        let fee = client.get_fee_for_message(&msg).expect("Failed to get fee");

        println!("Estimated fee: {} lamports", fee);

        //Final tx with (balance - fee)
        let tx = Transaction::new_signed_with_payer(
            &[transfer(&from_pubkey, &to_pubkey, balance - fee)],
            Some(&from_pubkey),
            &[&keypair],
            blockhash,
        );

        let sig = client
            .send_and_confirm_transaction(&tx)
            .expect("Failed to send transaction");

        println!("✅ Dev wallet emptied!");
        println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
    }

    #[test]
    fn submit_proof() {
        let client = RpcClient::new(RPC_URL.to_string());
        let signer = read_keypair_from_env();
        let signer_pubkey = signer.pubkey();

        let turbin3_program =
            Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap();
        let collection = Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap();
        let mpl_core_program =
            Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap();
        let system_program = system_program::id();

        // Get the PDA again (from TypeScript prereq)
        let (prereq_pda, _bump) =
            Pubkey::find_program_address(&[b"prereqs", signer_pubkey.as_ref()], &turbin3_program);

        let (authorith_pda, _bump) =
            Pubkey::find_program_address(&[b"collection", collection.as_ref()], &turbin3_program);

        // Generate a new keypair for mint
        let mint = Keypair::new();

        //  Discriminator for `submit_rs` instruction
        let data = vec![77, 124, 82, 163, 21, 133, 181, 206];

        // define Accounts data lists
        let accounts = vec![
            AccountMeta::new(signer_pubkey, true),           // user
            AccountMeta::new(prereq_pda, false),             // PDA account
            AccountMeta::new(mint.pubkey(), true),           // mint
            AccountMeta::new(collection, false),             // collection
            AccountMeta::new_readonly(authorith_pda, false), // authority (same as PDA)
            AccountMeta::new_readonly(mpl_core_program, false),
            AccountMeta::new_readonly(system_program, false),
        ];

        let instruction = Instruction {
            program_id: turbin3_program,
            accounts,
            data,
        };

        let blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get blockhash");

        let tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&signer_pubkey),
            &[&signer, &mint],
            blockhash,
        );

        let sig = client
            .send_and_confirm_transaction(&tx)
            .expect("Failed to send TX");

        println!("✅ Proof submitted! Check here:");
        println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
    }
}

fn read_keypair_from_env() -> Keypair {
    use bs58;
    use dotenvy::dotenv;
    use solana_sdk::signature::Keypair;
    use std::env;

    dotenv().ok(); // Load from .env
    let b58_str = env::var("PRIVATE_KEY").expect("PRIVATE_KEY missing from .env");

    let secret_bytes = bs58::decode(b58_str)
        .into_vec()
        .expect("Failed to decode base58");

    Keypair::from_bytes(&secret_bytes).expect("Invalid keypair bytes")
}
