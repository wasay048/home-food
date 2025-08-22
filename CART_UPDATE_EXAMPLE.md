# Cart Update System Example

The cart system now intelligently handles duplicate items by updating existing items rather than rejecting them.

## How the Update System Works

When adding an item to cart:

1. **Check for Existing Item**: System checks for existing item with same:
   - `foodId`
   - `selectedDate`
   - `specialInstructions` (exact match after trimming whitespace)

2. **If Item Exists**:
   - Updates the existing item's quantity (existing + new quantity)
   - Updates the special instructions to the new value
   - Shows success message: "Item updated in cart!"

3. **If Item Doesn't Exist**:
   - Adds new item to cart normally
   - Shows success message: "Added to cart!"

## Example Usage

```jsx
import { useGenericCart } from '../hooks/useGenericCart';

const MyComponent = () => {
  const { addToCartWithCheck } = useGenericCart();

  const handleAddToCart = () => {
    addToCartWithCheck({
      foodItem: selectedFood,
      quantity: 2,
      selectedDate: '2024-12-27',
      specialInstructions: 'Extra spicy please'
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};
```

## What Happens with Duplicates

### Scenario 1: Same item, same date, same instructions

- **Existing**: Pizza (qty: 1, date: 2024-12-27, instructions: "Extra cheese")
- **Adding**: Pizza (qty: 2, date: 2024-12-27, instructions: "Extra cheese")
- **Result**: Pizza (qty: 3, date: 2024-12-27, instructions: "Extra cheese")

### Scenario 2: Same item, same date, different instructions

- **Existing**: Pizza (qty: 1, date: 2024-12-27, instructions: "Extra cheese")
- **Adding**: Pizza (qty: 2, date: 2024-12-27, instructions: "Extra spicy")
- **Result**: Pizza (qty: 3, date: 2024-12-27, instructions: "Extra spicy") ← Instructions updated!

### Scenario 3: Same item, different date

- **Existing**: Pizza (qty: 1, date: 2024-12-27, instructions: "Extra cheese")
- **Adding**: Pizza (qty: 2, date: 2024-12-28, instructions: "Extra cheese")
- **Result**: Two separate cart items (different pickup dates)

## Benefits

✅ **No Duplicate Rejections**: Users can freely add items without error messages
✅ **Smart Quantity Updates**: Quantities accumulate naturally
✅ **Instruction Updates**: Latest special instructions are preserved
✅ **Date Separation**: Different pickup dates create separate cart items
✅ **Consistent UX**: Same behavior across all components using the generic cart system
