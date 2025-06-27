use solana_client::rpc_client::RpcClient;
use solana_sdk::signature::read_keypair_file;

const RPC_URL: &str =
    "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";

#[cfg(test)]
mod tests {
    use crate::RPC_URL;
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::{
        pubkey::Pubkey,
        signature::{Keypair, Signer, read_keypair_file},
    };

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
        // Add after airdrop
    }
}
