mod tests {
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use dojo::world::{WorldStorage};
    use dojo::model::ModelStorage;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::WorldStorageTrait;

    use stark_brawl::models::tower::{Tower, TowerImpl, ZeroableTower};
    use stark_brawl::models::trap::{
        Trap, TrapTrait, TrapType, ZeroableTrapTrait, Vec2, create_trap,
    };
    use stark_brawl::models::wave::{Wave, WaveImpl};
    use stark_brawl::models::enemy::{Enemy, EnemyImpl};
    use stark_brawl::models::statistics::{Statistics, StatisticsImpl, ZeroableStatistics};
    use stark_brawl::models::leaderboard::{
        LeaderboardEntry, ILeaderboardEntry, ZeroableLeaderboardEntry,
    };
    use stark_brawl::store::{Store, StoreTrait};
    use starknet::{ContractAddress, contract_address_const};
    use stark_brawl::models::player::{Player, PlayerImpl, spawn_player, PlayerContract};

    // Systems and Dispatchers
    use stark_brawl::systems::game::{brawl_game, IBrawlGameDispatcher, IBrawlGameDispatcherTrait};
    use stark_brawl::systems::player::{
        player_system, IPlayerSystemDispatcher, IPlayerSystemDispatcherTrait,
    };

    // Model Imports
    use stark_brawl::models::wave::{m_Wave};
    use stark_brawl::models::enemy::{m_Enemy};
    use stark_brawl::models::tower::{m_Tower};
    use stark_brawl::models::tower_stats::{m_TowerStats};
    use stark_brawl::models::trap::{m_Trap};
    use stark_brawl::models::item::{m_Item};
    use stark_brawl::models::inventory::{m_Inventory};
    use stark_brawl::models::player::{m_Player};
    use stark_brawl::models::statistics::{m_Statistics};
    use stark_brawl::models::leaderboard::{m_LeaderboardEntry};
    use stark_brawl::models::player::{m_PlayerContract};

