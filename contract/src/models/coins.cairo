// Imports
use starknet::{ContractAddress, contract_address_const};
use core::num::traits::zero::Zero;

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct Coins {
    #[key]
    pub player_id: ContractAddress,
    pub amount: u64,
}

pub mod errors {
    pub const OVERFLOW_ERROR: felt252 = 'Coins: Overflow detected';
    pub const INSUFFICIENT_BALANCE: felt252 = 'Coins: Insufficient balance';
}

#[generate_trait]
pub impl CoinsImpl of CoinsTrait {
    // Create a new instance of Coins
    fn new(player_id: ContractAddress) -> Coins {
        Coins { player_id, amount: 0 }
    }

    // Add coins to player's balance
    fn add_coins(ref self: Coins, amount: u64) -> bool {
        // Pre-addition bound check to prevent overflow
        assert(amount <= 18446744073709551615_u64 - self.amount, errors::OVERFLOW_ERROR);

        let new_amount = self.amount + amount;
        self.amount = new_amount;
        true
    }

    // Spend coins (with balance check)
    fn spend_coins(ref self: Coins, amount: u64) -> bool {
        assert(self.amount >= amount, errors::INSUFFICIENT_BALANCE);

        self.amount -= amount;
        true
    }

    // Verify if there are enough coins
    fn has_enough(self: @Coins, amount: u64) -> bool {
        *self.amount >= amount
    }
}

#[generate_trait]
pub impl CoinsAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Coins) {
        assert(self.is_non_zero(), 'Coins: Does not exist');
    }

    #[inline(always)]
    fn assert_has_enough(self: @Coins, amount: u64) {
        assert(CoinsImpl::has_enough(self, amount), errors::INSUFFICIENT_BALANCE);
    }
}

pub impl ZeroableCoinsTrait of Zero<Coins> {
    #[inline(always)]
    fn zero() -> Coins {
        Coins { player_id: contract_address_const::<0x0>(), amount: 0 }
    }

    #[inline(always)]
    fn is_zero(self: @Coins) -> bool {
        *self.player_id == contract_address_const::<0x0>()
    }

    #[inline(always)]
    fn is_non_zero(self: @Coins) -> bool {
        !self.is_zero()
    }
}

#[cfg(test)]
mod tests {
    use super::{CoinsImpl, ZeroableCoinsTrait};
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    fn test_coins_initialization() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let coins = CoinsImpl::new(addr);

        assert(coins.player_id == addr, 'Player ID mismatch');
        assert(coins.amount == 0, 'Should start with 0 coins');
    }

    #[test]
    fn test_add_coins() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut coins = CoinsImpl::new(addr);

        assert(coins.add_coins(100), 'Should add coins');
        assert(coins.amount == 100, 'Balance should be updated');

        assert(coins.add_coins(50), 'Should add more coins');
        assert(coins.amount == 150, 'Balance should be 150');
    }

    #[test]
    fn test_spend_coins() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut coins = CoinsImpl::new(addr);

        coins.add_coins(100);
        assert(coins.spend_coins(50), 'Should spend coins');
        assert(coins.amount == 50, 'Balance should be updated');
    }

    #[test]
    #[should_panic(expected: ('Coins: Insufficient balance',))]
    fn test_insufficient_balance() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut coins = CoinsImpl::new(addr);

        coins.add_coins(50);
        coins.spend_coins(100); // Should fail
    }

    #[test]
    fn test_has_enough() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut coins = CoinsImpl::new(addr);

        coins.add_coins(100);
        assert(CoinsImpl::has_enough(@coins, 50), 'Should have enough');
        assert(!CoinsImpl::has_enough(@coins, 150), 'Should not have enough');
    }

    #[test]
    fn test_zero_coins() {
        let zero_coins = ZeroableCoinsTrait::zero();
        assert(zero_coins.is_zero(), 'Should be zero');
    }

    #[test]
    fn test_large_amounts() {
        let addr: ContractAddress = contract_address_const::<0x123>();
        let mut coins = CoinsImpl::new(addr);

        coins.add_coins(1000000);
        coins.add_coins(9000000);
        assert(coins.amount == 10000000, 'Should handle large amounts');
    }

    #[test]
    fn test_add_coins_boundary_success() {
        let addr: ContractAddress = contract_address_const::<0xABC>();
        let mut coins = CoinsImpl::new(addr);

        // MAX - 1 then +1 => MAX
        let max_minus_one: u64 = 18446744073709551614_u64;
        let one: u64 = 1_u64;

        assert(coins.add_coins(max_minus_one), 'Should add MAX-1');
        assert(coins.add_coins(one), 'Should add 1');
        assert(coins.amount == 18446744073709551615_u64, 'Balance should equal u64 MAX');
    }

    #[test]
    #[should_panic(expected: ('Coins: Overflow detected',))]
    fn test_add_coins_overflow_panic() {
        let addr: ContractAddress = contract_address_const::<0xDEF>();
        let mut coins = CoinsImpl::new(addr);

        // Adding MAX succeeds, then adding +1 should overflow
        assert(coins.add_coins(18446744073709551615_u64), 'Should add MAX');
        // This must panic with the correct message
        let _ = coins.add_coins(1_u64);
    }
}
