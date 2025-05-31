#[cfg(test)]
mod tests {
    use dojo_starter::models::trap::{Trap, TrapTrait, TrapType, create_trap, ZeroableTrapTrait};
    use starknet::{ContractAddress, contract_address_const};
    use dojo_starter::models::Vec2;

    fn get_test_owner() -> ContractAddress {
        contract_address_const::<0x12345>()
    }

    #[test]
    fn test_trap_initialization() {
        let owner = get_test_owner();
        let trap = create_trap(1, owner, 5, 10, 2, 30, TrapType::Poison);

        assert(trap.trap_id == 1, 'Trap ID mismatch');
        assert(trap.owner == owner, 'Owner mismatch');
        assert(trap.position.x == 5, 'X position mismatch');
        assert(trap.position.y == 10, 'Y position mismatch');
        assert(trap.trigger_radius == 2, 'Trigger radius mismatch');
        assert(trap.damage == 30, 'Damage mismatch');
        assert(trap.trap_type == TrapType::Poison, 'Trap type mismatch');
        assert(trap.is_active, 'Trap should start active');
    }

    #[test]
    fn test_enemy_triggering_trap_at_exact_position() {
        let owner = get_test_owner();
        let trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        
        // Enemy at same position as trap
        let enemy_pos = Vec2 { x: 10, y: 10 };
        assert(trap.check_trigger(enemy_pos), 'Should trigger at same position');
    }

    #[test]
    fn test_enemy_triggering_trap_within_radius() {
        let owner = get_test_owner();
        let trap = create_trap(2, owner, 15, 20, 4, 40, TrapType::Electric);
        
        // Test multiple positions within radius
        let positions_within_radius = array![
            Vec2 { x: 16, y: 21 }, // Distance = 2
            Vec2 { x: 18, y: 20 }, // Distance = 3
            Vec2 { x: 15, y: 24 }, // Distance = 4
            Vec2 { x: 11, y: 20 }, // Distance = 4
        ];

        let mut i = 0;
        loop {
            if i >= positions_within_radius.len() {
                break;
            }
            let pos = *positions_within_radius.at(i);
            assert(trap.check_trigger(pos), 'Should trigger within radius');
            i += 1;
        };
    }

    #[test]
    fn test_enemy_not_triggering_trap_outside_radius() {
        let owner = get_test_owner();
        let trap = create_trap(3, owner, 10, 10, 2, 35, TrapType::Freezing);
        
        // Test positions outside radius
        let positions_outside_radius = array![
            Vec2 { x: 13, y: 11 }, // Distance = 4
            Vec2 { x: 5, y: 10 },  // Distance = 5
            Vec2 { x: 10, y: 15 }, // Distance = 5
            Vec2 { x: 15, y: 15 }, // Distance = 10
        ];

        let mut i = 0;
        loop {
            if i >= positions_outside_radius.len() {
                break;
            }
            let pos = *positions_outside_radius.at(i);
            assert(!trap.check_trigger(pos), 'Should not trigger outside radius');
            i += 1;
        };
    }

    #[test]
    fn test_enemy_triggering_sequence() {
        let owner = get_test_owner();
        let mut trap = create_trap(4, owner, 8, 12, 3, 60, TrapType::Explosive);
        
        // Enemy approaches the trap
        let enemy_pos = Vec2 { x: 10, y: 12 }; // Distance = 2, within radius
        
        // Check if trap would trigger
        assert(trap.check_trigger(enemy_pos), 'Trap should detect enemy');
        assert(trap.is_active, 'Trap should still be active before trigger');
        
        // Trigger the trap
        let damage_dealt = trap.trigger();
        assert(damage_dealt == 60, 'Should deal full damage');
        assert(!trap.is_active, 'Trap should be inactive after trigger');
        
        // Verify trap won't trigger again
        assert(!trap.check_trigger(enemy_pos), 'Inactive trap should not trigger');
        let second_damage = trap.trigger();
        assert(second_damage == 0, 'Inactive trap should deal no damage');
    }

    #[test]
    fn test_multiple_enemies_single_trap() {
        let owner = get_test_owner();
        let mut trap = create_trap(5, owner, 0, 0, 5, 25, TrapType::Poison);
        
        // First enemy triggers trap
        let enemy1_pos = Vec2 { x: 2, y: 3 }; // Distance = 5, at edge
        assert(trap.check_trigger(enemy1_pos), 'First enemy should trigger');
        
        let damage1 = trap.trigger();
        assert(damage1 == 25, 'Should deal damage to first enemy');
        assert(!trap.is_active, 'Trap consumed after first trigger');
        
        // Second enemy cannot trigger the same trap
        let enemy2_pos = Vec2 { x: 1, y: 1 }; // Distance = 2, well within radius
        assert(!trap.check_trigger(enemy2_pos), 'Second enemy should not trigger consumed trap');
        
        let damage2 = trap.trigger();
        assert(damage2 == 0, 'Should deal no damage to second enemy');
    }

