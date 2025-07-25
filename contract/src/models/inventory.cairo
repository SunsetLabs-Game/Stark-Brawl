use core::array::ArrayTrait;
use core::num::traits::zero::Zero;
use starknet::ContractAddress;
use stark_brawl::models::item::{Item, ItemImpl};
use stark_brawl::constants::{MAX_INVENTORY_CAPACITY};

pub mod errors {
    pub const INVENTORY_FULL: felt252 = 'Inventory is full';
    pub const ITEM_NOT_FOUND: felt252 = 'Item not found in inventory';
    pub const INVALID_ITEM: felt252 = 'Invalid item data';
}

#[derive(Drop, Serde, Clone)]
#[dojo::model]
pub struct Inventory {
    #[key]
    pub player_address: ContractAddress, // Changed from id: u32 to player_address: ContractAddress
    pub items: Array<Item>,
    pub max_capacity: u32,
    pub is_set: bool,
}

#[generate_trait]
pub impl InventoryImpl of InventoryTrait {
    // New inventory
    fn new(player_address: ContractAddress) -> Inventory {
        Inventory {
            player_address,
            items: ArrayTrait::new(),
            max_capacity: MAX_INVENTORY_CAPACITY,
            is_set: true,
        }
    }

    // New item
    fn add_item(ref self: Inventory, item: Item) -> bool {
        // validate space
        if self.items.len() >= self.max_capacity {
            return false;
        }

        // Add item
        self.items.append(item);
        true
    }

    // Is full
    fn is_full(self: @Inventory) -> bool {
        self.items.len() >= *self.max_capacity
    }

    // Current capacity
    fn available_space(self: @Inventory) -> usize {
        *self.max_capacity - self.items.len()
    }

    // Remove item
    fn remove_item(ref self: Inventory, item_id: u32) -> bool {
        let mut found = false;
        let mut new_items = ArrayTrait::new();
        let mut i = 0;

        loop {
            if i >= self.items.len() {
                break;
            }

            let current_item = self.items.at(i);

            if current_item.id != @item_id || found {
                new_items.append(current_item.clone());
            } else {
                found = true;
            }

            i += 1;
        };

        if found {
            self.items = new_items;
        }

        found
    }
}

#[generate_trait]
pub impl InventoryAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Inventory) {
        assert(self.is_non_zero(), errors::INVALID_ITEM);
    }

    #[inline(always)]
    fn assert_not_full(self: @Inventory) {
        assert(!InventoryImpl::is_full(self), errors::INVENTORY_FULL);
    }
}

pub impl ZeroableInventoryTrait of Zero<Inventory> {
    #[inline(always)]
    fn zero() -> Inventory {
        Inventory {
            player_address: starknet::contract_address_const::<0x0>(),
            items: ArrayTrait::new(),
            max_capacity: 0,
            is_set: false,
        }
    }

    #[inline(always)]
    fn is_zero(self: @Inventory) -> bool {
        !(*self.is_set)
    }

    #[inline(always)]
    fn is_non_zero(self: @Inventory) -> bool {
        *self.is_set
    }
}

#[cfg(test)]
mod tests {
    use super::{InventoryImpl, ItemImpl, MAX_INVENTORY_CAPACITY};
    use stark_brawl::models::item::ItemType;
    use starknet::contract_address_const;

    #[test]
    fn test_new_inventory() {
        let addr = contract_address_const::<0x123>();
        let inventory = InventoryImpl::new(addr);
        assert(inventory.player_address == addr, 'Invalid inventory address');
        assert(inventory.is_set == true, 'Should be set');
        assert(inventory.max_capacity == 30, 'Invalid max capacity');
        assert(inventory.items.len() == 0, 'Should start empty');
    }

    #[test]
    fn test_add_item() {
        let addr = contract_address_const::<0x123>();
        let mut inventory = InventoryImpl::new(addr);
        let item = ItemImpl::new(1, "sword", "a basic sword", 100, ItemType::Upgrade, true);

        assert(inventory.add_item(item), 'Should add item');
        assert(inventory.items.len() == 1, 'Should have one item');
    }

    #[test]
    fn test_inventory_full() {
        let addr = contract_address_const::<0x123>();
        let mut inventory = InventoryImpl::new(addr);

        let test_item = ItemImpl::new(1, "sword", "a basic sword", 100, ItemType::Upgrade, true);

        let mut i = 0;
        loop {
            if i >= MAX_INVENTORY_CAPACITY {
                break;
            }

            let item_to_add = test_item.clone();
            assert(inventory.add_item(item_to_add), 'Should add item');
            i += 1;
        };

        let final_item = test_item.clone();

        assert(!inventory.add_item(final_item), 'Should not add when full');
        assert(inventory.is_full(), 'Should be full');
    }

    #[test]
    fn test_remove_item() {
        let addr = contract_address_const::<0x123>();
        let mut inventory = InventoryImpl::new(addr);
        let item = ItemImpl::new(1, "sword", "a basic sword", 100, ItemType::Upgrade, true);

        inventory.add_item(item);
        assert(inventory.remove_item(1), 'Should remove item');
        assert(inventory.items.len() == 0, 'Should be empty after remove');
    }

    #[test]
    fn test_available_space() {
        let addr = contract_address_const::<0x123>();
        let mut inventory = InventoryImpl::new(addr);
        let item = ItemImpl::new(1, "sword", "a basic sword", 100, ItemType::Upgrade, true);

        assert(inventory.available_space() == MAX_INVENTORY_CAPACITY, 'Should be empty');
        inventory.add_item(item);
        assert(
            inventory.available_space() == MAX_INVENTORY_CAPACITY - 1, 'Should have one less space',
        );
    }
}
