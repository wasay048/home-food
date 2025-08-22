# Generic Cart System Documentation

## Overview

This generic cart system provides reusable cart functionality that can be used across all components in the application. It includes duplicate checking, quantity management, and seamless integration with Redux.

## Key Features

✅ **Duplicate Item Detection**: Automatically detects if an item already exists in cart and shows appropriate message  
✅ **Generic & Reusable**: Works with any component - ListingPage, FoodDetailPage, or any custom component  
✅ **Smart Quantity Management**: Handles adding, removing, and updating quantities intelligently  
✅ **Complete Data Structure**: Includes full food, kitchen, and pickup details in cart items  
✅ **Error Handling**: Comprehensive error handling with user-friendly messages  
✅ **Redux Integration**: Seamlessly works with existing Redux cart slice  

## Usage

### 1. Using the Hook (Recommended)

```jsx
import { useGenericCart } from '../hooks/useGenericCart';

const MyComponent = ({ food, kitchen }) => {
  const { getCartQuantity, addToCartWithCheck, handleQuantityChange } = useGenericCart();
  
  const cartQuantity = getCartQuantity(food.id);
  
  const handleAddToCart = async () => {
    const result = await addToCartWithCheck({
      food,
      kitchen,
      quantity: 1,
      selectedDate: null, // null for Go&Grab, date string for Pre-order
      specialInstructions: "",
      isPreOrder: false,
    });
    
    if (result.isExisting) {
      // Item already exists - show message
      console.log(`Item exists with ${result.existingQuantity} items`);
    }
  };
  
  return (
    <div>
      <p>In Cart: {cartQuantity}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

### 2. Using Utility Functions Directly

```jsx
import { handleGenericAddToCart, getCartQuantity } from '../utils/cartUtils';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const MyComponent = ({ food, kitchen }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  const handleAddToCart = async () => {
    const result = await handleGenericAddToCart(
      { food, kitchen, quantity: 1 },
      dispatch,
      addToCart,
      cartItems
    );
  };
};
```

### 3. With QuantitySelector Component

```jsx
const MyComponent = ({ food, kitchen }) => {
  const { getCartQuantity, handleQuantityChange } = useGenericCart();
  
  return (
    <QuantitySelector
      food={food}
      kitchen={kitchen}
      selectedDate={null}
      initialQuantity={getCartQuantity(food.id)}
      onQuantityChange={async (newQuantity) => {
        await handleQuantityChange({
          food,
          kitchen,
          newQuantity,
          currentQuantity: getCartQuantity(food.id),
          selectedDate: null,
          specialInstructions: "",
          isPreOrder: false,
        });
      }}
    />
  );
};
```

## API Reference

### useGenericCart Hook

```jsx
const {
  cartItems,           // Array: Current cart items
  isAuthenticated,     // Boolean: User authentication status
  getCartQuantity,     // Function: Get quantity for specific item
  addToCartWithCheck,  // Function: Add item with duplicate checking
  removeFromCartGeneric, // Function: Remove item from cart
  handleQuantityChange, // Function: Handle quantity changes
  dispatch,            // Redux dispatch function
  addToCart,           // Raw Redux action
  removeFromCart       // Raw Redux action
} = useGenericCart();
```

### Cart Item Parameters

```jsx
const cartItemParams = {
  food: {              // Required: Food object
    id: string,
    name: string,
    cost: string,
    imageUrl: string,
    description: string,
    // ... other food fields
  },
  kitchen: {           // Required: Kitchen object  
    id: string,
    name: string,
    address: string,
    // ... other kitchen fields
  },
  quantity: number,    // Default: 1
  selectedDate: string | null, // null for Go&Grab, 'YYYY-MM-DD' for Pre-order
  specialInstructions: string, // Default: ""
  isPreOrder: boolean, // Default: false
  pickupDetails: {     // Auto-generated if not provided
    pickupDate: string,
    pickupTime: string,
    displayPickupTime: string,
    displayPickupClock: string,
    orderType: string
  }
};
```

### Response Format

```jsx
const response = {
  success: boolean,      // Operation success status
  isExisting: boolean,   // Whether item already existed in cart
  existingQuantity: number, // Quantity of existing item (if applicable)
  message: string,       // User-friendly message
  error: object         // Error object (if failed)
};
```

## Duplicate Detection Logic

The system checks for duplicates based on:

- **Food ID** (`foodId`)
- **Selected Date** (`selectedDate`)  
- **Special Instructions** (`specialInstructions`)

If an exact match is found, it shows: *"[Food Name] is already in your cart with [X] items"*

## Integration Examples

### ListingPage Integration

- ✅ Implemented with `useGenericCart` hook
- ✅ Handles Go&Grab and Pre-order items
- ✅ Smart quantity management with QuantitySelector

### FoodDetailPage Integration  

- ✅ Enhanced `useFoodDetailRedux` hook with complete food data
- ✅ Full pickup details generation
- ✅ Duplicate checking in cart operations

### Custom Component Integration

- ✅ See `CartExampleComponent.jsx` for reference
- ✅ Works with any food/kitchen data structure
- ✅ Easily customizable for specific needs

## Error Handling

The system handles various scenarios:

- User not authenticated
- Missing food/kitchen data
- Network/API errors
- Invalid quantities
- Cart state inconsistencies

All errors are returned as user-friendly messages suitable for toast notifications.

## Benefits

1. **Consistency**: Same cart behavior across all components
2. **Maintainability**: Single source of truth for cart logic  
3. **Reusability**: Drop-in solution for any component
4. **User Experience**: Clear feedback for duplicate items and errors
5. **Data Integrity**: Complete item data stored in cart for proper display
6. **Flexibility**: Can be customized for specific use cases while maintaining core functionality

## Migration Guide

To migrate existing cart code:

1. Replace manual cart operations with `useGenericCart` hook
2. Update quantity change handlers to use `handleQuantityChange`
3. Remove duplicate cart state management
4. Update imports to use new utilities

See the updated `ListingPage.jsx` for a complete migration example.
