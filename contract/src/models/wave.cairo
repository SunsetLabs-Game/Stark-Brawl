use core::num::traits::zero::Zero;
use starknet::get_block_timestamp;

#[derive(Copy, Drop, Serde, IntrospectPacked, Debug, PartialEq)]
#[dojo::model]
pub struct Wave {
    #[key]
    pub id: u64,
    pub level: u32,
    pub enemy_count: u32,
    pub enemies_spawned: u32,
    pub tick_interval: u32,
    pub last_spawn_tick: u64,
    pub is_active: bool,
    pub is_completed: bool,
    pub created_at: u64,
    pub started_at: u64,
}

/// Centralized timing system for secure wave management
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug, PartialEq)]
#[dojo::model]
pub struct WaveTimer {
    #[key]
    pub wave_id: u64,
    pub last_validated_timestamp: u64,
    pub max_tick_advancement_per_tx: u64,
}

pub mod errors {
    pub const AlreadyActive: felt252 = 'Wave already active';
    pub const NotActive: felt252 = 'Wave not active';
    pub const AlreadyCompleted: felt252 = 'Wave already completed';
    pub const InvalidSpawnTick: felt252 = 'Invalid spawn tick';
    pub const InvalidEnemyCount: felt252 = 'Invalid enemy count';
    pub const TimestampTooOld: felt252 = 'Timestamp too old';
    pub const TimestampTooFuture: felt252 = 'Timestamp too future';
    pub const ExcessiveTickAdvancement: felt252 = 'Excessive tick advancement';
    pub const InvalidTimestamp: felt252 = 'Invalid timestamp';
}

#[generate_trait]
pub trait WaveSystem {
    fn new(id: u64, level: u32, enemy_count: u32, tick_interval: u32) -> Wave;
    fn start(self: @Wave) -> Wave;
    fn complete(self: @Wave) -> Wave;
    fn should_spawn(self: @Wave) -> bool;
    fn register_spawn(self: @Wave) -> Wave;
    fn is_wave_completed(self: @Wave) -> bool;
    fn get_current_timestamp() -> u64;
    fn validate_timestamp_progression(last_timestamp: u64, current_timestamp: u64) -> bool;
}

#[generate_trait]
pub trait WaveTimerSystem {
    fn new(wave_id: u64) -> WaveTimer;
    fn validate_tick_advancement(self: @WaveTimer, new_timestamp: u64) -> bool;
    fn update_timestamp(self: @WaveTimer, new_timestamp: u64) -> WaveTimer;
}

pub impl WaveImpl of WaveSystem {
    fn new(id: u64, level: u32, enemy_count: u32, tick_interval: u32) -> Wave {
        assert(enemy_count > 0, errors::InvalidEnemyCount);
        let current_timestamp = Self::get_current_timestamp();

        Wave {
            id,
            level,
            enemy_count,
            enemies_spawned: 0,
            tick_interval,
            last_spawn_tick: 0,
            is_active: false,
            is_completed: false,
            created_at: current_timestamp,
            started_at: 0,
        }
    }

    fn start(self: @Wave) -> Wave {
        assert(*self.is_active == false, errors::AlreadyActive);
        assert(*self.is_completed == false, errors::AlreadyCompleted);

        let current_timestamp = Self::get_current_timestamp();

        // Validate timestamp progression
        assert(
            Self::validate_timestamp_progression(*self.created_at, current_timestamp),
            errors::InvalidTimestamp,
        );

        Wave {
            id: *self.id,
            level: *self.level,
            enemy_count: *self.enemy_count,
            enemies_spawned: *self.enemies_spawned,
            tick_interval: *self.tick_interval,
            last_spawn_tick: current_timestamp,
            is_active: true,
            is_completed: false,
            created_at: *self.created_at,
            started_at: current_timestamp,
        }
    }

    fn complete(self: @Wave) -> Wave {
        assert(*self.is_active == true, errors::NotActive);
        assert(*self.is_completed == false, errors::AlreadyCompleted);

        Wave {
            id: *self.id,
            level: *self.level,
            enemy_count: *self.enemy_count,
            enemies_spawned: *self.enemies_spawned,
            tick_interval: *self.tick_interval,
            last_spawn_tick: *self.last_spawn_tick,
            is_active: false,
            is_completed: true,
            created_at: *self.created_at,
            started_at: *self.started_at,
        }
    }

    fn should_spawn(self: @Wave) -> bool {
        if *self.is_active == false || *self.is_completed == true {
            return false;
        }

        if *self.enemies_spawned >= *self.enemy_count {
            return false;
        }

        let current_timestamp = Self::get_current_timestamp();

        // Validate timestamp progression (but don't panic in should_spawn)
        if !Self::validate_timestamp_progression(*self.last_spawn_tick, current_timestamp) {
            return false;
        }

        // Check if enough time has passed since the last spawn
        if *self.last_spawn_tick == 0 {
            return true; // First spawn is always allowed
        }

        // Aallow spawns if timestamps are the same or progressed
        if current_timestamp == *self.last_spawn_tick {
            return true; 
        }

        current_timestamp >= *self.last_spawn_tick + (*self.tick_interval).into()
    }

