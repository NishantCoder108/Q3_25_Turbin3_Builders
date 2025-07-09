#![allow(unexpected_cfgs, deprecated)]
use anchor_lang::prelude::*;

declare_id!("G4ezSKewUYAZ5zE8aquJhRMAvaBYJoHaEcAtUY4VigLt");

#[program]
pub mod anchor_vaults {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
