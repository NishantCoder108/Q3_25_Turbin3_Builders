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

    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        msg!("Deposit from: {:?}", ctx.);
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


// #[derive(Accounts)]
// pub struct Payment<'info> {
//     #[account(mut)]
//     pub user: Signer<'info>,
//     #[account(
//         mut,
//         seeds = [b"vault", vault_state.key().as_ref()], 
//         bump = vault_state.vault_bump,
//     )]
//     pub vault: SystemAccount<'info>,
//     #[account(
//         seeds = [b"state", user.key().as_ref()],
//         bump = vault_state.state_bump,
//     )]
//     pub vault_state: Account<'info, VaultState>,
//     pub system_program: Program<'info, System>,
// }
#[derive(Accounts)]
pub struct Payment<'info> {

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        seeds = [b"userstate", user.key().as_ref()], 
        bump = vault_state.user_state_bump,
        
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.user_vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}



impl<'info> Payment<'info> {
     pub fn deposit(&mut self, amount: u64) -> Result<()> {

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.user.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, amount)?;

        Ok(())
    }


     pub fn withdraw(&mut self, amount: u64) -> Result<()> {

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.user_vault_bump]
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, amount)?;

        Ok(())
    }


}

/**
 * *Note : Transfer SOL from wallet address  to PDA is easy because of wallet will sign the transaction
 * - But in case of , Transfer from PDA to Wallet address we use signer seeds for singing
 *  *
 * ``CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);``
 */

#[derive(Accounts)]
pub struct Withdraw {}

#[derive(Accounts)]
pub struct Close <'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"userstate", user.key().as_ref()], 
        bump= vault_state.user_state_bump,
        close= user,
        
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump =vault_state.user_vault_bump,
    )]
    pub vault: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}


impl<'info> Close<'info> {
    pub fn close(&mut self) -> Result<()> {
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.user.to_account_info(),
        };

        let seeds = &[
            b"vault",
            self.vault_state.to_account_info().key.as_ref(),
            &[self.vault_state.user_vault_bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_ctx, self.vault.lamports())?;

        Ok(())
    }
}

#[account]
pub struct VaultState {
    pub user_state_bump: u8,
    pub user_vault_bump: u8,
}

impl Space for VaultState {
    const INIT_SPACE: usize = 8 + 1 + 1;
}
