// IItem is the interface of an item

// An "item" is a "coin candidate"
// that will be identified by the machine
// given its signature "(weight,size)"
export interface IItem {
    weight: number;
    size: number;
}
