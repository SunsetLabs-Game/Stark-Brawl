use starknet::ContractAddress;
use stark_brawl::models::player::{PlayerStatus};

// Interface
#[starknet::interface]
pub trait IBrawlGame<T> {
    fn join_match(ref self: T);
    fn use_ability(ref self: T, ability_id: u256, target_id: ContractAddress);
    fn take_damage(ref self: T, amount: u32);
    fn get_player_status(ref self: T) -> PlayerStatus;
    // New item-related functions
    fn use_item(ref self: T, item_id: u32);
    // fn get_player_inventory(ref self: T) -> Inventory;
// fn get_item_details(ref self: T, item_id: u32) -> Item;
}

// Contract
#[dojo::contract]
pub mod brawl_game {
    use super::IBrawlGame;
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};

    // Models
    use stark_brawl::models::player::{Player, PlayerTrait, PlayerStatus};
    use stark_brawl::models::ability::Ability;
    use stark_brawl::models::game_match::GameMatch;
    use stark_brawl::models::item::{Item, ItemImpl, ItemType};
    use stark_brawl::models::inventory::{Inventory, InventoryImpl};

    // Store
    use stark_brawl::store::{StoreTrait};

    // Constants
    use stark_brawl::constants;

    #[storage]
    struct Storage {
        match_counter: u32,
    }

    fn dojo_init(ref self: ContractState) {
        self.match_counter.write(0);
    }

    #[abi(embed_v0)]
    impl BrawlGameImpl of IBrawlGame<ContractState> {
        fn join_match(ref self: ContractState) {
            let mut world = self.world(@"stark_brawl");
            let mut store = StoreTrait::new(world);
            let caller = get_caller_address();

            store.register_player(caller);
            store.assign_to_match(caller, self.match_counter.read());
        }

        fn use_ability(ref self: ContractState, ability_id: u256, target_id: ContractAddress) {}

        fn take_damage(ref self: ContractState, amount: u32) {
            let mut world = self.world(@"stark_brawl");
            let mut store = StoreTrait::new(world);
            let caller = get_caller_address();

            let mut player = store.read_player(caller);

            let damage_u16: u16 = if amount > 65535_u32 {
                65535_u16
            } else {
                amount.try_into().unwrap()
            };

            player.take_damage(damage_u16);
            store.write_player(@player);
        }

        fn get_player_status(ref self: ContractState) -> PlayerStatus {
            let mut world = self.world(@"stark_brawl");
            let store = StoreTrait::new(world);
            let caller = get_caller_address();

            let player = store.read_player(caller);
            player.status()
        }

        fn use_item(ref self: ContractState, item_id: u32) {
            let mut world = self.world(@"stark_brawl");
            let mut store = StoreTrait::new(world);
            let caller = get_caller_address();

            // Get player's inventory (simplified for now)
            let inventory = store.read_inventory(caller.into());

            assert(store.has_item(@inventory, item_id), 'Player does not have item');

            let item = store.read_item(item_id);
            assert(item.usable, 'Item is not usable');

            // Get player to modify their stats
            let mut player = store.read_player(caller);

            match item.item_type {
                ItemType::Trap => {
                    let _trap_damage: u32 = item.value.into() * 3; // Traps do 3x item value damage

                    // TODO: Implement actual enemy targeting system

                    // Remove trap from inventory after deployment
                    let mut inventory_mut = inventory;
                    inventory_mut.remove_item(item_id);
                    store.write_inventory(@inventory_mut);
                },
                ItemType::Upgrade => {
                    // Permanent player stat improvements
                    if item.name == "health_upgrade" {
                        // Increase max health permanently
                        let new_max_hp = player.max_hp + item.value;
                        let new_player = Player {
                            address: player.address,
                            level: player.level,
                            xp: player.xp,
                            hp: if player.hp == player.max_hp {
                                new_max_hp
                            } else {
                                player.hp
                            },
                            max_hp: new_max_hp,
                            starks: player.starks,
                            coins: player.coins,
                            gems: player.gems,
                            current_wave: player.current_wave,
                            equipped_ability: player.equipped_ability,
                            active_towers: player.active_towers,
                        };
                        player = new_player;
                    } else if item.name == "experience_boost" {
                        player.add_xp(item.value.into() * 10);
                    } else {
                        // Default upgrade: increase max health
                        let new_max_hp = player.max_hp + item.value;
                        let new_player = Player {
                            address: player.address,
                            level: player.level,
                            xp: player.xp,
                            hp: player.hp,
                            max_hp: new_max_hp,
                            starks: player.starks,
                            coins: player.coins,
                            gems: player.gems,
                            current_wave: player.current_wave,
                            equipped_ability: player.equipped_ability,
                            active_towers: player.active_towers,
                        };
                        player = new_player;
                    }

                    // Upgrades are consumed when used
                    let mut inventory_mut = inventory;
                    inventory_mut.remove_item(item_id);
                    store.write_inventory(@inventory_mut);
                },
                ItemType::Consumable => {
                    // Heal the player
                    let heal_amount: u16 = item.value;
                    player.heal(heal_amount);

                    // Remove consumable from inventory (single use)
                    let mut inventory_mut = inventory;
                    inventory_mut.remove_item(item_id);
                    store.write_inventory(@inventory_mut);
                },
            }

            // Save all changes
            store.write_player(@player);
        }
    }
}