    pub fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "brawl_game",
            resources: [
                TestResource::Model(m_Wave::TEST_CLASS_HASH),
                TestResource::Model(m_Enemy::TEST_CLASS_HASH),
                TestResource::Model(m_Tower::TEST_CLASS_HASH),
                TestResource::Model(m_TowerStats::TEST_CLASS_HASH),
                TestResource::Model(m_Trap::TEST_CLASS_HASH),
                TestResource::Model(m_Item::TEST_CLASS_HASH),
                TestResource::Model(m_Inventory::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_Statistics::TEST_CLASS_HASH),
                TestResource::Model(m_LeaderboardEntry::TEST_CLASS_HASH),
                TestResource::Model(m_PlayerContract::TEST_CLASS_HASH),
                TestResource::Contract(brawl_game::TEST_CLASS_HASH),
                TestResource::Contract(player_system::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    fn create_test_player_system() -> ContractAddress {
        let contract_defs = [
            ContractDefTrait::new(@"brawl_game", @"player_system")
                .with_writer_of([dojo::utils::bytearray_hash(@"brawl_game")].span()),
        ]
            .span();
        let ndef = namespace_def();
        let mut world = spawn_test_world([ndef].span());

        world.sync_perms_and_inits(contract_defs);

        let (contract_address, _) = world.dns(@"player_system").unwrap();

        contract_address
    }

    pub fn contract_defs(player_system_contract_address: ContractAddress) -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"brawl_game", @"brawl_game")
                .with_writer_of([dojo::utils::bytearray_hash(@"brawl_game")].span())
                .with_init_calldata([player_system_contract_address.into()].span()),
        ]
            .span()
    }

    pub fn create_test_world(player_system_contract_address: ContractAddress) -> WorldStorage {
        // Initialize test environment
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs(player_system_contract_address));

        world
    }

    fn create_sample_wave() -> Wave {
        WaveImpl::new(1_u64, 1_u32, 3_u32, 100_u32)
    }

    fn create_sample_player() -> Player {
        spawn_player(contract_address_const::<0x12345678>())
    }

    fn create_sample_enemy() -> Enemy {
        EnemyImpl::new(1_u64, 'goblin', 100_u32, 5_u32, 10_u32, 20_u32, 10_u32, 50_u32)
    }

    fn create_sample_tower() -> Tower {
        TowerImpl::new(1_u64, contract_address_const::<0x123>(), 'cannon', 5_u32, 5_u32)
    }

    fn create_sample_trap() -> Trap {
        create_trap(
            1_u32,
            contract_address_const::<0x123>(),
            10_u32,
            15_u32,
            3_u32,
            50_u16,
            TrapType::Explosive,
        )
    }

    fn create_sample_leaderboard_entry() -> LeaderboardEntry {
        LeaderboardEntry {
            player_id: contract_address_const::<0x123>(), kills: 10_u32, deaths: 2_u32,
        }
    }

    fn create_sample_statistics() -> Statistics {
        Statistics { player_id: 'player1', matches_played: 5_u8, wins: 3_u8, defeats: 2_u8 }
    }

    #[test]
    fn test_store_write_read_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        let wave = store.read_wave(1_u64);

        assert(wave.id == 1_u64, 'Invalid id');
        assert(wave.level == 1_u32, 'Invalid level');
        assert(wave.enemy_count == 3_u32, 'Invalid enemy_count');
        assert(wave.tick_interval == 100_u32, 'Invalid tick_interval');
        assert(wave.enemies_spawned == 0, 'Invalid enemies_spawned');
        assert(wave.last_spawn_tick == 0, 'Invalid last_spawn_tick');
        assert(wave.is_active == false, 'Invalid is_active');
        assert(wave.is_completed == false, 'Invalid is_completed');
    }

    #[test]
    fn test_store_start_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        let wave = store.read_wave(1_u64);
        let new_tick = 200_u64;

        store.start_wave(wave.id, new_tick);
        let active_wave = store.read_wave(wave.id);

        assert(active_wave.is_active == true, 'Should be active');
        assert(active_wave.last_spawn_tick == 200_u64, 'Incorrect last spawn tick');
    }

    #[test]
    fn test_store_register_spawn() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.register_enemy_spawn(wave.id, 300_u64);

        let updated_wave = store.read_wave(wave.id);

        assert(updated_wave.enemies_spawned == 1_u32, 'Should have 1 spawned');
        assert(updated_wave.last_spawn_tick == 300_u64, 'Should update last spawn tick');
    }

    #[test]
    fn test_store_complete_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.complete_wave(wave.id);

        let completed_wave = store.read_wave(wave.id);

        assert(completed_wave.is_active == false, 'Should not be active');
        assert(completed_wave.is_completed == true, 'Should be completed');
    }

    #[test]
    #[should_panic(expected: ('Wave already active',))]
    fn test_store_already_started() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.start_wave(wave.id, 300_u64);
    }

    #[test]
    #[should_panic(expected: ('Wave already completed',))]
    fn test_store_not_start_after_complete_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.complete_wave(wave.id);

        let _completed_wave = store.read_wave(wave.id);

        store.start_wave(wave.id, 300_u64);
    }

    #[test]
    #[should_panic(expected: ('Invalid spawn tick',))]
    fn test_store_not_register_spawn_after_complete_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.complete_wave(wave.id);

        let _completed_wave = store.read_wave(wave.id);

        store.register_enemy_spawn(wave.id, 300_u64);
    }

    #[test]
    #[should_panic(expected: ('Invalid spawn tick',))]
    fn test_store_register_spawn_beyond_count() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.register_enemy_spawn(wave.id, 300_u64);
        store.register_enemy_spawn(wave.id, 400_u64);
        store.register_enemy_spawn(wave.id, 500_u64);
        store.register_enemy_spawn(wave.id, 700_u64);

        let _updated_wave = store.read_wave(wave.id);
    }

    #[test]
    fn test_store_spawn_enemy() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        let enemy = store.read_enemy(1_u64);

        assert(enemy.id == 1_u64, 'Invalid id');
        assert(enemy.enemy_type == 'goblin', 'Invalid enemy_type');
        assert(enemy.health == 100_u32, 'Invalid health');
        assert(enemy.speed == 5_u32, 'Invalid speed');
        assert(enemy.x == 10_u32, 'Invalid x');
        assert(enemy.y == 20_u32, 'Invalid y');
        assert(enemy.is_alive == true, 'Invalid enemy');
        assert(enemy.coin_reward == 10_u32, 'Invalid coin_reward');
        assert(enemy.xp_reward == 50_u32, 'Invalid xp_reward');
    }

    #[test]
    fn test_store_update_enemy_health() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        store.update_enemy_health(1_u64, 20_u32);

        let enemy = store.read_enemy(1_u64);

        assert(enemy.id == 1_u64, 'Invalid id');
        assert(enemy.enemy_type == 'goblin', 'Invalid enemy_type');
        assert(enemy.health == 80_u32, 'Invalid health');
        assert(enemy.speed == 5_u32, 'Invalid speed');
        assert(enemy.x == 10_u32, 'Invalid x');
        assert(enemy.y == 20_u32, 'Invalid y');
        assert(enemy.is_alive == true, 'Invalid enemy');
        assert(enemy.coin_reward == 10_u32, 'Invalid coin_reward');
        assert(enemy.xp_reward == 50_u32, 'Invalid xp_reward');
    }

    #[test]
    fn test_store_move_enemy() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        store.move_enemy(1_u64, 30_u32, 50_u32);

        let enemy = store.read_enemy(1_u64);

        assert(enemy.id == 1_u64, 'Invalid id');
        assert(enemy.enemy_type == 'goblin', 'Invalid enemy_type');
        assert(enemy.health == 100_u32, 'Invalid health');
        assert(enemy.speed == 5_u32, 'Invalid speed');
        assert(enemy.x == 30_u32, 'Invalid x');
        assert(enemy.y == 50_u32, 'Invalid y');
        assert(enemy.is_alive == true, 'Invalid enemy');
        assert(enemy.coin_reward == 10_u32, 'Invalid coin_reward');
        assert(enemy.xp_reward == 50_u32, 'Invalid xp_reward');
    }

    #[test]
    #[should_panic(expected: ('Enemy is dead',))]
    fn test_store_move_dead_enemy() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        store.update_enemy_health(1_u64, 100_u32);
        store.move_enemy(1_u64, 30_u32, 50_u32);
    }

    #[test]
    #[should_panic(expected: ('Enemy is dead',))]
    fn test_store_update_dead_enemy() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        store.update_enemy_health(1_u64, 100_u32);
        store.update_enemy_health(1_u64, 10_u32);
    }

    #[test]
    fn test_damage_enemy_death_detection() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        // Damage enemy less than health
        let (is_dead, coins, xp) = store.damage_enemy(enemy.id, 50);
        assert!(!is_dead, "Enemy alive");
        assert_eq!(coins, 0, "Coins 0 if alive");
        assert_eq!(xp, 0, "XP 0 if alive");

        // Damage enemy to death
        let (is_dead, coins, xp) = store.damage_enemy(enemy.id, 50);
        assert!(is_dead, "Enemy dead");
        assert_eq!(coins, enemy.coin_reward, "Coins reward");
        assert_eq!(xp, enemy.xp_reward, "XP reward");
    }

    #[test]
    #[should_panic(expected: 'Enemy is dead')]
    fn test_damage_enemy_overkill_panics() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);
        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        // Kill enemy
        store.damage_enemy(enemy.id, enemy.health);

        store.damage_enemy(enemy.id, 10);
    }

    #[test]
    fn test_damage_enemy_accumulative_damage_kill() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);
        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        let (is_dead_first, _, _) = store.damage_enemy(enemy.id, 30);
        assert!(!is_dead_first, "Alive after first damage");

        let (is_dead_second, coins, xp) = store.damage_enemy(enemy.id, 70);
        assert!(is_dead_second, "Dead after cumulative damage");
        assert_eq!(coins, enemy.coin_reward, "Coins reward");
        assert_eq!(xp, enemy.xp_reward, "XP reward");
    }


    // -------------------------------
    // Tower Management Tests
    // -------------------------------
    #[test]
    fn test_store_place_and_read_tower() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        let stored_tower = store.read_tower(1_u64);

        assert(stored_tower.id == 1_u64, 'Invalid tower id');
        assert(stored_tower.owner == contract_address_const::<0x123>(), 'Invalid owner');
        assert(stored_tower.tower_type == 'cannon', 'Invalid tower type');
        assert(stored_tower.level == 1_u8, 'Invalid level');
        assert(stored_tower.x == 5_u32, 'Invalid x position');
        assert(stored_tower.y == 5_u32, 'Invalid y position');
        assert(stored_tower.last_attack_tick == 0_u64, 'Invalid last attack tick');
    }

    #[test]
    fn test_store_upgrade_tower() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        store.upgrade_tower(1_u64);

        let upgraded_tower = store.read_tower(1_u64);
        assert(upgraded_tower.level == 2_u8, 'Should be level 2');
    }

    #[test]
    fn test_store_upgrade_tower_multiple_times() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        store.upgrade_tower(1_u64);
        store.upgrade_tower(1_u64);
        store.upgrade_tower(1_u64);

        let upgraded_tower = store.read_tower(1_u64);
        assert(upgraded_tower.level == 4_u8, 'Should be level 4');
    }

    #[test]
    #[should_panic(expected: ('MaxLevelReached',))]
    fn test_store_upgrade_tower_past_max_level() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        // Upgrade to level 5 (max level)
        store.upgrade_tower(1_u64);
        store.upgrade_tower(1_u64);
        store.upgrade_tower(1_u64);
        store.upgrade_tower(1_u64);

        // This should panic
        store.upgrade_tower(1_u64);
    }

    #[test]
    fn test_store_can_tower_attack_ready() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        let can_attack = store.can_tower_attack(1_u64, 100_u64, 50_u64);
        assert(can_attack == true, 'Tower should be ready to attack');
    }

    #[test]
    fn test_store_can_tower_attack_cooldown() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Create tower with last_attack_tick = 90
        let mut tower = create_sample_tower();
        tower.last_attack_tick = 90_u64;
        store.write_tower(@tower);

        // Current tick = 100, cooldown = 50, so 100 - 90 = 10 < 50
        let can_attack = store.can_tower_attack(1_u64, 100_u64, 50_u64);
        assert(can_attack == false, 'Tower should be in cooldown');
    }

    #[test]
    #[should_panic(expected: ('Tower not found',))]
    fn test_store_read_zero_tower() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let store: Store = StoreTrait::new(world);

        let _tower = store.read_tower(0_u64);
    }

    #[test]
    #[should_panic(expected: ('Tower not initialized',))]
    fn test_store_place_zero_tower() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let zero_tower = ZeroableTower::zero();
        store.place_tower(zero_tower);
    }

    // -------------------------------
    // Trap Management Tests
    // -------------------------------
    #[test]
    fn test_store_place_and_read_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        let stored_trap = store.read_trap(1_u32);

        assert(stored_trap.trap_id == 1_u32, 'Invalid trap id');
        assert(stored_trap.owner == contract_address_const::<0x123>(), 'Invalid owner');
        assert(stored_trap.position.x == 10_u32, 'Invalid x position');
        assert(stored_trap.position.y == 15_u32, 'Invalid y position');
        assert(stored_trap.trigger_radius == 3_u32, 'Invalid trigger radius');
        assert(stored_trap.damage == 50_u16, 'Invalid damage');
        assert(stored_trap.is_active == true, 'Trap should be active');
    }

    #[test]
    fn test_store_trigger_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        let enemy_pos = Vec2 { x: 12_u32, y: 16_u32 }; // Within radius
        let damage = store.trigger_trap(1_u32, enemy_pos);

        assert(damage == 50_u16, 'Should deal 50 damage');

        let triggered_trap = store.read_trap(1_u32);
        assert(triggered_trap.is_active == false, 'Trap should be consumed');
    }

    #[test]
    #[should_panic(expected: ('Enemy not in range',))]
    fn test_store_trigger_trap_out_of_range() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        let enemy_pos = Vec2 { x: 20_u32, y: 25_u32 }; // Outside radius
        let _damage = store.trigger_trap(1_u32, enemy_pos);
    }

    #[test]
    #[should_panic(expected: ('Trap not active',))]
    fn test_store_trigger_inactive_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        // Deactivate the trap first
        store.deactivate_trap(1_u32);

        let enemy_pos = Vec2 { x: 12_u32, y: 16_u32 };
        let _damage = store.trigger_trap(1_u32, enemy_pos);
    }

    #[test]
    fn test_store_deactivate_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        store.deactivate_trap(1_u32);

        let deactivated_trap = store.read_trap(1_u32);
        assert(deactivated_trap.is_active == false, 'Trap should be inactive');
    }

    #[test]
    fn test_store_reactivate_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        store.deactivate_trap(1_u32);
        store.reactivate_trap(1_u32);

        let reactivated_trap = store.read_trap(1_u32);
        assert(reactivated_trap.is_active == true, 'Trap should be active again');
    }

    #[test]
    fn test_store_trap_activation_cycle() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        // Test trigger when active
        let enemy_pos = Vec2 { x: 12_u32, y: 16_u32 };
        assert(store.read_trap(1_u32).is_active == true, 'Should start active');

        // Deactivate and try to trigger
        store.deactivate_trap(1_u32);
        assert(store.read_trap(1_u32).is_active == false, 'Should be inactive');

        // Reactivate and verify it works again
        store.reactivate_trap(1_u32);
        assert(store.read_trap(1_u32).is_active == true, 'Should be active again');

        let damage = store.trigger_trap(1_u32, enemy_pos);
        assert(damage == 50_u16, 'Should damage after reactivate');
    }

    #[test]
    #[should_panic(expected: ('Trap not found',))]
    fn test_store_read_zero_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let store: Store = StoreTrait::new(world);

        let _trap = store.read_trap(0_u32);
    }

    #[test]
    #[should_panic(expected: ('Trap not initialized',))]
    fn test_store_place_zero_trap() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let zero_trap = ZeroableTrapTrait::zero();
        store.place_trap(zero_trap);
    }

    #[test]
    fn test_store_different_trap_types() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let explosive_trap = create_trap(
            1_u32,
            contract_address_const::<0x123>(),
            0_u32,
            0_u32,
            3_u32,
            80_u16,
            TrapType::Explosive,
        );
        let poison_trap = create_trap(
            2_u32,
            contract_address_const::<0x123>(),
            10_u32,
            10_u32,
            2_u32,
            20_u16,
            TrapType::Poison,
        );

        store.place_trap(explosive_trap);
        store.place_trap(poison_trap);

        let stored_explosive = store.read_trap(1_u32);
        let stored_poison = store.read_trap(2_u32);

        assert(stored_explosive.damage == 80_u16, 'Explosive damage incorrect');
        assert(stored_poison.damage == 20_u16, 'Poison damage incorrect');
        assert(stored_explosive.trap_type == TrapType::Explosive, 'Wrong explosive type');
        assert(stored_poison.trap_type == TrapType::Poison, 'Wrong poison type');
    }

    // -------------------------------
    // Leaderboard Management Tests
    // -------------------------------
    #[test]
    fn test_store_write_read_leaderboard_entry() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let entry = create_sample_leaderboard_entry();
        store.write_leaderboard_entry(@entry);

        let stored_entry = store.read_leaderboard_entry(contract_address_const::<0x123>());

        assert(stored_entry.player_id == contract_address_const::<0x123>(), 'Invalid player_id');
        assert(stored_entry.kills == 10_u32, 'Invalid kills');
        assert(stored_entry.deaths == 2_u32, 'Invalid deaths');
    }

    #[test]
    fn test_store_update_leaderboard_new_entry() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = contract_address_const::<0x456>();

        // Should create new entry if none exists
        store.update_leaderboard(player_id, 5_u32, 1_u32);

        let entry = store.read_leaderboard_entry(player_id);
        assert(entry.player_id == player_id, 'Should create new entry');
        assert(entry.kills == 5_u32, 'Should have 5 kills');
        assert(entry.deaths == 1_u32, 'Should have 1 death');
    }

    #[test]
    fn test_store_update_leaderboard_existing_entry() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = contract_address_const::<0x123>();
        let initial_entry = create_sample_leaderboard_entry();
        store.write_leaderboard_entry(@initial_entry);

        // Should increment existing kills and deaths
        store.update_leaderboard(player_id, 3_u32, 1_u32);

        let updated_entry = store.read_leaderboard_entry(player_id);
        assert(updated_entry.kills == 13_u32, 'Should have 13 kills total');
        assert(updated_entry.deaths == 3_u32, 'Should have 3 deaths total');
    }

    #[test]
    fn test_store_update_leaderboard_multiple_updates() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = contract_address_const::<0x789>();

        // Multiple updates to same player
        store.update_leaderboard(player_id, 10_u32, 2_u32);
        store.update_leaderboard(player_id, 5_u32, 1_u32);
        store.update_leaderboard(player_id, 2_u32, 0_u32);

        let final_entry = store.read_leaderboard_entry(player_id);
        assert(final_entry.kills == 17_u32, 'Should have 17 total kills');
        assert(final_entry.deaths == 3_u32, 'Should have 3 total deaths');
    }


    #[test]
    fn test_store_read_nonexistent_leaderboard_entry() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let store: Store = StoreTrait::new(world);

        let player_id = contract_address_const::<0x000>();
        let entry = store.read_leaderboard_entry(player_id);

        // Should return zero entry for non-existent players
        assert(entry.is_zero(), 'Should be zero entry');
        assert(entry.kills == 0_u32, 'Should have 0 kills');
        assert(entry.deaths == 0_u32, 'Should have 0 deaths');
    }

    // -------------------------------
    // Statistics Management Tests
    // -------------------------------
    #[test]
    fn test_store_write_read_statistics() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let stats = create_sample_statistics();
        store.write_statistics(@stats);

        let stored_stats = store.read_statistics('player1');

        assert(stored_stats.player_id == 'player1', 'Invalid player_id');
        assert(stored_stats.matches_played == 5_u8, 'Invalid matches_played');
        assert(stored_stats.wins == 3_u8, 'Invalid wins');
        assert(stored_stats.defeats == 2_u8, 'Invalid defeats');
        assert(stored_stats.is_non_zero(), 'Stats should be non-zero');
    }

    #[test]
    fn test_store_increment_match_result_new_player_win() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = 'newplayer1';

        // Should create new stats if none exist
        store.increment_match_result(player_id, true);

        let stats = store.read_statistics(player_id);
        assert(stats.player_id == player_id, 'Should create new stats');
        assert(stats.matches_played == 1_u8, 'Should have 1 match played');
        assert(stats.wins == 1_u8, 'Should have 1 win');
        assert(stats.defeats == 0_u8, 'Should have 0 defeats');
        assert(stats.is_non_zero(), 'New stats should be non-zero');
    }

    #[test]
    fn test_store_increment_match_result_new_player_defeat() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = 'newplayer2';

        // Should create new stats for defeat
        store.increment_match_result(player_id, false);

        let stats = store.read_statistics(player_id);
        assert(stats.player_id == player_id, 'Should create new stats');
        assert(stats.matches_played == 1_u8, 'Should have 1 match played');
        assert(stats.wins == 0_u8, 'Should have 0 wins');
        assert(stats.defeats == 1_u8, 'Should have 1 defeat');
        assert(stats.is_non_zero(), 'New stats should be non-zero');
    }

    #[test]
    fn test_store_increment_match_result_existing_player() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = 'player1';
        let initial_stats = create_sample_statistics();
        store.write_statistics(@initial_stats);

        // Increment with a win
        store.increment_match_result(player_id, true);

        let updated_stats = store.read_statistics(player_id);
        assert(updated_stats.matches_played == 6_u8, 'Should have 6 matches played');
        assert(updated_stats.wins == 4_u8, 'Should have 4 wins');
        assert(updated_stats.defeats == 2_u8, 'Should still have 2 defeats');
    }

    #[test]
    fn test_store_increment_match_result_multiple_results() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = 'player3';

        // Multiple match results
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, false); // Defeat
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, false); // Defeat

        let final_stats = store.read_statistics(player_id);
        assert(final_stats.matches_played == 5_u8, 'Should have 5 matches played');
        assert(final_stats.wins == 3_u8, 'Should have 3 wins');
        assert(final_stats.defeats == 2_u8, 'Should have 2 defeats');
    }

    #[test]
    fn test_store_increment_match_result_win_rate_calculation() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = 'player4';

        // Create scenario for 75% win rate (3 wins out of 4 matches)
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, false); // Defeat

        let stats = store.read_statistics(player_id);
        let win_rate = StatisticsImpl::get_win_rate(@stats);
        assert(win_rate == 75, 'Win rate should be 75%');
    }

    #[test]
    fn test_store_increment_match_result_alternating_results() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        let player_id = 'player5';

        // Alternating wins and defeats
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, false); // Defeat
        store.increment_match_result(player_id, true); // Win
        store.increment_match_result(player_id, false); // Defeat

        let stats = store.read_statistics(player_id);
        assert(stats.matches_played == 4_u8, 'Should have 4 matches played');
        assert(stats.wins == 2_u8, 'Should have 2 wins');
        assert(stats.defeats == 2_u8, 'Should have 2 defeats');

        let win_rate = StatisticsImpl::get_win_rate(@stats);
        assert(win_rate == 50, 'Win rate should be 50%');
    }

    #[test]
    fn test_store_read_nonexistent_statistics() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let store: Store = StoreTrait::new(world);

        let player_id = 'nonexistent';
        let stats = store.read_statistics(player_id);

        // Should return zero stats for non-existent players
        assert(stats.is_zero(), 'Should be zero stats');
        assert(stats.matches_played == 0_u8, 'Should have 0 matches');
        assert(stats.wins == 0_u8, 'Should have 0 wins');
        assert(stats.defeats == 0_u8, 'Should have 0 defeats');
    }

    #[test]
    fn test_store_statistics_different_players() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Test multiple different players
        store.increment_match_result('playerA', true);
        store.increment_match_result('playerB', false);
        store.increment_match_result('playerA', true);
        store.increment_match_result('playerC', true);

        let statsA = store.read_statistics('playerA');
        let statsB = store.read_statistics('playerB');
        let statsC = store.read_statistics('playerC');

        assert(statsA.matches_played == 2_u8, 'Player A: 2 matches');
        assert(statsA.wins == 2_u8, 'Player A: 2 wins');
        assert(statsA.defeats == 0_u8, 'Player A: 0 defeat');
        assert(statsB.matches_played == 1_u8, 'Player B: 1 match');
        assert(statsB.wins == 0_u8, 'Player B: 0 wins');
        assert(statsB.defeats == 1_u8, 'Player B: 1 defeat');
        assert(statsC.matches_played == 1_u8, 'Player C: 1 match');
        assert(statsC.wins == 1_u8, 'Player C: 1 win');
    }

    // -------------------------------
    // Reward Distribution Tests
    // -------------------------------

    #[test]
    fn test_distribute_rewards_success() {
        let player_system_contract_address = create_test_player_system();
        let player_system_dispatcher = IPlayerSystemDispatcher {
            contract_address: player_system_contract_address,
        };
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Setup: Create a player and a defeated enemy
        let mut player = create_sample_player();
        let initial_coins = player_system_dispatcher.get_coins(player.address);
        let initial_xp = player.xp;
        // store.write_player(@player);

        let mut enemy = create_sample_enemy();
        enemy.is_alive = false; // Manually set as defeated
        store.write_enemy(@enemy);

        // Action: Distribute the rewards
        store.distribute_rewards(player_system_contract_address, enemy.id, player.address);

        // Assertions
        let updated_player = store.read_player(player.address.into());
        assert(
            player_system_dispatcher.get_coins(player.address) == initial_coins
                + enemy.coin_reward.into(),
            'Player coins incorrect',
        );
        assert(updated_player.xp == initial_xp + enemy.xp_reward, 'Player XP incorrect');

        let updated_enemy = store.read_enemy(enemy.id);
        assert(updated_enemy.reward_claimed == true, 'Reward should be claimed');
    }

    #[test]
    #[should_panic(expected: ('Enemy must be defeated',))]
    fn test_distribute_rewards_panics_if_enemy_alive() {
        let player_system_contract_address = create_test_player_system();
        let player_system_dispatcher = IPlayerSystemDispatcher {
            contract_address: player_system_contract_address,
        };
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Setup: Player and an ALIVE enemy
        let player = create_sample_player();
        store.write_player(@player);

        let enemy = create_sample_enemy(); // is_alive is true by default
        store.write_enemy(@enemy);

        // Action: Attempt to distribute rewards for a live enemy (should panic)
        store.distribute_rewards(player_system_contract_address, enemy.id, player.address);
    }

    #[test]
    #[should_panic(expected: ('Reward already claimed',))]
    fn test_distribute_rewards_panics_if_already_claimed() {
        let player_system_contract_address = create_test_player_system();
        let player_system_dispatcher = IPlayerSystemDispatcher {
            contract_address: player_system_contract_address,
        };
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Setup
        let player = create_sample_player();
        store.write_player(@player);
        let mut enemy = create_sample_enemy();
        enemy.is_alive = false;
        store.write_enemy(@enemy);

        // Action: Distribute rewards once (this should succeed)
        store.distribute_rewards(player_system_contract_address, enemy.id, player.address);

        // Action 2: Attempt to distribute again (this should panic)
        store.distribute_rewards(player_system_contract_address, enemy.id, player.address);
    }

    #[test]
    fn test_distribute_rewards_zero_initial_player_stats() {
        let player_system_contract_address = create_test_player_system();
        let player_system_dispatcher = IPlayerSystemDispatcher {
            contract_address: player_system_contract_address,
        };
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Setup: Player with zero coins and XP
        let mut player = create_sample_player();
        // player.coins = 0;
        player.xp = 0;
        store.write_player(@player);

        let mut enemy = create_sample_enemy();
        enemy.is_alive = false;
        store.write_enemy(@enemy);

        // Action
        store.distribute_rewards(player_system_contract_address, enemy.id, player.address);

        // Assertions
        let updated_player = store.read_player(player.address.into());
        assert(
            player_system_dispatcher.get_coins(player.address) == enemy.coin_reward.into(),
            'Coins should match reward',
        );
        assert(updated_player.xp == enemy.xp_reward, 'XP should match reward');
    }

    #[test]
    fn test_distribute_rewards_multiple_players_and_enemies() {
        let player_system_contract_address = create_test_player_system();
        let player_system_dispatcher = IPlayerSystemDispatcher {
            contract_address: player_system_contract_address,
        };
        let world = create_test_world(player_system_contract_address);
        let mut store: Store = StoreTrait::new(world);

        // Setup: Two players, two enemies
        let mut player_a = spawn_player(contract_address_const::<0xA>());
        let mut player_b = spawn_player(contract_address_const::<0xB>());
        store.write_player(@player_a);
        store.write_player(@player_b);

        let mut enemy_1 = EnemyImpl::new(1, 'goblin', 50, 5, 0, 0, 10, 20);
        let mut enemy_2 = EnemyImpl::new(2, 'orc', 100, 3, 0, 0, 25, 50);
        enemy_1.is_alive = false;
        enemy_2.is_alive = false;
        store.write_enemy(@enemy_1);
        store.write_enemy(@enemy_2);

        // Action 1: Player A claims reward for Enemy 1
        store.distribute_rewards(player_system_contract_address, enemy_1.id, player_a.address);

        // Assertions for Action 1
        let updated_player_a = store.read_player(player_a.address.into());
        let updated_player_b = store.read_player(player_b.address.into());
        assert(
            player_system_dispatcher.get_coins(player_a.address) == 10, 'Player A coins incorrect',
        );
        assert(updated_player_a.xp == 20, 'Player A XP incorrect');
        assert!(
            player_system_dispatcher.get_coins(player_b.address) == 0,
            "Player B coins should not change",
        );
        assert(updated_player_b.xp == 0, 'Player B XP should not change');

        let updated_enemy_1 = store.read_enemy(enemy_1.id);
        let updated_enemy_2 = store.read_enemy(enemy_2.id);
        assert!(updated_enemy_1.reward_claimed == true, "Enemy 1 reward should be claimed");
        assert!(updated_enemy_2.reward_claimed == false, "Enemy 2 reward should not be claimed");

        // Action 2: Player B claims reward for Enemy 2
        store.distribute_rewards(player_system_contract_address, enemy_2.id, player_b.address);

        // Assertions for Action 2
        let final_player_a = store.read_player(player_a.address.into());
        let final_player_b = store.read_player(player_b.address.into());
        assert!(
            player_system_dispatcher.get_coins(final_player_a.address) == 10,
            "Player A coins should not change again",
        );
        assert(
            player_system_dispatcher.get_coins(final_player_b.address) == 25,
            'Player B coins incorrect',
        );
        assert(final_player_b.xp == 50, 'Player B XP incorrect');

        let final_enemy_2 = store.read_enemy(enemy_2.id);
        assert!(final_enemy_2.reward_claimed == true, "Enemy 2 reward should now be claimed");
    }


    // -------------------------------
    // Waves function Tests
    // -------------------------------

    #[test]
    fn test_read_and_write_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        let read_wave = store.read_wave(wave.id);

        assert_eq!(read_wave.id, wave.id, "Wave ID mismatch");
        assert_eq!(read_wave.level, wave.level, "Wave level mismatch");
        assert_eq!(read_wave.enemy_count, wave.enemy_count, "Enemy count mismatch");
        assert_eq!(read_wave.tick_interval, wave.tick_interval, "Tick interval mismatch");
        assert!(!read_wave.is_active, "Wave should not be active initially");
        assert!(!read_wave.is_completed, "Wave should not be completed initially");
    }

    #[test]
    fn test_start_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);

        let started_wave = store.read_wave(wave.id);

        assert!(started_wave.is_active, "Wave should be active after start");
        assert_eq!(
            started_wave.last_spawn_tick, 200_u64, "Last spawn tick should be set to start tick",
        );
    }

    #[test]
    fn test_register_enemy_spawn() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);
        store.start_wave(wave.id, 200_u64);

        store.register_enemy_spawn(wave.id, 300_u64);

        let updated_wave = store.read_wave(wave.id);

        assert_eq!(updated_wave.enemies_spawned, 1_u32, "Enemies spawned should increment");
        assert_eq!(updated_wave.last_spawn_tick, 300_u64, "Last spawn tick should update");
    }

    #[test]
    fn test_complete_wave() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);
        store.start_wave(wave.id, 200_u64);

        store.complete_wave(wave.id);

        let completed_wave = store.read_wave(wave.id);

        assert!(!completed_wave.is_active, "Wave should not be active after completion");
        assert!(completed_wave.is_completed, "Wave should be completed");
    }

    #[test]
    fn test_is_wave_completed() {
        let player_system_contract_address = create_test_player_system();
        let world = create_test_world(player_system_contract_address);
        let mut store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        // Initially not completed
        assert!(!store.is_wave_completed(wave.id), "Wave should not be marked completed initially");

        store.start_wave(wave.id, 100_u64);
        // Manually mark wave completed for test purposes (or call complete_wave)
        store.complete_wave(wave.id);

        assert!(
            store.is_wave_completed(wave.id), "Wave should be marked completed after completion",
        );
    }

    ///----------Player gems& Coins -----------------

    #[test]
    fn test_store_add_coins_to_player() {
        let player_system_contract_address = create_test_player_system();
        let mut world = create_test_world(player_system_contract_address);
        let player_address = contract_address_const::<0x11111111>();
        let data = PlayerContract {
            id: 'PLAYER_CONTRACT', contract: player_system_contract_address,
        };

        world.write_model(@data);

        let mut store: Store = StoreTrait::new(world);

        let player = spawn_player(player_address);
        store.write_player(@player);

        // Initial coins should be 0
        assert!(store.get_coins(player_address) == 0_u64, "Initial coins should be 0");

        // Add 50 coins
        store.add_coins(player_address, 50_u64);
        assert!(store.get_coins(player_address) == 50_u64, "Player coins not updated after add");

        // Add another 50 coins
        store.add_coins(player_address, 50_u64);
        assert!(
            store.get_coins(player_address) == 100_u64, "Player coins not cumulative after add",
        );
    }

    #[test]
    fn test_store_spend_coins_valid() {
        let player_system_contract_address = create_test_player_system();
        let mut world = create_test_world(player_system_contract_address);
        let player_address = contract_address_const::<0x22222222>();
        let data = PlayerContract {
            id: 'PLAYER_CONTRACT', contract: player_system_contract_address,
        };

        world.write_model(@data);

        let mut store: Store = StoreTrait::new(world);

        let player = spawn_player(player_address);
        store.write_player(@player);

        // Add 100 coins to spend later
        store.add_coins(player_address, 100_u64);

        // Spend exact amount: 100 coins (should leave zero)
        store.spend_coins(player_address, 100_u64);
        assert!(
            store.get_coins(player_address) == 0_u64, "Coins should be zero after spending all",
        );

        // Add coins back for next spend
        store.add_coins(player_address, 50_u64);
        store.spend_coins(player_address, 50_u64);
        assert!(
            store.get_coins(player_address) == 0_u64, "Coins should be zero after spending all",
        );
    }

    #[test]
    #[should_panic]
    fn test_store_spend_coins_overspend_panics() {
        let player_system_contract_address = create_test_player_system();
        let mut world = create_test_world(player_system_contract_address);
        let player_address = contract_address_const::<0x22222222>();
        let data = PlayerContract {
            id: 'PLAYER_CONTRACT', contract: player_system_contract_address,
        };

        world.write_model(@data);

        let mut store: Store = StoreTrait::new(world);

        let player = spawn_player(player_address);
        store.write_player(@player);

        // Add 50 coins
        store.add_coins(player_address, 50_u64);

        // Attempt to spend 60 coins which is more than the balance; should panic
        store.spend_coins(player_address, 60_u64);
    }

    #[test]
    fn test_store_add_gems_to_player() {
        let player_system_contract_address = create_test_player_system();
        let mut world = create_test_world(player_system_contract_address);
        let player_address = contract_address_const::<0x33333333>();
        let data = PlayerContract {
            id: 'PLAYER_CONTRACT', contract: player_system_contract_address,
        };

        world.write_model(@data);

        let mut store: Store = StoreTrait::new(world);

        let player = spawn_player(player_address);
        store.write_player(@player);

        // Initial gems should be 0
        assert!(store.get_gems(player_address) == 0_u64, "Initial gems should be 0");

        // Add 30 gems
        store.add_gems(player_address, 30_u64);
        assert!(store.get_gems(player_address) == 30_u64, "Player gems not updated correctly");

        // Add another 20 gems
        store.add_gems(player_address, 20_u64);
        assert!(store.get_gems(player_address) == 50_u64, "Player gems not cumulative after add");
    }

    #[test]
    fn test_store_spend_gems_valid() {
        let player_system_contract_address = create_test_player_system();
        let mut world = create_test_world(player_system_contract_address);
        let player_address = contract_address_const::<0x44444444>();
        let data = PlayerContract {
            id: 'PLAYER_CONTRACT', contract: player_system_contract_address,
        };

        world.write_model(@data);

        let mut store: Store = StoreTrait::new(world);

        let player = spawn_player(player_address);
        store.write_player(@player);

        // Add 70 gems
        store.add_gems(player_address, 70_u64);

        // Spend exact 70 gems (leave zero)
        store.spend_gems(player_address, 70_u64);
        assert!(store.get_gems(player_address) == 0_u64, "Gems should be zero after spending all");

        // Add gems back for next spend
        store.add_gems(player_address, 40_u64);
        store.spend_gems(player_address, 40_u64);
        assert!(store.get_gems(player_address) == 0_u64, "Gems should be zero after spending all");
    }

    #[test]
    #[should_panic]
    fn test_store_spend_gems_overspend_panics() {
        let player_system_contract_address = create_test_player_system();
        let mut world = create_test_world(player_system_contract_address);
        let player_address = contract_address_const::<0x44444444>();
        let data = PlayerContract {
            id: 'PLAYER_CONTRACT', contract: player_system_contract_address,
        };

        world.write_model(@data);

        let mut store: Store = StoreTrait::new(world);

        let player = spawn_player(player_address);
        store.write_player(@player);

        // Add 40 gems
        store.add_gems(player_address, 40_u64);

        // Attempt to spend 50 gems which is more than the balance; should panic
        store.spend_gems(player_address, 50_u64);
    }
}

