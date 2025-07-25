use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use starknet::ContractAddress;
use stark_brawl::models::inventory::{Inventory, InventoryImpl};
use stark_brawl::models::item::Item;
use stark_brawl::models::tower_stats::TowerStats;
use stark_brawl::models::player::{Player, PlayerImpl, spawn_player};
use stark_brawl::models::ability::Ability;
use stark_brawl::models::game_match::GameMatch;

#[derive(Drop)]
pub struct Store {
    world: WorldStorage,
}

#[generate_trait]
pub impl StoreImpl of StoreTrait {
    #[inline(always)]
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    // -------------------------------
    // Tower operations
    // -------------------------------
    #[inline]
    fn get_tower_stats(self: @Store, tower_type: felt252, level: u8) -> TowerStats {
        self.world.read_model((tower_type, level))
    }

    #[inline]
    fn set_tower_stats(ref self: Store, tower_stats: TowerStats) {
        self.world.write_model(@tower_stats);
    }

    // -------------------------------
    // Item operations
    // -------------------------------
    #[inline]
    fn read_item(self: @Store, item_id: u32) -> Item {
        self.world.read_model(item_id)
    }

    #[inline]
    fn write_item(ref self: Store, item: @Item) {
        self.world.write_model(item);
    }

    // -------------------------------
    // Inventory operations
    // -------------------------------
    #[inline]
    fn read_inventory(self: @Store, player_address: ContractAddress) -> Inventory {
        self.world.read_model(player_address)
    }

    #[inline]
    fn write_inventory(ref self: Store, inventory: @Inventory) {
        self.world.write_model(inventory);
    }

    #[inline]
    fn has_item(self: @Store, inventory: @Inventory, item_id: u32) -> bool {
        let mut i = 0;
        loop {
            if i >= inventory.items.len() {
                break false;
            }
            let current_item = inventory.items.at(i);
            if current_item.id == @item_id {
                break true;
            }
            i += 1;
        }
    }

    // -------------------------------
    // Player operations
    // -------------------------------
    #[inline]
    fn read_player(self: @Store, player_address: ContractAddress) -> Player {
        self.world.read_model(player_address)
    }

    #[inline]
    fn write_player(ref self: Store, player: @Player) {
        self.world.write_model(player);
    }

    // Register a new player
    #[inline]
    fn register_player(ref self: Store, address: ContractAddress) {
        let player = spawn_player(address);
        self.write_player(@player);
    }

    // -------------------------------
    // Ability operations
    // -------------------------------
    #[inline]
    fn read_ability(self: @Store, ability_id: u256) -> Ability {
        self.world.read_model(ability_id)
    }

    #[inline]
    fn write_ability(ref self: Store, ability: @Ability) {
        self.world.write_model(ability);
    }

    // -------------------------------
    // Match operations
    // -------------------------------
    #[inline]
    fn read_match(self: @Store, match_id: u32) -> GameMatch {
        self.world.read_model(match_id)
    }

    #[inline]
    fn write_match(ref self: Store, game_match: @GameMatch) {
        self.world.write_model(game_match);
    }

    // Assign player to a match
    #[inline]
    fn assign_to_match(ref self: Store, player_address: ContractAddress, match_id: u32) {
        // For now, just read and update the player's current_wave to indicate they're in a match
        let mut player = self.read_player(player_address);
        // You might want to add a match_id field to Player model later
        self.write_player(@player);
        // You could also create/update a match record here
    // let mut game_match = self.read_match(match_id);
    // game_match.player1 = player_address; // or player2, depending on logic
    // self.write_match(@game_match);
    }

    // Simple helpers to add coins and gems to player
    #[inline]
    fn add_coins(ref self: Store, mut player: Player, amount: u64) -> Player {
        player.add_coins(amount);
        self.write_player(@player);
        player
    }

    #[inline]
    fn add_gems(ref self: Store, mut player: Player, amount: u64) -> Player {
        player.add_gems(amount);
        self.write_player(@player);
        player
    }
}
