use starknet::{ContractAddress, contract_address_const};
use core::num::traits::zero::Zero;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub address: ContractAddress,
    pub level: u8,
    pub xp: u32,
    pub current_wave: u32,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PlayerContract {
    #[key]
    pub id: felt252,
    pub contract: ContractAddress,
}

pub fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}

#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn add_xp(ref self: Player, amount: u32) {
        self.xp += amount;
    }
}

#[generate_trait]
pub impl PlayerAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), 'Player: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), 'Player: Already exists');
    }
}

pub impl ZeroablePlayerTrait of Zero<Player> {
    #[inline(always)]
    fn zero() -> Player {
        Player { address: ZERO_ADDRESS(), level: 0, xp: 0, current_wave: 0 }
    }

    #[inline(always)]
    fn is_zero(self: @Player) -> bool {
        *self.address == ZERO_ADDRESS()
    }

    #[inline(always)]
    fn is_non_zero(self: @Player) -> bool {
        !self.is_zero()
    }
}

pub fn spawn_player(address: ContractAddress) -> Player {
    Player { address, level: 1, xp: 0, current_wave: 1 }
}

#[cfg(test)]
mod tests {
    use super::{Player, ZeroablePlayerTrait, spawn_player};
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    fn test_player_initialization() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let player = spawn_player(addr);

        assert(player.address == addr, 'Address mismatch');
        assert(player.level == 1, 'Invalid level');
        assert(player.xp == 0, 'Invalid xp');
        assert(player.current_wave == 1, 'Invalid wave');
    }

    #[test]
    fn test_zero_player() {
        let zero_player = ZeroablePlayerTrait::zero();
        assert(zero_player.is_zero(), 'Should be zero');
        assert(zero_player.level == 0, 'Level should be zero');
    }
}
