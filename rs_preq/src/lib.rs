#[cfg(test)]
mod tests {
    use solana_sdk::{
        pubkey::Pubkey,
        signature::{Keypair, Signer},
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
        // We will add this after keypair save
    }

    #[test]
    fn transfer_sol() {
        // Add after airdrop
    }
}
