#[cfg(test)]
mod path_system_tests {
    use stark_brawl::systems::game::brawl_game::{PathSystemImpl};
    use stark_brawl::models::enemy::{Enemy, EnemySystem};

    fn sample_enemy() -> Enemy {
        EnemySystem::new(1_u64, 'orc', 100_u32, 5_u32, 0_u32, 0_u32, 10_u32, 50_u32)
    }

    #[test]
    fn test_get_path_step_valid_paths() {
        // Test Path 0 (straight line)
        let (x, y) = PathSystemImpl::get_path_step(0_u64, 0_u32);
        assert!(x == 0_u32 && y == 5_u32, "Path 0 start incorrect");

        let (x, y) = PathSystemImpl::get_path_step(0_u64, 5_u32);
        assert!(x == 5_u32 && y == 5_u32, "Path 0 end incorrect");

        // Test Path 1 (L-shaped)
        let (x, y) = PathSystemImpl::get_path_step(1_u64, 0_u32);
        assert!(x == 0_u32 && y == 0_u32, "Path 1 start incorrect");

        let (x, y) = PathSystemImpl::get_path_step(1_u64, 6_u32);
        assert!(x == 3_u32 && y == 3_u32, "Path 1 end incorrect");

        // Test Path 2 (zigzag)
        let (x, y) = PathSystemImpl::get_path_step(2_u64, 0_u32);
        assert!(x == 0_u32 && y == 2_u32, "Path 2 start incorrect");

        let (x, y) = PathSystemImpl::get_path_step(2_u64, 8_u32);
        assert!(x == 4_u32 && y == 2_u32, "Path 2 end incorrect");
    }

    #[test]
    #[should_panic]
    fn test_get_path_step_invalid_path() {
        let _ = PathSystemImpl::get_path_step(99_u64, 0_u32);
    }

    #[test]
    #[should_panic]
    fn test_get_path_step_index_out_of_bounds() {
        // Path 0 only has indices 0-5, so index 6 should panic
        let _ = PathSystemImpl::get_path_step(0_u64, 6_u32);
    }

    #[test]
    fn test_is_path_completed() {
        // Path 0 has 6 steps (indices 0-5)
        assert!(
            !PathSystemImpl::is_path_completed(0_u64, 0_u32),
            "Path 0 should not be complete at start",
        );
        assert!(
            !PathSystemImpl::is_path_completed(0_u64, 5_u32),
            "Path 0 should not be complete at last step",
        );
        assert!(
            PathSystemImpl::is_path_completed(0_u64, 6_u32),
            "Path 0 should be complete after last step",
        );

        // Path 1 has 7 steps (indices 0-6)
        assert!(
            !PathSystemImpl::is_path_completed(1_u64, 6_u32),
            "Path 1 should not be complete at last step",
        );
        assert!(
            PathSystemImpl::is_path_completed(1_u64, 7_u32),
            "Path 1 should be complete after last step",
        );

        // Path 2 has 9 steps (indices 0-8)
        assert!(
            !PathSystemImpl::is_path_completed(2_u64, 8_u32),
            "Path 2 should not be complete at last step",
        );
        assert!(
            PathSystemImpl::is_path_completed(2_u64, 9_u32),
            "Path 2 should be complete after last step",
        );
    }

    #[test]
    #[should_panic]
    fn test_is_path_completed_invalid_path() {
        let _ = PathSystemImpl::is_path_completed(99_u64, 0_u32);
    }

    #[test]
    fn test_advance_enemy_position_normal_movement() {
        let mut enemy = sample_enemy();

        // Move enemy to start of path 0
        enemy = EnemySystem::move_to(@enemy, 0_u32, 5_u32);

        // Advance to next position (should move from index 0 to index 1)
        let advanced_enemy = PathSystemImpl::advance_enemy_position(ref enemy, 0_u64, 0_u32);

        assert!(advanced_enemy.x == 1_u32, "Enemy x position incorrect");
        assert!(advanced_enemy.y == 5_u32, "Enemy y position incorrect");
        assert!(advanced_enemy.is_alive, "Enemy should still be alive");
    }

    #[test]
    fn test_advance_enemy_position_path_completion() {
        let mut enemy = sample_enemy();

        // Move enemy to the last position of path 0 (index 5)
        enemy = EnemySystem::move_to(@enemy, 5_u32, 5_u32);

        // Try to advance beyond the last step (current_index = 5, next would be 6)
        let result_enemy = PathSystemImpl::advance_enemy_position(ref enemy, 0_u64, 5_u32);

        // Enemy should remain at the same position since path is completed
        assert!(result_enemy.x == 5_u32, "Enemy should stay at final x");
        assert!(result_enemy.y == 5_u32, "Enemy should stay at final y");
    }

    #[test]
    fn test_advance_enemy_position_multiple_steps() {
        let mut enemy = sample_enemy();

        // Start enemy at path 1 beginning (updated from path 2)
        enemy = EnemySystem::move_to(@enemy, 0_u32, 0_u32);

        // Advance through several steps
        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 1_u64, 0_u32); // Move to step 1
        assert!(enemy.x == 0_u32 && enemy.y == 1_u32, "Step 1 incorrect");

        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 1_u64, 1_u32); // Move to step 2  
        assert!(enemy.x == 0_u32 && enemy.y == 2_u32, "Step 2 incorrect");

        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 1_u64, 2_u32); // Move to step 3
        assert!(enemy.x == 0_u32 && enemy.y == 3_u32, "Step 3 incorrect");

        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 1_u64, 3_u32); // Move to step 4
        assert!(enemy.x == 1_u32 && enemy.y == 3_u32, "Step 4 incorrect");
    }

    #[test]
    #[should_panic]
    fn test_advance_dead_enemy_panics() {
        let mut enemy = sample_enemy();

        // Kill the enemy
        enemy = EnemySystem::take_damage(@enemy, 100_u32);
        assert!(!enemy.is_alive, "Enemy should be dead");

        // Try to advance dead enemy
        let _ = PathSystemImpl::advance_enemy_position(ref enemy, 0_u64, 0_u32);
    }

    #[test]
    fn test_zigzag_path_movement() {
        let mut enemy = sample_enemy();

        // Test zigzag path (path 2) movement
        enemy = EnemySystem::move_to(@enemy, 0_u32, 2_u32); // Start position

        // Move through the zigzag pattern
        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 2_u64, 0_u32);
        assert!(enemy.x == 1_u32 && enemy.y == 2_u32, "Zigzag step 1 incorrect");

        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 2_u64, 1_u32);
        assert!(enemy.x == 2_u32 && enemy.y == 2_u32, "Zigzag step 2 incorrect");

        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 2_u64, 2_u32);
        assert!(enemy.x == 2_u32 && enemy.y == 1_u32, "Zigzag step 3 incorrect");

        enemy = PathSystemImpl::advance_enemy_position(ref enemy, 2_u64, 3_u32);
        assert!(enemy.x == 2_u32 && enemy.y == 0_u32, "Zigzag step 4 incorrect");
    }
}
