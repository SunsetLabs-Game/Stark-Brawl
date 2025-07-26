use starknet::ContractAddress;


#[starknet::interface]
pub trait IBrawlGame<T> {
    fn join_game(ref self: T);
    fn use_ability(ref self: T, ability_id: u32, target_id: ContractAddress);
    fn take_damage(ref self: T, amount: u32);
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
    use starknet::storage::{StoragePointerWriteAccess};


    use dojo::world::IWorldDispatcherTrait;
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;


    use stark_brawl::models::player::{Player, PlayerTrait, spawn_player};
    use stark_brawl::models::ability::{Ability};
    use stark_brawl::models::item::{Item, ItemType};
    use stark_brawl::models::inventory::{Inventory};
    use stark_brawl::models::enemy::{Enemy, EnemySystem};

    #[storage]
    struct Storage {
        game_counter: u32,
    }

    fn dojo_init(ref self: ContractState) {
        self.game_counter.write(0);
    }

    #[abi(embed_v0)]
    impl BrawlGameImpl of IBrawlGame<ContractState> {
        fn join_game(ref self: ContractState) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let player = spawn_player(caller);

            world.write_model(@player);
        }

        fn use_ability(ref self: ContractState, ability_id: u32, target_id: ContractAddress) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let mut player: Player = world.read_model(caller);
            let _ability: Ability = world.read_model(ability_id);

            world.write_model(@player);
        }

        fn take_damage(ref self: ContractState, amount: u32) {
            let mut world = self.world_default();
            let caller = get_caller_address();

            let mut player: Player = world.read_model(caller);

            PlayerTrait::take_damage(ref player, amount.try_into().unwrap());

            world.write_model(@player);
        }

        fn get_player_status(ref self: ContractState) -> PlayerStatus {
            let world = self.world_default();
            let caller = get_caller_address();

            let player: Player = world.read_model(caller);

            if PlayerTrait::is_alive(@player) {
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
            let mut player: Player = world.read_model(caller);

            match item.item_type {
                ItemType::Trap => {},
                ItemType::Upgrade => {
                    let updated_player = Player { max_hp: player.max_hp + item.value, ..player };
                    world.write_model(@updated_player);
                },
                ItemType::Consumable => {
                    PlayerTrait::heal(ref player, item.value);
                    world.write_model(@player);
                },
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
    }
}
