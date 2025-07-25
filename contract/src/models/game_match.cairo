use starknet::ContractAddress;
use core::num::traits::zero::Zero;

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug, PartialEq)]
pub enum MatchStatus {
    NotStarted,
    InProgress,
    Finished,
}

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct GameMatch {
    #[key]
    pub id: u32,
    pub status: MatchStatus,
    pub player1: ContractAddress,
    pub player2: ContractAddress,
    pub winner: ContractAddress,
    pub start_time: u64,
    pub end_time: u64,
}

#[generate_trait]
pub trait GameMatchTrait {
    fn new(id: u32, player1: ContractAddress, player2: ContractAddress) -> GameMatch;
    fn start(ref self: GameMatch, start_time: u64);
    fn finish(ref self: GameMatch, winner: ContractAddress, end_time: u64);
    fn is_active(self: @GameMatch) -> bool;
}

impl GameMatchImpl of GameMatchTrait {
    fn new(id: u32, player1: ContractAddress, player2: ContractAddress) -> GameMatch {
        GameMatch {
            id,
            status: MatchStatus::NotStarted,
            player1,
            player2,
            winner: starknet::contract_address_const::<0x0>(),
            start_time: 0,
            end_time: 0,
        }
    }

    fn start(ref self: GameMatch, start_time: u64) {
        assert(self.status == MatchStatus::NotStarted, 'Match already started');
        self.status = MatchStatus::InProgress;
        self.start_time = start_time;
    }

    fn finish(ref self: GameMatch, winner: ContractAddress, end_time: u64) {
        assert(self.status == MatchStatus::InProgress, 'Match not in progress');
        self.status = MatchStatus::Finished;
        self.winner = winner;
        self.end_time = end_time;
    }

    fn is_active(self: @GameMatch) -> bool {
        *self.status == MatchStatus::InProgress
    }
}

impl ZeroableGameMatch of Zero<GameMatch> {
    fn zero() -> GameMatch {
        GameMatch {
            id: 0,
            status: MatchStatus::NotStarted,
            player1: starknet::contract_address_const::<0x0>(),
            player2: starknet::contract_address_const::<0x0>(),
            winner: starknet::contract_address_const::<0x0>(),
            start_time: 0,
            end_time: 0,
        }
    }

    fn is_zero(self: @GameMatch) -> bool {
        *self.id == 0
    }

    fn is_non_zero(self: @GameMatch) -> bool {
        !self.is_zero()
    }
}

#[cfg(test)]
mod tests {
    use super::{GameMatch, GameMatchTrait, GameMatchImpl, MatchStatus, ZeroableGameMatch};
    use starknet::{ContractAddress, contract_address_const};
    use core::num::traits::zero::Zero;

    fn sample_player1() -> ContractAddress {
        contract_address_const::<0x123>()
    }

    fn sample_player2() -> ContractAddress {
        contract_address_const::<0x456>()
    }

    fn sample_winner() -> ContractAddress {
        contract_address_const::<0x789>()
    }

    #[test]
    fn test_new_game_match() {
        let player1 = sample_player1();
        let player2 = sample_player2();
        let game_match = GameMatchImpl::new(1, player1, player2);

        assert(game_match.id == 1, 'Invalid match ID');
        assert(game_match.status == MatchStatus::NotStarted, 'Should not be started');
        assert(game_match.player1 == player1, 'Invalid player1');
        assert(game_match.player2 == player2, 'Invalid player2');
        assert(game_match.winner == contract_address_const::<0x0>(), 'Winner should be zero');
        assert(game_match.start_time == 0, 'Start time should be zero');
        assert(game_match.end_time == 0, 'End time should be zero');
        assert(!game_match.is_active(), 'New match should not be active');
    }

