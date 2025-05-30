// Reward Pool Model for Wave Completion Payouts

#[starknet::interface]
pub trait IRewardPool<T> {
    fn create_reward(ref self: T, coins: u32, gems: u32, items: u32) -> Reward;
    fn claim_reward(ref self: T, reward_id: u32) -> bool;
}

#[derive(Debug)]
pub struct Reward {
    coins: u32,
    gems: u32,
    items: u32,
    claimed: bool,
}

#[dojo::contract]
pub mod reward_pool {
    use super::IRewardPool;

    #[storage]
    struct Storage {
        rewards: HashMap<u32, Reward>,
        next_reward_id: u32,
    }

    fn dojo_init(ref self: ContractState) {
        self.next_reward_id.write(0);
    }

    #[abi(embed_v0)]
    impl RewardPoolImpl of IRewardPool<ContractState> {
        fn create_reward(ref self: ContractState, coins: u32, gems: u32, items: u32) -> Reward {
            let reward_id = self.next_reward_id.read();
            let reward = Reward {
                coins,
                gems,
                items,
                claimed: false,
            };

            self.rewards.insert(reward_id, reward);
            self.next_reward_id.write(reward_id + 1);
            reward
        }

        fn claim_reward(ref self: ContractState, reward_id: u32) -> bool {
            let mut reward = self.rewards.get_mut(&reward_id).unwrap();

            if reward.claimed {
                return false;
            }

            reward.claimed = true;
            self.rewards.insert(reward_id, reward);
            true
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn test_create_reward() {
            let mut contract = reward_pool::ContractState::default();

            let reward = reward_pool::RewardPoolImpl::create_reward(ref contract, 100, 5, 42);
            assert(reward.coins == 100, 'Coins set');
            assert(reward.gems == 5, 'Gems set');
            assert(reward.items == 42, 'Items set');
            assert(!reward.claimed, 'Not claimed yet');
        }

        #[test]
        fn test_claim_reward() {
            let mut contract = reward_pool::ContractState::default();

            // Create a reward first
            let _ = reward_pool::RewardPoolImpl::create_reward(ref contract, 100, 5, 42);

            // Claim the reward
            let claimed = reward_pool::RewardPoolImpl::claim_reward(ref contract, 0);
            assert(claimed, 'Claimed first time');

            // Try to claim again
            let claimed_again = reward_pool::RewardPoolImpl::claim_reward(ref contract, 0);
            assert(!claimed_again, 'Cannot claim twice');
        }
    }
}