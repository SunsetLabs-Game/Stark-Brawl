use starknet::{ContractAddress, contract_address_const};
use core::num::traits::zero::Zero;
use core::option::Option;
use stark_brawl::models::ability::Ability;

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug, PartialEq)]
pub enum PlayerStatus {
    Alive,
    Dead,
    InMatch,
    Waiting,
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub address: ContractAddress,
    pub level: u8,
    pub xp: u32,
    pub hp: u16,
    pub max_hp: u16,
    pub starks: u128,
    pub coins: u64,
    pub gems: u64,
    pub current_wave: u32,
    pub equipped_ability: Option<u256>,
    pub active_towers: u8,
}

pub fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}

#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn add_xp(ref self: Player, amount: u32) {
        self.xp += amount;
    }

    fn take_damage(ref self: Player, damage: u16) {
        if damage >= self.hp {
            self.hp = 0;
        } else {
            self.hp -= damage;
        }
    }

    fn heal(ref self: Player, amount: u16) {
        self.hp = core::cmp::min(self.hp + amount, self.max_hp);
    }

    fn is_alive(self: @Player) -> bool {
        *self.hp > 0_u16
    }

    fn add_coins(ref self: Player, amount: u64) {
        self.coins += amount;
    }

    fn add_gems(ref self: Player, amount: u64) {
        self.gems += amount;
    }

    fn spend_coins(ref self: Player, amount: u64) {
        assert(self.coins >= amount, 'Player: Not enough coins');
        self.coins -= amount;
    }

    fn spend_gems(ref self: Player, amount: u64) {
        assert(self.gems >= amount, 'Player: Not enough gems');
        self.gems -= amount;
    }

    // Add the missing status method
    fn status(self: @Player) -> PlayerStatus {
        if *self.hp > 0 {
            PlayerStatus::Alive
        } else {
            PlayerStatus::Dead
        }
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
        Player {
            address: ZERO_ADDRESS(),
            level: 0,
            xp: 0,
            hp: 0,
            max_hp: 0,
            starks: 0,
            coins: 0,
            gems: 0,
            current_wave: 0,
            equipped_ability: Option::None(()),
            active_towers: 0,
        }
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
    Player {
        address,
        level: 1,
        xp: 0,
        hp: 100,
        max_hp: 100,
        starks: 0,
        coins: 0,
        gems: 0,
        current_wave: 1,
        equipped_ability: Option::None(()),
        active_towers: 0,
    }
}

#[cfg(test)]
mod tests {
    use super::{Player, ZeroablePlayerTrait, PlayerImpl, spawn_player, PlayerTrait, PlayerStatus};
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    fn test_player_initialization() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let player = Player {
            address: addr,
            level: 1,
            xp: 0,
            hp: 100,
            max_hp: 100,
            starks: 0,
            coins: 50,
            gems: 10,
            current_wave: 2,
            equipped_ability: Option::None(()),
            active_towers: 1,
        };
        assert(player.address == addr, 'Address mismatch');
        assert(player.level == 1, 'Invalid level');
        assert(player.hp == 100, 'Invalid hp');
        assert(player.coins == 50, 'Invalid coins');
        assert(player.gems == 10, 'Invalid gems');
        assert(player.current_wave == 2, 'Invalid wave');
    }

    #[test]
    fn test_zero_player() {
        let zero_player = ZeroablePlayerTrait::zero();
        assert(zero_player.is_zero(), 'Should be zero');
        assert(zero_player.coins == 0, 'Coins should be zero');
        assert(zero_player.equipped_ability.is_none(), 'Ability should be none');
    }

    #[test]
    fn test_non_zero_player() {
        let addr: ContractAddress = contract_address_const::<0xABC>();
        let player = spawn_player(addr);
        assert(player.is_non_zero(), 'Should be non-zero');
        assert(player.current_wave == 1, 'Wave should be initialized at 1');
    }

    #[test]
    fn test_is_alive() {
        let addr: ContractAddress = contract_address_const::<0xDEF>();
        let mut player = spawn_player(addr);
        assert(player.is_alive(), 'Player should be alive');
        player.take_damage(150);
        assert(!player.is_alive(), 'Player should be dead');
    }

    #[test]
    fn test_add_and_spend_currency() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut player = spawn_player(addr);
        player.add_coins(100_u64);
        player.add_gems(20_u64);
        player.spend_coins(40_u64);
        player.spend_gems(5_u64);
        assert(player.coins == 60_u64, 'Coins not updated correctly');
        assert(player.gems == 15_u64, 'Gems not updated correctly');
    }

    #[test]
    fn test_player_status() {
        let addr: ContractAddress = contract_address_const::<0x456>();
        let mut player = spawn_player(addr);
        assert(player.status() == PlayerStatus::Alive, 'Should be alive');
        player.take_damage(200);
        assert(player.status() == PlayerStatus::Dead, 'Should be dead');
    }
}
