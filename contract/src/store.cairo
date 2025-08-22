use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use stark_brawl::models::inventory::{Inventory, InventoryImpl};
use stark_brawl::models::item::Item;
use stark_brawl::models::tower_stats::TowerStats;
use stark_brawl::models::tower::{errors as TowerErrors, Tower, TowerImpl, ZeroableTower};
use stark_brawl::models::trap::{Trap, TrapImpl, ZeroableTrapTrait, Vec2};
use stark_brawl::models::player::{Player, PlayerContract, PlayerImpl};
use stark_brawl::systems::player::{IPlayerSystemDispatcher, IPlayerSystemDispatcherTrait};
use stark_brawl::models::wave::{errors as WaveErrors, Wave, WaveImpl, ZeroableWave};
use stark_brawl::models::enemy::{Enemy, EnemyImpl, ZeroableEnemy};
use stark_brawl::models::statistics::{Statistics, StatisticsImpl, ZeroableStatistics};
use stark_brawl::models::leaderboard::{
    LeaderboardEntry, ILeaderboardEntry, ZeroableLeaderboardEntry,
};
use starknet::ContractAddress;
use core::num::traits::Zero;

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
    // TowerStats operations
    // -------------------------------
    #[inline]
    fn get_tower_stats(self: Store, tower_type: felt252, level: u8) -> TowerStats {
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
    fn read_item(self: Store, item_id: u32) -> Item {
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
    fn read_inventory(self: Store, inventory_id: u32) -> Inventory {
        self.world.read_model(inventory_id)
    }

    #[inline]
    fn write_inventory(ref self: Store, inventory: @Inventory) {
        self.world.write_model(inventory);
    }

    #[inline]
    fn has_item(ref self: Store, inventory: @Inventory, item_id: u32) -> bool {
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

    #[inline(always)]
    fn player_system_client(self: @Store) -> IPlayerSystemDispatcher {
        let contract: PlayerContract = self.world.read_model('PLAYER_CONTRACT');
        assert!(contract.contract.is_non_zero(), "PlayerSystem_contract_not_configured");
        IPlayerSystemDispatcher { contract_address: contract.contract }
    }

    #[inline]
    fn add_coins(self: @Store, player_address: ContractAddress, amount: u64) {
        self.player_system_client().add_coins(player_address, amount);
    }

    #[inline]
    fn spend_coins(self: @Store, player_address: ContractAddress, amount: u64) {
        self.player_system_client().spend_coins(player_address, amount);
    }

    #[inline]
    fn add_gems(self: @Store, player_address: ContractAddress, amount: u64) {
        self.player_system_client().add_gems(player_address, amount);
    }

    #[inline]
    fn spend_gems(self: @Store, player_address: ContractAddress, amount: u64) {
        self.player_system_client().spend_gems(player_address, amount);
    }

    #[inline]
    fn get_coins(self: @Store, player_address: ContractAddress) -> u64 {
        self.player_system_client().get_coins(player_address)
    }

    #[inline]
    fn get_gems(self: @Store, player_address: ContractAddress) -> u64 {
        self.player_system_client().get_gems(player_address)
    }

    // -------------------------------
    // Wave operations
    // -------------------------------
    #[inline]
    fn read_wave(self: @Store, wave_id: u64) -> Wave {
        let wave: Wave = self.world.read_model(wave_id);
        assert(wave.is_non_zero(), 'Wave not found');
        wave
    }

    #[inline]
    fn write_wave(ref self: Store, wave: @Wave) {
        self.world.write_model(wave);
        // self.emit(Event::WaveStored { wave_id: *wave.id });
    }

    #[inline]
    fn start_wave(ref self: Store, wave_id: u64, current_tick: u64) {
        let mut wave = self.read_wave(wave_id);
        assert(wave.is_active == false, WaveErrors::AlreadyActive);
        assert(wave.is_completed == false, WaveErrors::AlreadyCompleted);
        let started_wave = WaveImpl::start(@wave, current_tick);
        self.write_wave(@started_wave)
    }

    #[inline]
    fn register_enemy_spawn(ref self: Store, wave_id: u64, current_tick: u64) {
        let wave = self.read_wave(wave_id);
        assert(WaveImpl::should_spawn(@wave, current_tick) == true, WaveErrors::InvalidSpawnTick);
        let spawned_wave = WaveImpl::register_spawn(@wave, current_tick);
        self.write_wave(@spawned_wave)
    }

    #[inline]
    fn complete_wave(ref self: Store, wave_id: u64) {
        let mut wave = self.read_wave(wave_id);
        assert(wave.is_active == true, WaveErrors::NotActive);
        let completed_wave = WaveImpl::complete(@wave);
        self.write_wave(@completed_wave)
    }

    //@ryzen-xp
    #[inline]
    fn is_wave_completed(ref self: Store, wave_id: u64) -> bool {
        let mut wave = self.read_wave(wave_id);
        WaveImpl::is_wave_completed(@wave)
    }

    // -------------------------------
    // Enemy operations
    // -------------------------------
    #[inline]
    fn read_enemy(self: @Store, enemy_id: u64) -> Enemy {
        let enemy: Enemy = self.world.read_model(enemy_id);
        assert(enemy.is_non_zero(), 'Enemy id not found');
        enemy
    }

    #[inline]
    fn write_enemy(ref self: Store, enemy: @Enemy) {
        self.world.write_model(enemy);
    }

    #[inline]
    fn spawn_enemy(ref self: Store, enemy: Enemy) {
        assert(enemy.is_zero() == false, 'Enemy is not initialized');
        self.write_enemy(@enemy)
    }

    #[inline]
    fn update_enemy_health(ref self: Store, enemy_id: u64, damage: u32) {
        let enemy: Enemy = self.read_enemy(enemy_id);
        assert(enemy.is_alive == true, 'Enemy is dead');
        let damaged_enemy = EnemyImpl::take_damage(@enemy, damage);
        self.write_enemy(@damaged_enemy);
    }

    #[inline]
    fn move_enemy(ref self: Store, enemy_id: u64, x: u32, y: u32) {
        let enemy: Enemy = self.read_enemy(enemy_id);
        assert(enemy.is_alive == true, 'Enemy is dead');
        let moved_enemy = EnemyImpl::move_to(@enemy, x, y);
        self.write_enemy(@moved_enemy);
    }

    //@ryzen-xp
    #[inline]
    fn damage_enemy(ref self: Store, enemy_id: u64, amount: u32) -> (bool, u32, u32) {
        let enemy: Enemy = self.read_enemy(enemy_id);
        assert(enemy.is_alive == true, 'Enemy is dead');
        let damaged_enemy = EnemyImpl::take_damage(@enemy, amount);
        self.write_enemy(@damaged_enemy);

        if !damaged_enemy.is_alive {
            (true, damaged_enemy.coin_reward, damaged_enemy.xp_reward)
        } else {
            (false, 0, 0)
        }
    }

    // -------------------------------
    // Tower operations
    // -------------------------------
    #[inline]
    fn read_tower(self: @Store, tower_id: u64) -> Tower {
        let tower: Tower = self.world.read_model(tower_id);
        assert(tower.is_non_zero(), 'Tower not found');
        tower
    }

    #[inline]
    fn write_tower(ref self: Store, tower: @Tower) {
        self.world.write_model(tower);
    }

    #[inline]
    fn place_tower(ref self: Store, tower: Tower) {
        assert(tower.is_zero() == false, 'Tower not initialized');
        self.write_tower(@tower)
    }

    #[inline]
    fn upgrade_tower(ref self: Store, tower_id: u64) {
        let tower = self.read_tower(tower_id);
        assert(tower.level < 5, TowerErrors::MaxLevelReached);
        let upgraded_tower = TowerImpl::upgrade(@tower);
        self.write_tower(@upgraded_tower)
    }

    #[inline]
    fn can_tower_attack(self: @Store, tower_id: u64, current_tick: u64, cooldown: u64) -> bool {
        let tower = self.read_tower(tower_id);
        assert(tower.is_zero() == false, 'Tower not initialized');
        TowerImpl::can_attack(@tower, current_tick, cooldown)
    }

    // -------------------------------
    // Trap operations
    // -------------------------------
    #[inline]
    fn read_trap(self: @Store, trap_id: u32) -> Trap {
        let trap: Trap = self.world.read_model(trap_id);
        assert(trap.is_non_zero(), 'Trap not found');
        trap
    }

    #[inline]
    fn write_trap(ref self: Store, trap: @Trap) {
        self.world.write_model(trap);
    }

    #[inline]
    fn place_trap(ref self: Store, trap: Trap) {
        assert(trap.is_zero() == false, 'Trap not initialized');
        self.write_trap(@trap)
    }

    #[inline]
    fn trigger_trap(ref self: Store, trap_id: u32, enemy_pos: Vec2) -> u16 {
        let mut trap = self.read_trap(trap_id);
        assert(trap.is_active == true, 'Trap not active');
        assert(TrapImpl::check_trigger(@trap, enemy_pos) == true, 'Enemy not in range');
        let damage = TrapImpl::trigger(ref trap);
        self.write_trap(@trap);
        damage
    }

    #[inline]
    fn deactivate_trap(ref self: Store, trap_id: u32) {
        let mut trap = self.read_trap(trap_id);
        TrapImpl::deactivate(ref trap);
        self.write_trap(@trap)
    }

    #[inline]
    fn reactivate_trap(ref self: Store, trap_id: u32) {
        let mut trap = self.read_trap(trap_id);
        TrapImpl::activate(ref trap);
        self.write_trap(@trap)
    }

    // -------------------------------
    // Leaderboard operations
    // -------------------------------
    #[inline]
    fn read_leaderboard_entry(self: @Store, player_id: ContractAddress) -> LeaderboardEntry {
        let entry: LeaderboardEntry = self.world.read_model(player_id);
        // Note: Unlike other entities, we allow reading zero stats for upsert logic
        entry
    }

    #[inline]
    fn write_leaderboard_entry(ref self: Store, entry: @LeaderboardEntry) {
        self.world.write_model(entry);
    }

    #[inline]
    fn update_leaderboard(ref self: Store, player_id: ContractAddress, kills: u32, deaths: u32) {
        let mut entry = self.read_leaderboard_entry(player_id);

        if entry.is_zero() {
            entry = LeaderboardEntry { player_id, kills: 0, deaths: 0 };
        }

        if kills > 0 {
            entry.increment_kills(kills);
        }
        if deaths > 0 {
            entry.increment_deaths(deaths);
        }

        self.write_leaderboard_entry(@entry);
    }

    // -------------------------------
    // Statistics operations
    // -------------------------------
    #[inline]
    fn read_statistics(self: @Store, player_id: felt252) -> Statistics {
        let stats: Statistics = self.world.read_model(player_id);
        // Note: Unlike other entities, we allow reading zero stats for upsert logic
        stats
    }

    #[inline]
    fn write_statistics(ref self: Store, stats: @Statistics) {
        self.world.write_model(stats);
    }

    #[inline]
    fn increment_match_result(ref self: Store, player_id: felt252, won: bool) {
        let existing_stats = self.read_statistics(player_id);

        let mut updated_stats = if existing_stats.is_zero() {
            // Create Statistics if none exists
            Statistics { player_id, matches_played: 0, wins: 0, defeats: 0 }
        } else {
            existing_stats
        };

        // Increment matches_played always
        StatisticsImpl::increment_matches_played(ref updated_stats);

        // Increment wins if won == true, otherwise increment defeats
        if won {
            StatisticsImpl::increment_wins(ref updated_stats);
        } else {
            StatisticsImpl::increment_defeats(ref updated_stats);
        }

        // Persist updated stats
        self.write_statistics(@updated_stats);
    }

    #[inline]
    fn distribute_rewards(
        ref self: Store,
        player_system_contract_address: ContractAddress,
        enemy_id: u64,
        player_address: ContractAddress,
    ) {
        let mut enemy = self.read_enemy(enemy_id);

        assert(!enemy.is_alive, 'Enemy must be defeated');
        assert(!enemy.reward_claimed, 'Reward already claimed');

        // Update persistent XP in the Player model
        let mut player = self.read_player(player_address.into());
        player.add_xp(enemy.xp_reward);
        self.write_player(@player);

        // Call the PlayerSystem to add coins to its internal storage
        let player_system = IPlayerSystemDispatcher {
            contract_address: player_system_contract_address,
        };
        player_system.add_coins(player_address, enemy.coin_reward.into());

        // Mark the reward as claimed and save enemy state
        enemy.reward_claimed = true;
        self.write_enemy(@enemy);
    }
}
