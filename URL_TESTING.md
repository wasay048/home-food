# URL Testing Guide for HomeFoods

Test both URL patterns to ensure the FoodDetailPage works correctly:

## Test URLs

### 1. Go&Grab (No date parameter)

```
http://localhost:5174/share?kitchenId=MRbF5in13qSx2RSV2Et9&foodId=qPYmipQLbQeahPAtOBhg
```

### 2. PreOrder (With date parameter)

```
http://localhost:5174/share?kitchenId=MRbF5in13qSx2RSV2Et9&foodId=qPYmipQLbQeahPAtOBhg&date=8/22/2025
```

### 3. Traditional route (still works)

```
http://localhost:5174/food/MRbF5in13qSx2RSV2Et9/qPYmipQLbQeahPAtOBhg
```

### 4. Traditional route with date

```
http://localhost:5174/food/MRbF5in13qSx2RSV2Et9/qPYmipQLbQeahPAtOBhg?date=8/22/2025
```

## What to Check

1. **Console Logs**: Check browser console for extracted parameters
2. **Order Type Display**: Should show "Go & Grab" or "Pre-Order" based on date presence
3. **Data Loading**: Food and kitchen data should load correctly
4. **Error Handling**: Invalid URLs should show error message
5. **Design**: UI should remain unchanged

## Implementation Details

The FoodDetailPage now:

- Detects URL pattern (`/share` vs `/food/:kitchenId/:foodId`)
- Extracts parameters from appropriate source (query params vs URL params)
- Validates required parameters (kitchenId, foodId)
- Shows error page for missing parameters
- Maintains all existing functionality and design
