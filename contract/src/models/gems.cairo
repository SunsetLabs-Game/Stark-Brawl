// Imports
use starknet::{ContractAddress, contract_address_const};
use core::num::traits::zero::Zero;

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Gems {
    #[key]
    pub player_id: ContractAddress,
    pub amount: u64,
}

pub mod errors {
    pub const OVERFLOW_ERROR: felt252 = 'Gems: Overflow detected';
    pub const INSUFFICIENT_BALANCE: felt252 = 'Gems: Insufficient balance';
    pub const UNAUTHORIZED: felt252 = 'Gems: Unauthorized operation';
}

#[generate_trait]
pub impl GemsImpl of GemsTrait {
    fn new(player_id: ContractAddress) -> Gems {
        Gems { player_id, amount: 0 }
    }

    fn add_gems(ref self: Gems, amount: u64) -> bool {
        // Pre-addition bound check to prevent overflow
        assert(amount <= 18446744073709551615_u64 - self.amount, errors::OVERFLOW_ERROR);

        let new_amount = self.amount + amount;
        self.amount = new_amount;
        true
    }

    fn spend_gems(ref self: Gems, amount: u64) -> bool {
        assert(self.amount >= amount, errors::INSUFFICIENT_BALANCE);

        self.amount -= amount;
        true
    }

    fn has_enough(self: @Gems, amount: u64) -> bool {
        *self.amount >= amount
    }
}

#[generate_trait]
pub impl GemsAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Gems) {
        assert(self.is_non_zero(), 'Gems: Does not exist');
    }

    #[inline(always)]
    fn assert_has_enough(self: @Gems, amount: u64) {
        assert(GemsImpl::has_enough(self, amount), errors::INSUFFICIENT_BALANCE);
    }
}

pub impl ZeroableGemsTrait of Zero<Gems> {
    #[inline(always)]
    fn zero() -> Gems {
        Gems { player_id: contract_address_const::<0x0>(), amount: 0 }
    }

    #[inline(always)]
    fn is_zero(self: @Gems) -> bool {
        *self.player_id == contract_address_const::<0x0>()
    }

    #[inline(always)]
    fn is_non_zero(self: @Gems) -> bool {
        !self.is_zero()
    }
}

#[cfg(test)]
mod tests {
    use super::{GemsImpl, ZeroableGemsTrait};
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    fn test_gems_initialization() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let gems = GemsImpl::new(addr);

        assert(gems.player_id == addr, 'Player ID mismatch');
        assert(gems.amount == 0, 'Should start with 0 gems');
    }

    #[test]
    fn test_add_gems() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut gems = GemsImpl::new(addr);

        assert(gems.add_gems(50), 'Should add gems');
        assert(gems.amount == 50, 'Balance should be updated');

        assert(gems.add_gems(25), 'Should add more gems');
        assert(gems.amount == 75, 'Balance should be 75');
    }

    #[test]
    fn test_spend_gems() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut gems = GemsImpl::new(addr);

        gems.add_gems(100);
        assert(gems.spend_gems(30), 'Should spend gems');
        assert(gems.amount == 70, 'Balance should be updated');
    }

    #[test]
    #[should_panic(expected: ('Gems: Insufficient balance',))]
    fn test_insufficient_balance() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut gems = GemsImpl::new(addr);

        gems.add_gems(20);
        gems.spend_gems(50); // Should fail
    }

    #[test]
    fn test_has_enough() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut gems = GemsImpl::new(addr);

        gems.add_gems(100);
        assert(GemsImpl::has_enough(@gems, 50), 'Should have enough');
        assert(!GemsImpl::has_enough(@gems, 150), 'Should not have enough');
    }

    #[test]
    fn test_zero_gems() {
        let zero_gems = ZeroableGemsTrait::zero();
        assert(zero_gems.is_zero(), 'Should be zero');
    }

    #[test]
    fn test_large_amounts() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut gems = GemsImpl::new(addr);

        gems.add_gems(5000);
        gems.add_gems(10000);
        assert(gems.amount == 15000, 'Should handle large amounts');
    }

    #[test]
    fn test_add_gems_boundary_success() {
        let addr: ContractAddress = contract_address_const::<0xABC>();
        let mut gems = GemsImpl::new(addr);

        let max_minus_one: u64 = 18446744073709551614_u64;
        let one: u64 = 1_u64;

        assert(gems.add_gems(max_minus_one), 'Should add MAX-1');
        assert(gems.add_gems(one), 'Should add 1');
        assert(gems.amount == 18446744073709551615_u64, 'Balance should equal u64 MAX');
    }

    #[test]
    #[should_panic(expected: ('Gems: Overflow detected',))]
    fn test_add_gems_overflow_panic() {
        let addr: ContractAddress = contract_address_const::<0xDEF>();
        let mut gems = GemsImpl::new(addr);

        assert(gems.add_gems(18446744073709551615_u64), 'Should add MAX');
        let _ = gems.add_gems(1_u64);
    }
}