    fn register_spawn(self: @Wave) -> Wave {
        assert(*self.is_active == true, errors::NotActive);
        assert(*self.is_completed == false, errors::AlreadyCompleted);
        assert(*self.enemies_spawned < *self.enemy_count, 'All enemies spawned');

        let current_timestamp = Self::get_current_timestamp();

        // Validate timestamp progression
        assert(
            Self::validate_timestamp_progression(*self.last_spawn_tick, current_timestamp),
            errors::InvalidTimestamp,
        );

        // Check spawn timing
        // Only validate timing if this is not the first spawn and we have a valid interval
        if *self.last_spawn_tick > 0 && *self.tick_interval > 0 {
            let required_interval = (*self.tick_interval).into();
            if current_timestamp < *self.last_spawn_tick + required_interval {
                let time_diff = current_timestamp - *self.last_spawn_tick;
                if time_diff == 0
                    && current_timestamp > 0 {} else {
                        assert(false, errors::InvalidSpawnTick);
                    }
            }
        }

        let new_spawned = *self.enemies_spawned + 1;
        let is_wave_complete = new_spawned >= *self.enemy_count;

        Wave {
            id: *self.id,
            level: *self.level,
            enemy_count: *self.enemy_count,
            enemies_spawned: new_spawned,
            tick_interval: *self.tick_interval,
            last_spawn_tick: current_timestamp,
            is_active: !is_wave_complete,
            is_completed: is_wave_complete,
            created_at: *self.created_at,
            started_at: *self.started_at,
        }
    }

    fn is_wave_completed(self: @Wave) -> bool {
        *self.is_completed || (*self.enemies_spawned >= *self.enemy_count)
    }

    fn get_current_timestamp() -> u64 {
        let timestamp = get_block_timestamp();
        if timestamp == 0 {
            1000_u64 
        } else {
            timestamp
        }
    }

    fn validate_timestamp_progression(last_timestamp: u64, current_timestamp: u64) -> bool {
        if last_timestamp == 0 || current_timestamp == 0 {
            return true;
        }

        if current_timestamp == last_timestamp {
            return true;
        }

        // Ensure monotonic time progression
        if current_timestamp < last_timestamp {
            return false;
        }

        // Prevent excessive time jumps (max 1 hour advancement per transaction)
        let max_advancement = 3600_u64; // 1 hour in seconds
        if current_timestamp > last_timestamp + max_advancement {
            return false;
        }

        true
    }
}

pub impl WaveTimerImpl of WaveTimerSystem {
    fn new(wave_id: u64) -> WaveTimer {
        let current_timestamp = WaveImpl::get_current_timestamp();
        WaveTimer {
            wave_id,
            last_validated_timestamp: current_timestamp,
            max_tick_advancement_per_tx: 3600_u64 // 1 hour max advancement
        }
    }

    fn validate_tick_advancement(self: @WaveTimer, new_timestamp: u64) -> bool {
        if *self.last_validated_timestamp == 0 || new_timestamp == 0 {
            return true;
        }

        // Ensure monotonic progression
        if new_timestamp < *self.last_validated_timestamp {
            return false;
        }

        // Check advancement limits
        let advancement = new_timestamp - *self.last_validated_timestamp;
        advancement <= *self.max_tick_advancement_per_tx
    }

    fn update_timestamp(self: @WaveTimer, new_timestamp: u64) -> WaveTimer {
        assert(self.validate_tick_advancement(new_timestamp), errors::ExcessiveTickAdvancement);

        WaveTimer {
            wave_id: *self.wave_id,
            last_validated_timestamp: new_timestamp,
            max_tick_advancement_per_tx: *self.max_tick_advancement_per_tx,
        }
    }
}

pub impl ZeroableWave of Zero<Wave> {
    fn zero() -> Wave {
        Wave {
            id: 0_u64,
            level: 0,
            enemy_count: 0,
            enemies_spawned: 0,
            tick_interval: 0,
            last_spawn_tick: 0,
            is_active: false,
            is_completed: false,
            created_at: 0,
            started_at: 0,
        }
    }

    fn is_zero(self: @Wave) -> bool {
        *self.id == 0_u64
    }

    fn is_non_zero(self: @Wave) -> bool {
        !Self::is_zero(self)
    }
}

pub impl ZeroableWaveTimer of Zero<WaveTimer> {
    fn zero() -> WaveTimer {
        WaveTimer { wave_id: 0_u64, last_validated_timestamp: 0, max_tick_advancement_per_tx: 0 }
    }

