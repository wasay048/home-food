# Redux Implementation - Home Food Mobile App

## Overview

This document outlines the complete Redux implementation for the Home Food mobile application, providing centralized state management for all data operations.

## Redux Store Structure

### 1. Auth Slice (`src/store/slices/authSlice.js`)

- **Purpose**: Manages user authentication state
- **Features**:
  - Dummy user for development (`dummy-user-001`, John Doe)
  - WeChat authentication placeholders
  - Authentication state tracking
  - User profile management

### 2. Cart Slice (`src/store/slices/cartSlice.js`)

- **Purpose**: Manages shopping cart operations
- **Features**:
  - Add/remove/update cart items
  - User-specific cart operations
  - Quantity management
  - Cart total calculations
  - Async operations with loading states

### 3. Food Slice (`src/store/slices/foodSlice.js`)

- **Purpose**: Manages food data and operations
- **Features**:
  - Food detail fetching with kitchen and reviews
  - Food likes/unlikes functionality
  - All foods listing
  - Optimistic UI updates
  - Error handling and loading states

### 4. Kitchen Slice (`src/store/slices/kitchenSlice.js`)

- **Purpose**: Manages kitchen-specific data
- **Features**:
  - Kitchen review statistics
  - Kitchen reviews management
  - Review aggregation
  - Per-kitchen data organization

### 5. Reviews Slice (`src/store/slices/reviewsSlice.js`)

- **Purpose**: Manages review operations
- **Features**:
  - Food reviews CRUD operations
  - User's own reviews tracking
  - Review submission states
  - Mock data for development

## Key Implementation Details

### Redux Hook Integration

- **File**: `src/hooks/useFoodDetailRedux.js`
- **Purpose**: Custom hook that wraps Redux selectors and dispatchers
- **Benefits**: Clean component integration, consistent data access patterns

### Main App Integration

- **File**: `src/main.jsx`
- **Changes**: Added Redux Provider wrapper around the entire app
- **Store Import**: Centralized store configuration

### Component Updates

- **File**: `src/pages/FoodDetailPage.jsx`
- **Changes**: Replaced direct service calls with Redux actions
- **Benefits**: Centralized state management, optimistic updates, better error handling

## Development Features

### 1. Dummy User Authentication

- **User ID**: `dummy-user-001`
- **Name**: John Doe
- **Email**: <john.doe@example.com>
- **Purpose**: Enables development without WeChat authentication setup

### 2. Mock Data Integration

- Reviews, ratings, and user interactions use mock data
- Seamless transition to real API calls when backend is ready
- Realistic development experience

### 3. Optimistic Updates

- Like/unlike actions update UI immediately
- Cart operations provide instant feedback
- Graceful error handling with rollbacks

## Usage Examples

### Authentication

```javascript
const { user, isAuthenticated } = useSelector(state => state.auth);
const dispatch = useDispatch();

// Toggle dummy authentication
dispatch(toggleDummyAuth());

// WeChat authentication (when credentials available)
dispatch(authenticateWithWeChat({ code: 'wechat_code' }));
```

### Cart Operations

```javascript
const dispatch = useDispatch();

// Add to cart
dispatch(addToCart({
  foodId: 'food-001',
  kitchenId: 'kitchen-001',
  quantity: 2,
  orderType: 'GO_GRAB'
}));

// Update quantity
dispatch(updateCartQuantity({
  foodId: 'food-001',
  kitchenId: 'kitchen-001',
  newQuantity: 3
}));
```

### Food Operations

```javascript
const dispatch = useDispatch();

// Fetch food details
dispatch(fetchFoodDetail({ foodId: 'food-001', kitchenId: 'kitchen-001' }));

// Toggle like
dispatch(toggleFoodLike('food-001'));
```

## Future Enhancements

### 1. WeChat Authentication Integration

- Replace dummy user with actual WeChat auth flow
- Update authentication thunks with real API calls
- Add user profile synchronization

### 2. Real API Integration

- Replace mock data with actual backend calls
- Add proper error handling for network issues
- Implement retry logic for failed requests

### 3. Offline Support

- Add Redux Persist for offline functionality
- Cache critical data locally
- Sync changes when back online

### 4. Performance Optimizations

- Implement memoization for complex selectors
- Add data normalization for large datasets
- Optimize re-renders with React.memo

## Testing Strategy

### 1. Unit Tests

- Test individual reducers and action creators
- Mock async thunks for predictable testing
- Validate state transitions

### 2. Integration Tests

- Test component-Redux interactions
- Validate data flow between slices
- Test error scenarios

### 3. E2E Tests

- Test complete user workflows
- Validate UI updates with state changes
- Test offline/online scenarios

## Deployment Considerations

### 1. Environment Configuration

- Development: Uses dummy data and mock APIs
- Production: Will use real WeChat auth and backend APIs
- Environment-specific Redux DevTools configuration

### 2. Performance Monitoring

- Redux state size monitoring
- Action frequency tracking
- Loading state optimization

This Redux implementation provides a solid foundation for scalable state management while maintaining the existing functionality and preparing for future enhancements like WeChat authentication.
