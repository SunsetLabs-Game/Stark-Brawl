use starknet::ContractAddress;

#[starknet::interface]
pub trait IPlayerSystem<T> {
    fn initialize(ref self: T, player_address: ContractAddress);
    // Combat
    fn take_damage(ref self: T, player_address: ContractAddress, amount: u16);
    fn heal(ref self: T, player_address: ContractAddress, amount: u16);
    fn is_alive(self: @T, player_address: ContractAddress) -> bool;
    // Currency
    fn add_coins(ref self: T, player_address: ContractAddress, amount: u64);
    fn spend_coins(ref self: T, player_address: ContractAddress, amount: u64);
    fn add_gems(ref self: T, player_address: ContractAddress, amount: u64);
    fn spend_gems(ref self: T, player_address: ContractAddress, amount: u64);
    // Equipment
    fn equip_ability(ref self: T, player_address: ContractAddress, ability_id: u256);
    fn activate_tower(ref self: T, player_address: ContractAddress);
    // Upgrades
    fn upgrade_max_hp(ref self: T, player_address: ContractAddress, value: u16);
    // --- Getters ---
    fn get_hp(self: @T, player_address: ContractAddress) -> u16;
    fn get_max_hp(self: @T, player_address: ContractAddress) -> u16;
    fn get_coins(self: @T, player_address: ContractAddress) -> u64;
    fn get_gems(self: @T, player_address: ContractAddress) -> u64;
    fn get_equipped_ability(self: @T, player_address: ContractAddress) -> u256;
    fn get_active_towers(self: @T, player_address: ContractAddress) -> u8;
}

#[dojo::contract]
pub mod player_system {
    use starknet::{ContractAddress};
    use starknet::storage::{
        Map, StoragePointerWriteAccess, StoragePathEntry, StoragePointerReadAccess,
    };
    use super::IPlayerSystem;

    #[storage]
    struct Storage {
        hp: Map<ContractAddress, u16>,
        max_hp: Map<ContractAddress, u16>,
        coins: Map<ContractAddress, u64>,
        gems: Map<ContractAddress, u64>,
        equipped_ability: Map<ContractAddress, u256>,
        active_towers: Map<ContractAddress, u8>,
    }

    #[abi(embed_v0)]
    pub impl PlayerSystemImpl of IPlayerSystem<ContractState> {
        fn initialize(ref self: ContractState, player_address: ContractAddress) {
            // Set initial game state values when a player joins
            self.hp.entry(player_address).write(100);
            self.max_hp.entry(player_address).write(100);
            self.coins.entry(player_address).write(0);
            self.gems.entry(player_address).write(0);
            self.equipped_ability.entry(player_address).write(0);
            self.active_towers.entry(player_address).write(0);
        }

        // Combat
        fn take_damage(ref self: ContractState, player_address: ContractAddress, amount: u16) {
            let current_hp = self.hp.entry(player_address).read();
            let new_hp = if amount >= current_hp {
                0
            } else {
                current_hp - amount
            };
            self.hp.entry(player_address).write(new_hp);
        }

        fn heal(ref self: ContractState, player_address: ContractAddress, amount: u16) {
            let current_hp = self.hp.entry(player_address).read();
            let max_hp = self.max_hp.entry(player_address).read();
            let new_hp = core::cmp::min(current_hp + amount, max_hp);
            self.hp.entry(player_address).write(new_hp);
        }

        fn is_alive(self: @ContractState, player_address: ContractAddress) -> bool {
            self.hp.entry(player_address).read() > 0
        }

        // Currency
        fn add_coins(ref self: ContractState, player_address: ContractAddress, amount: u64) {
            let current_coins = self.coins.entry(player_address).read();
            self.coins.entry(player_address).write(current_coins + amount);
        }

        fn spend_coins(ref self: ContractState, player_address: ContractAddress, amount: u64) {
            let current_coins = self.coins.entry(player_address).read();
            assert(current_coins >= amount, 'Player: Not enough coins');
            self.coins.entry(player_address).write(current_coins - amount);
        }

        fn add_gems(ref self: ContractState, player_address: ContractAddress, amount: u64) {
            let current_gems = self.gems.entry(player_address).read();
            self.gems.entry(player_address).write(current_gems + amount);
        }

        fn spend_gems(ref self: ContractState, player_address: ContractAddress, amount: u64) {
            let current_gems = self.gems.entry(player_address).read();
            assert(current_gems >= amount, 'Player: Not enough gems');
            self.gems.entry(player_address).write(current_gems - amount);
        }

        // Equipment
        fn equip_ability(
            ref self: ContractState, player_address: ContractAddress, ability_id: u256,
        ) {
            self.equipped_ability.entry(player_address).write(ability_id);
        }

        fn activate_tower(ref self: ContractState, player_address: ContractAddress) {
            let current_towers = self.active_towers.entry(player_address).read();
            self.active_towers.entry(player_address).write(current_towers + 1);
        }

        fn upgrade_max_hp(ref self: ContractState, player_address: ContractAddress, value: u16) {
            let max_hp = self.max_hp.entry(player_address).read();

            self.max_hp.entry(player_address).write(max_hp + value);
        }

        // --- Getters ---
        fn get_hp(self: @ContractState, player_address: ContractAddress) -> u16 {
            self.hp.entry(player_address).read()
        }

        fn get_max_hp(self: @ContractState, player_address: ContractAddress) -> u16 {
            self.max_hp.entry(player_address).read()
        }

        fn get_coins(self: @ContractState, player_address: ContractAddress) -> u64 {
            self.coins.entry(player_address).read()
        }

        fn get_gems(self: @ContractState, player_address: ContractAddress) -> u64 {
            self.gems.entry(player_address).read()
        }

        fn get_equipped_ability(self: @ContractState, player_address: ContractAddress) -> u256 {
            self.equipped_ability.entry(player_address).read()
        }

        fn get_active_towers(self: @ContractState, player_address: ContractAddress) -> u8 {
            self.active_towers.entry(player_address).read()
        }
    }
}
