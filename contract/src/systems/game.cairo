use starknet::ContractAddress;

#[starknet::interface]
pub trait IBrawlGame<T> {
    fn join_game(ref self: T);
    fn use_ability(ref self: T, ability_id: u32, target_id: ContractAddress);
    fn take_damage(ref self: T, amount: u32);
    fn attack_enemy(ref self: T, enemy_id: u64, damage: u32);
    fn get_player_status(ref self: T) -> PlayerStatus;
    fn use_item(ref self: T, item_id: u32);
}

#[derive(Copy, Drop, Serde)]
pub enum PlayerStatus {
    Alive,
    Dead,
    InGame,
    Waiting,
}


#[dojo::contract]
pub mod brawl_game {
    use super::{IBrawlGame, PlayerStatus};
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{StoragePointerWriteAccess, StoragePointerReadAccess};


    use dojo::model::{ModelStorage};


    use stark_brawl::models::player::{Player, spawn_player};
    use stark_brawl::models::ability::{Ability};
    use stark_brawl::models::item::{Item, ItemType};
    use stark_brawl::models::inventory::{Inventory};
    use stark_brawl::models::enemy::{Enemy, EnemySystem};
    use stark_brawl::store::{Store, StoreImpl};
    use stark_brawl::systems::player::{IPlayerSystemDispatcher, IPlayerSystemDispatcherTrait};

    #[storage]
    struct Storage {
        game_counter: u32,
        player_system_contract_address: ContractAddress,
    }

    fn dojo_init(ref self: ContractState, player_system_contract_address: ContractAddress) {
        self.game_counter.write(0);
        self.player_system_contract_address.write(player_system_contract_address);
    }

    #[abi(embed_v0)]
    impl BrawlGameImpl of IBrawlGame<ContractState> {
        fn join_game(ref self: ContractState) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let player = spawn_player(caller);

            world.write_model(@player);

            let player_system_dispatcher = self.player_system_dispatcher();
            player_system_dispatcher.initialize(caller);
        }

        fn use_ability(ref self: ContractState, ability_id: u32, target_id: ContractAddress) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let mut player: Player = world.read_model(caller);
            let _ability: Ability = world.read_model(ability_id);

            world.write_model(@player);
        }

        fn take_damage(ref self: ContractState, amount: u32) {
            // let mut world = self.world_default();
            let player_system_dispatcher = self.player_system_dispatcher();

            player_system_dispatcher.take_damage(get_caller_address(), amount.try_into().unwrap());
        }

        fn attack_enemy(ref self: ContractState, enemy_id: u64, damage: u32) {
            let caller = get_caller_address();
            let world = self.world_default();

            // Instantiate the Store to interact with models
            let mut store: Store = StoreImpl::new(world);

            // Read the current state of the enemy
            let enemy: Enemy = store.read_enemy(enemy_id);

            // CHECK to ensure we're not attacking a dead enemy
            assert(enemy.is_alive, 'Enemy is already dead');

            // Apply damage to the enemy
            let damaged_enemy = EnemySystem::take_damage(@enemy, damage);

            // Write the enemy's new state back to storage
            store.write_enemy(@damaged_enemy);

            // CHECK if the enemy was defeated in this attack
            if !damaged_enemy.is_alive {
                // 6. If so, call the store to distribute rewards to the attacker
                store
                    .distribute_rewards(
                        self.player_system_contract_address.read(), enemy_id, caller,
                    );
            }
        }

        fn get_player_status(ref self: ContractState) -> PlayerStatus {
            let caller = get_caller_address();
            let player_system_dispatcher = self.player_system_dispatcher();

            if player_system_dispatcher.is_alive(caller) {
                PlayerStatus::Alive
            } else {
                PlayerStatus::Dead
            }
        }

        fn use_item(ref self: ContractState, item_id: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let mut inventory: Inventory = world.read_model(caller);
            let item: Item = world.read_model(item_id);
            let player_system_dispatcher = self.player_system_dispatcher();

            match item.item_type {
                ItemType::Trap => {},
                ItemType::Upgrade => {
                    player_system_dispatcher.upgrade_max_hp(caller, item.value);
                },
                ItemType::Consumable => { player_system_dispatcher.heal(caller, item.value); },
            }

            world.write_model(@inventory);
        }
    }

    #[generate_trait]
    pub impl PathSystemImpl of PathSystemTrait {
        /// Returns the (x, y) coordinates for the given path_id and step index
        fn get_path_step(path_id: u64, index: u32) -> (u32, u32) {
            // Predefined paths
            match path_id {
                0 => {
                    // Path 0: Simple straight line from left to right
                    let path_0_steps = array![
                        (0_u32, 5_u32), // Start at (0, 5)
                        (1_u32, 5_u32),
                        (2_u32, 5_u32),
                        (3_u32, 5_u32),
                        (4_u32, 5_u32),
                        (5_u32, 5_u32) // End at (5, 5)
                    ];
                    Self::get_step_from_array(path_0_steps.span(), index)
                },
                1 => {
                    // Path 1: L-shaped path
                    let path_1_steps = array![
                        (0_u32, 0_u32), // Start at (0, 0)
                        (0_u32, 1_u32),
                        (0_u32, 2_u32),
                        (0_u32, 3_u32),
                        (1_u32, 3_u32),
                        (2_u32, 3_u32),
                        (3_u32, 3_u32) // End at (3, 3)
                    ];
                    Self::get_step_from_array(path_1_steps.span(), index)
                },
                2 => {
                    // Path 2: Zigzag pattern
                    let path_2_steps = array![
                        (0_u32, 2_u32), // Start
                        (1_u32, 2_u32),
                        (2_u32, 2_u32),
                        (2_u32, 1_u32),
                        (2_u32, 0_u32),
                        (3_u32, 0_u32),
                        (4_u32, 0_u32),
                        (4_u32, 1_u32),
                        (4_u32, 2_u32) // End
                    ];
                    Self::get_step_from_array(path_2_steps.span(), index)
                },
                _ => panic!("Invalid path_id"),
            }
        }

        /// Moves an enemy to the next valid step in its path
        /// Returns an updated Enemy with new x, y coordinates
        fn advance_enemy_position(ref enemy: Enemy, path_id: u64, current_index: u32) -> Enemy {
            let next_index = current_index + 1;

            // Check if we've reached the end of the path
            if Self::is_path_completed(path_id, next_index) {
                // Enemy has completed the path - return current enemy unchanged
                enemy
            } else {
                // Get the next position
                let (next_x, next_y) = Self::get_path_step(path_id, next_index);

                EnemySystem::move_to(@enemy, next_x, next_y)
            }
        }

        /// Checks whether the enemy has reached the last step of its path
        fn is_path_completed(path_id: u64, index: u32) -> bool {
            // Get the path length for each predefined path
            let path_length = match path_id {
                0 => 6_u32, // Path 0 has 6 steps (indices 0-5)
                1 => 7_u32, // Path 1 has 7 steps (indices 0-6)  
                2 => 9_u32, // Path 2 has 9 steps (indices 0-8)
                _ => panic!("Invalid path_id"),
            };

            index >= path_length
        }

        /// Get a step from a Span of coordinates
        fn get_step_from_array(steps: Span<(u32, u32)>, index: u32) -> (u32, u32) {
            assert(index < steps.len(), 'Index out of bounds');
            *steps.at(index.into())
        }
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"stark_brawl")
        }

        fn player_system_dispatcher(self: @ContractState) -> IPlayerSystemDispatcher {
            IPlayerSystemDispatcher { contract_address: self.player_system_contract_address.read() }
        }
    }
}