    #[test]
    fn test_start_match() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());
        let start_time = 1000_u64;

        game_match.start(start_time);

        assert(game_match.status == MatchStatus::InProgress, 'Should be in progress');
        assert(game_match.start_time == start_time, 'Invalid start time');
        assert(game_match.is_active(), 'Started match should be active');
    }

    #[test]
    #[should_panic(expected: ('Match already started',))]
    fn test_start_already_started_match() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());

        game_match.start(1000_u64);
        game_match.start(2000_u64);
    }

    #[test]
    fn test_finish_match() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());
        let winner = sample_winner();
        let end_time = 2000_u64;

        // Start the match first
        game_match.start(1000_u64);

        // Then finish it
        game_match.finish(winner, end_time);

        assert(game_match.status == MatchStatus::Finished, 'Should be finished');
        assert(game_match.winner == winner, 'Invalid winner');
        assert(game_match.end_time == end_time, 'Invalid end time');
        assert!(!game_match.is_active(), "Finished match should not be active");
    }

    #[test]
    #[should_panic(expected: ('Match not in progress',))]
    fn test_finish_not_started_match() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());
        let winner = sample_winner();

        game_match.finish(winner, 2000_u64);
    }

    #[test]
    #[should_panic(expected: ('Match not in progress',))]
    fn test_finish_already_finished_match() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());
        let winner = sample_winner();

        // Start and finish the match
        game_match.start(1000_u64);
        game_match.finish(winner, 2000_u64);

        // Try to finish again - should panic
        game_match.finish(sample_player1(), 3000_u64);
    }

    #[test]
    fn test_is_active_states() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());

        // Not started - should not be active
        assert(!game_match.is_active(), 'NotStarted should not be active');

        // In progress - should be active
        game_match.start(1000_u64);
        assert(game_match.is_active(), 'InProgress should be active');

        // Finished - should not be active
        game_match.finish(sample_winner(), 2000_u64);
        assert(!game_match.is_active(), 'Finished should not be active');
    }

    #[test]
    fn test_match_status_equality() {
        assert(MatchStatus::NotStarted == MatchStatus::NotStarted, 'NotStarted equality');
        assert(MatchStatus::InProgress == MatchStatus::InProgress, 'InProgress equality');
        assert(MatchStatus::Finished == MatchStatus::Finished, 'Finished equality');

        assert(MatchStatus::NotStarted != MatchStatus::InProgress, 'Different statuses');
        assert(MatchStatus::InProgress != MatchStatus::Finished, 'Different statuses');
    }

    #[test]
    fn test_zero_game_match() {
        let zero_match = ZeroableGameMatch::zero();

        assert(zero_match.is_zero(), 'Zero match should be zero');
        assert(zero_match.id == 0, 'Zero match ID should be 0');
        assert!(zero_match.status == MatchStatus::NotStarted, "Zero match should not be started");
        assert(zero_match.player1 == contract_address_const::<0x0>(), 'Zero player1');
        assert(zero_match.player2 == contract_address_const::<0x0>(), 'Zero player2');
        assert(zero_match.winner == contract_address_const::<0x0>(), 'Zero winner');
        assert(zero_match.start_time == 0, 'Zero start time');
        assert(zero_match.end_time == 0, 'Zero end time');
    }

    #[test]
    fn test_non_zero_game_match() {
        let game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());

        assert!(game_match.is_non_zero(), "Non-zero match should be non-zero");
        assert!(!game_match.is_zero(), "Non-zero match should not be zero");
    }

    #[test]
    fn test_complete_match_workflow() {
        let player1 = sample_player1();
        let player2 = sample_player2();
        let mut game_match = GameMatchImpl::new(42, player1, player2);

        // Verify initial state
        assert(game_match.status == MatchStatus::NotStarted, 'Initial status wrong');
        assert(!game_match.is_active(), 'Should not be active initially');

        // Start the match
        let start_time = 1500_u64;
        game_match.start(start_time);
        assert(game_match.status == MatchStatus::InProgress, 'Should be in progress');
        assert(game_match.is_active(), 'Should be active after start');
        assert(game_match.start_time == start_time, 'Start time mismatch');

        // Finish the match
        let end_time = 3000_u64;
        game_match.finish(player1, end_time);
        assert(game_match.status == MatchStatus::Finished, 'Should be finished');
        assert!(!game_match.is_active(), "Should not be active after finish");
        assert(game_match.winner == player1, 'Winner should be player1');
        assert(game_match.end_time == end_time, 'End time mismatch');

        // Verify all data is preserved
        assert(game_match.id == 42, 'ID should be preserved');
        assert(game_match.player1 == player1, 'Player1 should be preserved');
        assert(game_match.player2 == player2, 'Player2 should be preserved');
        assert(game_match.start_time == start_time, 'Start time should be preserved');
    }

    #[test]
    fn test_match_with_same_players() {
        let player = sample_player1();
        let game_match = GameMatchImpl::new(1, player, player);

        assert(game_match.player1 == player, 'Player1 should match');
        assert(game_match.player2 == player, 'Player2 should match');
        assert(game_match.player1 == game_match.player2, 'Both players should be same');
    }

    #[test]
    fn test_multiple_matches_different_ids() {
        let player1 = sample_player1();
        let player2 = sample_player2();

        let match1 = GameMatchImpl::new(1, player1, player2);
        let match2 = GameMatchImpl::new(2, player2, player1);

        assert!(match1.id != match2.id, "Matches should have different IDs");
        assert(match1.player1 == match2.player2, 'Cross-match player verification');
        assert(match1.player2 == match2.player1, 'Cross-match player verification');
    }

    #[test]
    fn test_time_progression() {
        let mut game_match = GameMatchImpl::new(1, sample_player1(), sample_player2());

        let start_time = 1000_u64;
        let end_time = 5000_u64;

        game_match.start(start_time);
        game_match.finish(sample_winner(), end_time);

        assert(game_match.end_time > game_match.start_time, 'End time should be after start');
        assert(game_match.end_time - game_match.start_time == 4000_u64, 'Duration check');
    }
}
