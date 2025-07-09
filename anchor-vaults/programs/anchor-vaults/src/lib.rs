#![allow(unexpected_cfgs, deprecated)]

use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
declare_id!("G4ezSKewUYAZ5zE8aquJhRMAvaBYJoHaEcAtUY4VigLt");

#[program]
pub mod anchor_vaults {
    use super::*;

    // Initialize (For first timer) , deposit (sol store inside onchain) , withdraw  (sol withdraw from onchain), close (After all sol  withdrawing close the account)
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);

        ctx.accounts.initialize(&ctx.bumps)?; //During initialization it will create bump and here we are storing inside chain . so it will not call again and again
        Ok(())
    }

    pub fn deposit(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        msg!("Withdrawing...");
        Ok(())
    }

    pub fn close(_ctx: Context<Close>) -> Result<()> {
        msg!("Closing your account ");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        seeds = [b"userstate", user.key().as_ref()], 
        bump,
        space = VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {
        // Get the amount of lamports needed to make the vault rent exempt
        let rent_exempt = Rent::get()?.minimum_balance(self.vault.to_account_info().data_len());

        // Transfer the rent-exempt amount from the user to the vault
        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, rent_exempt)?;

        self.vault_state.user_state_bump = bumps.vault_state;
        self.vault_state.user_vault_bump = bumps.vault;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit {}

#[derive(Accounts)]
pub struct Withdraw {}

#[derive(Accounts)]
pub struct Close {}

#[account]
pub struct VaultState {
    pub user_state_bump: u8,
    pub user_vault_bump: u8,
}

impl Space for VaultState {
    const INIT_SPACE: usize = 8 + 1 + 1;
}
