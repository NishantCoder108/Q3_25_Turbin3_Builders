use solana_client::rpc_client::RpcClient;
use solana_sdk::signature::read_keypair_file;

const RPC_URL: &str =
    "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";

#[cfg(test)]
mod tests {
    use crate::RPC_URL;
    use solana_client::rpc_client::RpcClient;
    use solana_program::system_instruction::transfer;
    use solana_sdk::{
        message::Message,
        pubkey::Pubkey,
        signature::{Keypair, Signer, read_keypair_file},
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
}