    #[test]
    fn test_different_trap_types_behavior() {
        let owner = get_test_owner();
        
        // Create different trap types
        let mut explosive_trap = create_trap(10, owner, 0, 0, 3, 80, TrapType::Explosive);
        let mut poison_trap = create_trap(11, owner, 10, 10, 4, 20, TrapType::Poison);
        let mut electric_trap = create_trap(12, owner, 20, 20, 2, 45, TrapType::Electric);
        let mut freezing_trap = create_trap(13, owner, 30, 30, 5, 15, TrapType::Freezing);
        
        let enemy_pos = Vec2 { x: 1, y: 1 };
        
        // Test explosive trap
        assert(explosive_trap.check_trigger(enemy_pos), 'Enemy should trigger explosive');
        let explosive_damage = explosive_trap.trigger();
        assert(explosive_damage == 80, 'Explosive should deal 80 damage');
        
        // Test poison trap (enemy at different position)
        let poison_enemy_pos = Vec2 { x: 12, y: 13 };
        assert(poison_trap.check_trigger(poison_enemy_pos), 'Enemy should trigger poison');
        let poison_damage = poison_trap.trigger();
        assert(poison_damage == 20, 'Poison should deal 20 damage');
        
        // Test electric trap
        let electric_enemy_pos = Vec2 { x: 21, y: 20 };
        assert(electric_trap.check_trigger(electric_enemy_pos), 'Enemy should trigger electric');
        let electric_damage = electric_trap.trigger();
        assert(electric_damage == 45, 'Electric should deal 45 damage');
        
        // Test freezing trap
        let freezing_enemy_pos = Vec2 { x: 33, y: 32 };
        assert(freezing_trap.check_trigger(freezing_enemy_pos), 'Enemy should trigger freezing');
        let freezing_damage = freezing_trap.trigger();
        assert(freezing_damage == 15, 'Freezing should deal 15 damage');
    }

    #[test]
    fn test_trap_activation_deactivation() {
        let owner = get_test_owner();
        let mut trap = create_trap(6, owner, 5, 5, 2, 40, TrapType::Electric);
        
        assert(trap.is_active, 'Trap should start active');
        
        // Deactivate trap
        trap.deactivate();
        assert(!trap.is_active, 'Trap should be inactive');
        
        // Enemy should not trigger inactive trap
        let enemy_pos = Vec2 { x: 5, y: 5 };
        assert(!trap.check_trigger(enemy_pos), 'Inactive trap should not trigger');
        
        // Reactivate trap
        trap.activate();
        assert(trap.is_active, 'Trap should be active again');
        assert(trap.check_trigger(enemy_pos), 'Reactivated trap should trigger');
    }

    #[test] 
    fn test_trap_edge_cases() {
        let owner = get_test_owner();
        
        // Test trap with zero radius
        let zero_radius_trap = create_trap(7, owner, 10, 10, 0, 50, TrapType::Explosive);
        let enemy_at_trap = Vec2 { x: 10, y: 10 };
        let enemy_adjacent = Vec2 { x: 11, y: 10 };
        
        assert(zero_radius_trap.check_trigger(enemy_at_trap), 'Should trigger at exact position');
        assert(!zero_radius_trap.check_trigger(enemy_adjacent), 'Should not trigger adjacent with zero radius');
        
        // Test trap with very large radius
        let large_radius_trap = create_trap(8, owner, 0, 0, 100, 10, TrapType::Poison);
        let far_enemy = Vec2 { x: 50, y: 49 }; // Distance = 99
        assert(large_radius_trap.check_trigger(far_enemy), 'Should trigger with large radius');
    }

    #[test]
    fn test_trap_distance_calculation() {
        let owner = get_test_owner();
        let trap = create_trap(9, owner, 10, 10, 5, 30, TrapType::Freezing);
        
        // Test Manhattan distance calculation
        let test_cases = array![
            (Vec2 { x: 15, y: 10 }, true),  // Distance = 5 (exactly at radius)
            (Vec2 { x: 10, y: 15 }, true),  // Distance = 5 (exactly at radius)
            (Vec2 { x: 13, y: 12 }, true),  // Distance = 5 (3+2)
            (Vec2 { x: 16, y: 10 }, false), // Distance = 6 (outside radius)
            (Vec2 { x: 10, y: 16 }, false), // Distance = 6 (outside radius)
            (Vec2 { x: 5, y: 5 }, false),   // Distance = 10 (outside radius)
        ];

        let mut i = 0;
        loop {
            if i >= test_cases.len() {
                break;
            }
            let (pos, should_trigger) = *test_cases.at(i);
            let result = trap.check_trigger(pos);
            if should_trigger {
                assert(result, 'Should trigger at this position');
            } else {
                assert(!result, 'Should not trigger at this position');
            }
            i += 1;
        };
    }
} 