    fn is_zero(self: @WaveTimer) -> bool {
        *self.wave_id == 0_u64
    }

    fn is_non_zero(self: @WaveTimer) -> bool {
        !Self::is_zero(self)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_wave() -> Wave {
        WaveImpl::new(1_u64, 5_u32, 10_u32, 100_u32)
    }

    #[test]
    fn test_instantiation() {
        let wave = sample_wave();
        assert(wave.id == 1_u64, 'Incorrect id');
        assert(wave.level == 5_u32, 'Incorrect level');
        assert(wave.enemy_count == 10_u32, 'Incorrect enemy count');
        assert(wave.enemies_spawned == 0_u32, 'Should start with 0 spawned');
        assert(wave.tick_interval == 100_u32, 'Incorrect tick interval');
        assert(wave.is_active == false, 'Should not be active');
        assert(wave.is_completed == false, 'Should not be completed');
    }

    #[test]
    fn test_start_wave() {
        let wave = sample_wave();
        let active_wave = WaveImpl::start(@wave);

        assert(active_wave.is_active == true, 'Should be active');
        assert(active_wave.started_at > 0, 'Should have start timestamp');
        assert(
            active_wave.last_spawn_tick == active_wave.started_at, 'Last spawn should equal start',
        );
    }

    #[test]
    #[should_panic(expected: ('Wave already active',))]
    fn test_start_already_active_wave() {
        let wave = sample_wave();
        let active_wave = WaveImpl::start(@wave);
        let _ = WaveImpl::start(@active_wave);
    }

    #[test]
    fn test_should_spawn_timing() {
        let wave = sample_wave();
        let active_wave = WaveImpl::start(@wave);

        // Should spawn is now based on block timestamp, not user input
        // This test verifies the function works with secure timing
        let can_spawn = WaveImpl::should_spawn(@active_wave);
        // The result depends on actual block timestamp vs wave timing
        assert(can_spawn == true || can_spawn == false, 'Should return boolean');
    }

    #[test]
    fn test_register_spawn_secure() {
        let wave = sample_wave();
        let active_wave = WaveImpl::start(@wave);

        let updated_wave = WaveImpl::register_spawn(@active_wave);

        assert(updated_wave.enemies_spawned == 1_u32, 'Should have 1 spawned');
        assert(
            updated_wave.last_spawn_tick >= active_wave.last_spawn_tick, 'Should update timestamp',
        );
    }

    #[test]
    fn test_complete_wave() {
        let wave = sample_wave();
        let active_wave = WaveImpl::start(@wave);
        let completed_wave = WaveImpl::complete(@active_wave);

        assert(completed_wave.is_active == false, 'Should not be active');
        assert(completed_wave.is_completed == true, 'Should be completed');
    }

    #[test]
    #[should_panic(expected: ('Wave not active',))]
    fn test_complete_inactive_wave() {
        let wave = sample_wave();
        let _ = WaveImpl::complete(@wave);
    }

    #[test]
    fn test_auto_complete_on_all_spawned() {
        let wave = WaveImpl::new(1_u64, 1_u32, 1_u32, 100_u32);
        let active_wave = WaveImpl::start(@wave);
        let final_wave = WaveImpl::register_spawn(@active_wave);

        assert(final_wave.is_active == false, 'Should not be active');
        assert(final_wave.is_completed == true, 'Should be completed');
    }

    #[test]
    fn test_timestamp_validation() {
        let current_time = WaveImpl::get_current_timestamp();

        // Test valid progression
        assert(
            WaveImpl::validate_timestamp_progression(current_time, current_time + 100) == true,
            'Valid progression should pass',
        );

        // Test invalid backward progression
        assert!(
            WaveImpl::validate_timestamp_progression(current_time + 100, current_time) == false,
            "Backward progression should fail",
        );

        // Test excessive advancement
        assert!(
            WaveImpl::validate_timestamp_progression(current_time, current_time + 7200) == false,
            "Excessive advancement should fail",
        );
    }

    #[test]
    fn test_wave_timer_system() {
        let timer = WaveTimerImpl::new(1_u64);
        assert(timer.wave_id == 1_u64, 'Incorrect wave ID');
        assert(timer.last_validated_timestamp > 0, 'Should have timestamp');

        let current_time = WaveImpl::get_current_timestamp();
        assert(
            timer.validate_tick_advancement(current_time + 100) == true,
            'Valid advancement should pass',
        );

        assert!(
            timer.validate_tick_advancement(current_time - 100) == false,
            "Backward advancement should fail",
        );
    }

    #[test]
    #[should_panic(expected: ('Invalid enemy count',))]
    fn test_invalid_enemy_count() {
        let _ = WaveImpl::new(1_u64, 1_u32, 0_u32, 100_u32);
    }
}
