use starknet::{ContractAddress, contract_address_const};
use core::num::traits::zero::Zero;
use dojo_starter::models::{Vec2, Vec2Trait};

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Trap {
    #[key]
    pub trap_id: u32,
    pub owner: ContractAddress,
    pub position: Vec2,
    pub trigger_radius: u32,
    pub damage: u16,
    pub trap_type: TrapType,
    pub is_active: bool,
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug, PartialEq)]
pub enum TrapType {
    Explosive,
    Poison,
    Electric,
    Freezing,
}

pub fn ZERO_ADDRESS() -> ContractAddress {
    contract_address_const::<0x0>()
}

#[generate_trait]
pub impl TrapImpl of TrapTrait {
    fn check_trigger(self: @Trap, enemy_pos: Vec2) -> bool {
        if !*self.is_active {
            return false;
        }

        let dx = if enemy_pos.x >= self.position.x {
            enemy_pos.x - self.position.x
        } else {
            self.position.x - enemy_pos.x
        };

        let dy = if enemy_pos.y >= self.position.y {
            enemy_pos.y - self.position.y
        } else {
            self.position.y - enemy_pos.y
        };

        // Calculate distance using Manhattan distance for simplicity
        let distance = dx + dy;
        distance <= *self.trigger_radius
    }

    fn trigger(ref self: Trap) -> u16 {
        if !self.is_active {
            return 0;
        }
        
        self.is_active = false; // Trap is consumed after triggering
        self.damage
    }

    fn deactivate(ref self: Trap) {
        self.is_active = false;
    }

    fn activate(ref self: Trap) {
        self.is_active = true;
    }
}

#[generate_trait]
pub impl TrapAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Trap) {
        assert(self.is_non_zero(), 'Trap: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: Trap) {
        assert(self.is_zero(), 'Trap: Already exists');
    }

    #[inline(always)]
    fn assert_active(self: Trap) {
        assert(self.is_active, 'Trap: Not active');
    }

    #[inline(always)]
    fn assert_owned_by(self: Trap, owner: ContractAddress) {
        assert(self.owner == owner, 'Trap: Not owned by caller');
    }
}

pub impl ZeroableTrapTrait of Zero<Trap> {
    #[inline(always)]
    fn zero() -> Trap {
        Trap {
            trap_id: 0,
            owner: ZERO_ADDRESS(),
            position: Vec2 { x: 0, y: 0 },
            trigger_radius: 0,
            damage: 0,
            trap_type: TrapType::Explosive,
            is_active: false,
        }
    }

    #[inline(always)]
    fn is_zero(self: @Trap) -> bool {
        *self.owner == ZERO_ADDRESS() && *self.trap_id == 0
    }

    #[inline(always)]
    fn is_non_zero(self: @Trap) -> bool {
        !self.is_zero()
    }
}

pub fn create_trap(
    trap_id: u32,
    owner: ContractAddress,
    x: u32,
    y: u32,
    trigger_radius: u32,
    damage: u16,
    trap_type: TrapType
) -> Trap {
    Trap {
        trap_id,
        owner,
        position: Vec2 { x, y },
        trigger_radius,
        damage,
        trap_type,
        is_active: true,
    }
}

impl TrapTypeIntoFelt252 of Into<TrapType, felt252> {
    fn into(self: TrapType) -> felt252 {
        match self {
            TrapType::Explosive => 1,
            TrapType::Poison => 2,
            TrapType::Electric => 3,
            TrapType::Freezing => 4,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Trap, TrapTrait, TrapType, create_trap, ZeroableTrapTrait};
    use starknet::{ContractAddress, contract_address_const};
    use dojo_starter::models::Vec2;

    #[test]
    fn test_trap_creation() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        
        let trap = create_trap(
            1,
            owner,
            10,
            15,
            3,
            50,
            TrapType::Explosive
        );

        assert(trap.trap_id == 1, 'Invalid trap id');
        assert(trap.owner == owner, 'Invalid owner');
        assert(trap.position.x == 10, 'Invalid x position');
        assert(trap.position.y == 15, 'Invalid y position');
        assert(trap.trigger_radius == 3, 'Invalid trigger radius');
        assert(trap.damage == 50, 'Invalid damage');
        assert(trap.trap_type == TrapType::Explosive, 'Invalid trap type');
        assert(trap.is_active, 'Trap should be active');
    }

    #[test]
    fn test_check_trigger_within_radius() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        
        // Enemy at position (12, 11) - within radius of 3
        let enemy_pos = Vec2 { x: 12, y: 11 };
        assert(trap.check_trigger(enemy_pos), 'Should trigger within radius');
    }

    #[test]
    fn test_check_trigger_outside_radius() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        
        // Enemy at position (15, 15) - outside radius of 3
        let enemy_pos = Vec2 { x: 15, y: 15 };
        assert(!trap.check_trigger(enemy_pos), 'Should not trigger outside radius');
    }

    #[test]
    fn test_check_trigger_exact_radius() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        
        // Enemy at position (13, 10) - exactly at radius of 3
        let enemy_pos = Vec2 { x: 13, y: 10 };
        assert(trap.check_trigger(enemy_pos), 'Should trigger at exact radius');
    }

    #[test]
    fn test_trigger_damage() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let mut trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        
        let damage_dealt = trap.trigger();
        assert(damage_dealt == 50, 'Should deal correct damage');
        assert(!trap.is_active, 'Trap should be inactive after trigger');
    }

    #[test]
    fn test_trigger_inactive_trap() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let mut trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        trap.deactivate();
        
        let damage_dealt = trap.trigger();
        assert(damage_dealt == 0, 'Inactive trap should deal no damage');
    }

    #[test]
    fn test_check_trigger_inactive_trap() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let mut trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        trap.deactivate();
        
        let enemy_pos = Vec2 { x: 10, y: 10 }; // Same position as trap
        assert(!trap.check_trigger(enemy_pos), 'Inactive trap should not trigger');
    }

    #[test]
    fn test_zero_trap() {
        let zero_trap = ZeroableTrapTrait::zero();
        assert(zero_trap.is_zero(), 'Should be zero');
        assert(!zero_trap.is_active, 'Zero trap should not be active');
    }

    #[test]
    fn test_non_zero_trap() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        let trap = create_trap(1, owner, 10, 10, 3, 50, TrapType::Explosive);
        
        assert(trap.is_non_zero(), 'Should be non-zero');
    }

    #[test]
    fn test_multiple_trap_types() {
        let owner: ContractAddress = contract_address_const::<0x123>();
        
        let explosive_trap = create_trap(1, owner, 0, 0, 2, 60, TrapType::Explosive);
        let poison_trap = create_trap(2, owner, 5, 5, 4, 30, TrapType::Poison);
        let electric_trap = create_trap(3, owner, 10, 10, 3, 45, TrapType::Electric);
        let freezing_trap = create_trap(4, owner, 15, 15, 5, 20, TrapType::Freezing);
        
        assert(explosive_trap.trap_type == TrapType::Explosive, 'Wrong explosive type');
        assert(poison_trap.trap_type == TrapType::Poison, 'Wrong poison type');
        assert(electric_trap.trap_type == TrapType::Electric, 'Wrong electric type');
        assert(freezing_trap.trap_type == TrapType::Freezing, 'Wrong freezing type');
    }
} 