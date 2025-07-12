#[derive(Drop, Serde, Clone)]
#[dojo::model]
pub struct Item {
    #[key]
    pub id: u32,
    pub name: ByteArray,
    pub description: ByteArray,
    pub value: u16,
    pub item_type: ItemType,
    pub usable: bool,
}

#[derive(Copy, Drop, Serde, Debug, PartialEq)]
pub enum ItemType {
    Trap,
    Upgrade,
    Consumable
}

#[generate_trait]
pub impl ItemImpl of ItemTrait {
    
    #[inline(always)]
    fn new(id: u32, name: ByteArray, description: ByteArray, value: u16, item_type: ItemType, usable: bool) -> Item {
        Item { id, name, description, value, item_type, usable }
    }

    #[inline(always)]
    fn update_value(ref self: Item, new_value: u16) {
        self.value = new_value;
    }
}

#[cfg(test)]
mod tests {
    use super::{Item, ItemImpl, ItemType};

    #[test]
    fn test_create_item() {
        let item = ItemImpl::new(1, "sword", "a basic sword", 100, ItemType::Upgrade, true);

        assert(item.id == 1, 'ID');
        assert(item.value == 100, 'VAL');
        assert(item.name.len() == 5, 'NAMELEN');
        assert(item.description.len() == 13, 'DESCLEN');
    }

    #[test]
    fn test_update_value() {
        let mut item = ItemImpl::new(2, "potion", "healing", 50, ItemType::Consumable, true);
        item.update_value(150);
        assert(item.value == 150, 'UPDVAL');
    }

    #[test]
    fn test_clone_item() {
        let original = ItemImpl::new(5, "staff", "magic", 120, ItemType::Trap, true);
        let cloned = original.clone();

        assert(cloned.id == 5, 'IDCLONE');
        assert(cloned.name == original.name, 'NAMECLONE');
        assert(cloned.description == original.description, 'DESCCLONE');
        assert(cloned.value == original.value, 'VALCLONE');
    }

    #[test]
    fn test_item_equality() {
        let item1 = ItemImpl::new(10, "ring", "gold", 250, ItemType::Upgrade, true);
        let item2 = ItemImpl::new(10, "ring", "gold", 250, ItemType::Upgrade, true);

        assert(item1.id == item2.id, 'EQID');
        assert(item1.name == item2.name, 'EQNAME');
        assert(item1.description == item2.description, 'EQDESC');
        assert(item1.value == item2.value, 'EQVAL');
    }

    #[test]
    fn test_item_inequality() {
        let item1 = ItemImpl::new(11, "shield", "iron", 300, ItemType::Upgrade, true);
        let item2 = ItemImpl::new(12, "shield", "steel", 300, ItemType::Upgrade, true);

        assert(item1.id != item2.id, 'NEQID');
        assert(item1.description != item2.description, 'NEQDESC');
    }

    #[test]
    fn test_zero_value_item() {
        let item = ItemImpl::new(13, "rock", "useless", 0, ItemType::Upgrade, true);

        assert(item.value == 0, 'ZEROVAL');
    }

    #[test]
    fn test_update_value_multiple_times() {
        let mut item = ItemImpl::new(15, "gem", "rare", 10, ItemType::Upgrade, true);

        item.update_value(20);
        assert(item.value == 20, 'VAL1');

        item.update_value(40);
        assert(item.value == 40, 'VAL2');

    }

    fn update_value(ref self: Item, new_value: u16) {
        self.value = new_value;
    }
}