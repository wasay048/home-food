const orders = []; // fake orders
const getMaxCategoryId = (foodCategory) => {
  if (!foodCategory) return "Uncategorized";
  const categories = foodCategory
    .toString()
    .split(",")
    .map((c) => parseInt(c.trim(), 10));
  const max = Math.max(...categories.filter((c) => !isNaN(c)), 0);
  return max > 0 ? `Category ${max}` : "Uncategorized";
};
