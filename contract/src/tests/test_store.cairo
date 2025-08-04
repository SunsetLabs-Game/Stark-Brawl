mod tests {
    use dojo_cairo_test::{
        ContractDef, ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait,
        spawn_test_world,
    };
    use dojo::world::{WorldStorage};

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

    // System imports
    use stark_brawl::systems::game::{brawl_game};

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
                TestResource::Contract(brawl_game::TEST_CLASS_HASH),
            ]
                .span(),
        };

        ndef
    }

    pub fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"brawl_game", @"brawl_game")
                .with_writer_of([dojo::utils::bytearray_hash(@"brawl_game")].span()),
        ]
            .span()
    }

    pub fn create_test_world() -> WorldStorage {
        // Initialize test environment
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        world
    }

    fn create_sample_wave() -> Wave {
        WaveImpl::new(1_u64, 1_u32, 3_u32, 100_u32)
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let wave = create_sample_wave();
        store.write_wave(@wave);

        store.start_wave(wave.id, 200_u64);
        store.start_wave(wave.id, 300_u64);
    }

    #[test]
    #[should_panic(expected: ('Wave already completed',))]
    fn test_store_not_start_after_complete_wave() {
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        store.update_enemy_health(1_u64, 100_u32);
        store.move_enemy(1_u64, 30_u32, 50_u32);
    }

    #[test]
    #[should_panic(expected: ('Enemy is dead',))]
    fn test_store_update_dead_enemy() {
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let enemy = create_sample_enemy();
        store.spawn_enemy(enemy);

        store.update_enemy_health(1_u64, 100_u32);
        store.update_enemy_health(1_u64, 10_u32);
    }

    // -------------------------------
    // Tower Management Tests
    // -------------------------------
    #[test]
    fn test_store_place_and_read_tower() {
        let world = create_test_world();
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
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        store.upgrade_tower(1_u64);

        let upgraded_tower = store.read_tower(1_u64);
        assert(upgraded_tower.level == 2_u8, 'Should be level 2');
    }

    #[test]
    fn test_store_upgrade_tower_multiple_times() {
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let tower = create_sample_tower();
        store.place_tower(tower);

        let can_attack = store.can_tower_attack(1_u64, 100_u64, 50_u64);
        assert(can_attack == true, 'Tower should be ready to attack');
    }

    #[test]
    fn test_store_can_tower_attack_cooldown() {
        let world = create_test_world();
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
        let world = create_test_world();
        let store: Store = StoreTrait::new(world);

        let _tower = store.read_tower(0_u64);
    }

    #[test]
    #[should_panic(expected: ('Tower not initialized',))]
    fn test_store_place_zero_tower() {
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let zero_tower = ZeroableTower::zero();
        store.place_tower(zero_tower);
    }

    // -------------------------------
    // Trap Management Tests
    // -------------------------------
    #[test]
    fn test_store_place_and_read_trap() {
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        let enemy_pos = Vec2 { x: 20_u32, y: 25_u32 }; // Outside radius
        let _damage = store.trigger_trap(1_u32, enemy_pos);
    }

    #[test]
    #[should_panic(expected: ('Trap not active',))]
    fn test_store_trigger_inactive_trap() {
        let world = create_test_world();
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
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let trap = create_sample_trap();
        store.place_trap(trap);

        store.deactivate_trap(1_u32);

        let deactivated_trap = store.read_trap(1_u32);
        assert(deactivated_trap.is_active == false, 'Trap should be inactive');
    }

    #[test]
    fn test_store_reactivate_trap() {
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
        let store: Store = StoreTrait::new(world);

        let _trap = store.read_trap(0_u32);
    }

    #[test]
    #[should_panic(expected: ('Trap not initialized',))]
    fn test_store_place_zero_trap() {
        let world = create_test_world();
        let mut store: Store = StoreTrait::new(world);

        let zero_trap = ZeroableTrapTrait::zero();
        store.place_trap(zero_trap);
    }

    #[test]
    fn test_store_different_trap_types() {
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
        let world = create_test_world();
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
}
