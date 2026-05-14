import React, { useState, useEffect, useMemo } from "react";
import {
  getAllKitchensWithFoodItems,
  getFoodCategories,
} from "../../services/foodService";
import "./AdminDashboard.css";

const buildCategoryLabel = (foodCategory, categoryNameMap) => {
  if (!foodCategory) return "Uncategorized";
  const ids = foodCategory
    .toString()
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  if (ids.length === 0) return "Uncategorized";
  return ids
    .map((id) => categoryNameMap[id] || `Category ${id}`)
    .join(", ");
};

export default function AdminItemsTab() {
  const [kitchensData, setKitchensData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedKitchenId, setSelectedKitchenId] = useState("ALL");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("ALL"); // ALL | AVAILABLE | SOLD_OUT | INACTIVE
  const [orderTypeFilter, setOrderTypeFilter] = useState("ALL"); // ALL | PICKUP | DELIVERY
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("default"); // default | name_asc | name_desc | price_asc | price_desc | available_desc | sold_desc
  const [onlyActive, setOnlyActive] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyWithImage, setOnlyWithImage] = useState(false);
  const [onlyGroupOrder, setOnlyGroupOrder] = useState(false);
  // ✅ Pickup Now eligibility filter: matches items with food.stock > 0.
  // Defaults to false so existing flows render every item as before.
  const [onlyPickupNow, setOnlyPickupNow] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedItems, setExpandedItems] = useState({});

  const clearFilters = () => {
    setSelectedKitchenId("ALL");
    setSelectedCategoryId("ALL");
    setSearchTerm("");
    setAvailabilityStatus("ALL");
    setOrderTypeFilter("ALL");
    setPriceMin("");
    setPriceMax("");
    setSortBy("default");
    setOnlyActive(false);
    setOnlyFeatured(false);
    setOnlyWithImage(false);
    setOnlyGroupOrder(false);
    setOnlyPickupNow(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [kitchensWithFoods, cats] = await Promise.all([
          getAllKitchensWithFoodItems(100),
          getFoodCategories(),
        ]);
        setKitchensData(kitchensWithFoods);
        setCategories(cats);
        setError(null);
      } catch (err) {
        console.error("[AdminItemsTab] Error fetching data:", err);
        setError("Failed to load kitchen items.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const categoryNameMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[String(cat.id)] = cat.name;
    });
    return map;
  }, [categories]);

  const kitchenOptions = useMemo(() => {
    return kitchensData
      .map(({ kitchen }) => ({
        id: kitchen.id,
        name: kitchen.name || "Unnamed Kitchen",
      }))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [kitchensData]);

  const filteredKitchens = useMemo(() => {
    let result = kitchensData;

    if (selectedKitchenId !== "ALL") {
      result = result.filter(({ kitchen }) => kitchen.id === selectedKitchenId);
    }

    const term = searchTerm.trim().toLowerCase();
    const minPriceNum = priceMin === "" ? null : parseFloat(priceMin);
    const maxPriceNum = priceMax === "" ? null : parseFloat(priceMax);

    const matchesCategory = (food) => {
      if (selectedCategoryId === "ALL") return true;
      const ids = (food.foodCategory || "")
        .toString()
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      return ids.includes(String(selectedCategoryId));
    };

    const matchesAvailability = (food) => {
      if (availabilityStatus === "ALL") return true;
      const numAvailable =
        food.availability?.numAvailable || food.numAvailable || 0;
      if (availabilityStatus === "INACTIVE") return !!food.deActiveItem;
      if (food.deActiveItem) return false;
      if (availabilityStatus === "AVAILABLE") return numAvailable > 0;
      if (availabilityStatus === "SOLD_OUT") return numAvailable <= 0;
      return true;
    };

    const matchesOrderType = (food) => {
      if (orderTypeFilter === "ALL") return true;
      if (orderTypeFilter === "PICKUP") return food.orderType === 0;
      if (orderTypeFilter === "DELIVERY") return food.orderType === 1;
      return true;
    };

    const matchesPrice = (food) => {
      const cost = parseFloat(food.cost);
      if (isNaN(cost)) return minPriceNum === null && maxPriceNum === null;
      if (minPriceNum !== null && cost < minPriceNum) return false;
      if (maxPriceNum !== null && cost > maxPriceNum) return false;
      return true;
    };

    const sortFoods = (foods) => {
      const arr = [...foods];
      switch (sortBy) {
        case "name_asc":
          return arr.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, {
              sensitivity: "base",
            })
          );
        case "name_desc":
          return arr.sort((a, b) =>
            (b.name || "").localeCompare(a.name || "", undefined, {
              sensitivity: "base",
            })
          );
        case "price_asc":
          return arr.sort(
            (a, b) => (parseFloat(a.cost) || 0) - (parseFloat(b.cost) || 0)
          );
        case "price_desc":
          return arr.sort(
            (a, b) => (parseFloat(b.cost) || 0) - (parseFloat(a.cost) || 0)
          );
        case "available_desc":
          return arr.sort(
            (a, b) =>
              (b.availability?.numAvailable || b.numAvailable || 0) -
              (a.availability?.numAvailable || a.numAvailable || 0)
          );
        case "sold_desc":
          return arr.sort(
            (a, b) =>
              (b.availability?.numOfSoldItem || b.numOfSoldItem || 0) -
              (a.availability?.numOfSoldItem || a.numOfSoldItem || 0)
          );
        case "stock_desc":
          return arr.sort(
            (a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0)
          );
        default:
          return arr;
      }
    };

    return result
      .map(({ kitchen, foods }) => {
        let filteredFoods = foods;

        if (onlyActive) {
          filteredFoods = filteredFoods.filter((f) => !f.deActiveItem);
        }
        if (onlyFeatured) {
          filteredFoods = filteredFoods.filter((f) => !!f.isFeatured);
        }
        if (onlyWithImage) {
          filteredFoods = filteredFoods.filter(
            (f) => f.imageUrl && String(f.imageUrl).trim() !== ""
          );
        }
        if (onlyGroupOrder) {
          filteredFoods = filteredFoods.filter(
            (f) => (f.minByGroup || 0) > 0
          );
        }
        if (onlyPickupNow) {
          filteredFoods = filteredFoods.filter(
            (f) => (Number(f.stock) || 0) > 0
          );
        }

        filteredFoods = filteredFoods
          .filter(matchesCategory)
          .filter(matchesAvailability)
          .filter(matchesOrderType)
          .filter(matchesPrice);

        if (term) {
          filteredFoods = filteredFoods.filter((f) => {
            const haystack = [
              f.name,
              f.description,
              f.foodType,
              buildCategoryLabel(f.foodCategory, categoryNameMap),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();
            return haystack.includes(term);
          });
        }

        return { kitchen, foods: sortFoods(filteredFoods) };
      })
      .filter(({ foods }) => foods.length > 0);
  }, [
    kitchensData,
    selectedKitchenId,
    selectedCategoryId,
    searchTerm,
    availabilityStatus,
    orderTypeFilter,
    priceMin,
    priceMax,
    sortBy,
    onlyActive,
    onlyFeatured,
    onlyWithImage,
    onlyGroupOrder,
    onlyPickupNow,
    categoryNameMap,
  ]);

  const totalItems = useMemo(() => {
    return filteredKitchens.reduce((sum, { foods }) => sum + foods.length, 0);
  }, [filteredKitchens]);

  const totalAllItems = useMemo(() => {
    return kitchensData.reduce((sum, { foods }) => sum + foods.length, 0);
  }, [kitchensData]);

  const toggleGroup = (kitchenId) => {
    setExpandedGroups((prev) => ({ ...prev, [kitchenId]: !prev[kitchenId] }));
  };

  const toggleItem = (itemKey) => {
    setExpandedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  if (loading) {
    return (
      <div className="admin-loading" style={{ marginTop: 40 }}>
        <div className="admin-spinner" />
        <div className="admin-loading-text">Loading kitchen items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-empty" style={{ marginTop: 40 }}>
        <div className="admin-empty-icon">⚠️</div>
        <div className="admin-empty-text">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20 }}>
      {/* Stats Row */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Kitchens</div>
          <div className="admin-stat-value">{kitchensData.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Items</div>
          <div className="admin-stat-value">{totalAllItems}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Showing</div>
          <div className="admin-stat-value highlight">{totalItems}</div>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <FilterField label="Kitchen">
            <FilterSelect
              value={selectedKitchenId}
              onChange={(e) => setSelectedKitchenId(e.target.value)}
            >
              <option value="ALL">All Kitchens</option>
              {kitchenOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </FilterSelect>
          </FilterField>

          <FilterField label="Category">
            <FilterSelect
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories
                .slice()
                .sort((a, b) =>
                  (a.name || "").localeCompare(b.name || "")
                )
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </FilterSelect>
          </FilterField>

          <FilterField label="Availability">
            <FilterSelect
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="AVAILABLE">Available</option>
              <option value="SOLD_OUT">Sold out</option>
              <option value="INACTIVE">Inactive</option>
            </FilterSelect>
          </FilterField>

          <FilterField label="Order Type">
            <FilterSelect
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="PICKUP">Pickup</option>
              <option value="DELIVERY">Delivery</option>
            </FilterSelect>
          </FilterField>

          <FilterField label="Sort By">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="name_asc">Name (A–Z)</option>
              <option value="name_desc">Name (Z–A)</option>
              <option value="price_asc">Price (Low–High)</option>
              <option value="price_desc">Price (High–Low)</option>
              <option value="available_desc">Most Available</option>
              <option value="sold_desc">Most Sold</option>
              <option value="stock_desc">Most Stock (Pickup Now)</option>
            </FilterSelect>
          </FilterField>

          <FilterField label="Min Price">
            <FilterInput
              type="number"
              inputMode="decimal"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="0"
            />
          </FilterField>

          <FilterField label="Max Price">
            <FilterInput
              type="number"
              inputMode="decimal"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="∞"
            />
          </FilterField>
        </div>

        <div style={{ marginTop: 12 }}>
          <FilterField label="Search">
            <FilterInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description, category, cuisine..."
            />
          </FilterField>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
          }}
        >
          <label className="admin-filter-toggle">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Only active
          </label>
          <label className="admin-filter-toggle">
            <input
              type="checkbox"
              checked={onlyFeatured}
              onChange={(e) => setOnlyFeatured(e.target.checked)}
            />
            Featured only
          </label>
          <label className="admin-filter-toggle">
            <input
              type="checkbox"
              checked={onlyWithImage}
              onChange={(e) => setOnlyWithImage(e.target.checked)}
            />
            Has image
          </label>
          <label className="admin-filter-toggle">
            <input
              type="checkbox"
              checked={onlyGroupOrder}
              onChange={(e) => setOnlyGroupOrder(e.target.checked)}
            />
            Group order (minByGroup &gt; 0)
          </label>
          <label
            className="admin-filter-toggle"
            style={{ color: "#3fb950" }}
            title="Items with on-hand stock available for Pickup Now sales"
          >
            <input
              type="checkbox"
              checked={onlyPickupNow}
              onChange={(e) => setOnlyPickupNow(e.target.checked)}
            />
            Pickup Now (stock &gt; 0)
          </label>

          <button
            type="button"
            onClick={clearFilters}
            style={{
              marginLeft: "auto",
              padding: "6px 14px",
              background: "none",
              border: "1px solid #30363d",
              color: "#8b949e",
              borderRadius: 8,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#f85149";
              e.currentTarget.style.color = "#f85149";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#30363d";
              e.currentTarget.style.color = "#8b949e";
            }}
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Kitchen Groups */}
      <div style={{ marginTop: 20 }}>
        {filteredKitchens.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🍽️</div>
            <div className="admin-empty-text">
              No kitchen items match your filters.
            </div>
          </div>
        ) : (
          filteredKitchens.map(({ kitchen, foods }) => {
            const isExpanded = expandedGroups[kitchen.id] !== false; // default open

            return (
              <div
                key={kitchen.id}
                style={{
                  marginBottom: "20px",
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                }}
              >
                <div
                  className="admin-section-header"
                  style={{
                    padding: "12px 16px",
                    margin: 0,
                    cursor: "pointer",
                    background: "rgba(13, 17, 23, 0.5)",
                    borderRadius: "8px 8px 0 0",
                  }}
                  onClick={() => toggleGroup(kitchen.id)}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    <h2
                      className="admin-section-title"
                      style={{ margin: 0, fontSize: "16px" }}
                    >
                      {kitchen.name || "Unnamed Kitchen"}
                      <span className="admin-section-count">
                        {foods.length}
                      </span>
                    </h2>
                  </div>
                  <div style={{ fontSize: 12, color: "#6e7681" }}>
                    {kitchen.city || ""} {kitchen.cuisine ? `· ${kitchen.cuisine}` : ""}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: 12,
                      }}
                    >
                      {foods.map((food) => {
                        const itemKey = `${kitchen.id}-${food.id}`;
                        const isItemExpanded = !!expandedItems[itemKey];
                        const catLabel = buildCategoryLabel(
                          food.foodCategory,
                          categoryNameMap
                        );
                        const numAvailable =
                          food.availability?.numAvailable ||
                          food.numAvailable ||
                          0;
                        const numSold =
                          food.availability?.numOfSoldItem ||
                          food.numOfSoldItem ||
                          0;
                        const rating =
                          food.engagement?.rating || food.rating || 0;
                        const numLikes =
                          food.engagement?.numOfLike || food.numOfLike || 0;
                        // ✅ On-hand stock (drives Pickup Now eligibility). 0
                        // for legacy / non-Pickup-Now items so the badge only
                        // surfaces where it's meaningful.
                        const stockCount = Number(food.stock) || 0;
                        const isPickupNowEligible = stockCount > 0;
                        const variableWeightOn =
                          food.variableWeight === 1 ||
                          food.variableWeight === true;
                        const poundsInOneOrder =
                          Number(food.poundsInOneOrder) || 0;
                        const stockDisplay =
                          variableWeightOn && poundsInOneOrder > 0
                            ? `${stockCount * poundsInOneOrder} lb`
                            : `${stockCount}`;

                        return (
                          <div
                            key={itemKey}
                            style={{
                              background: "#0d1117",
                              border: "1px solid #30363d",
                              borderRadius: 10,
                              overflow: "hidden",
                              transition: "border-color 0.2s",
                            }}
                          >
                            <div
                              onClick={() => toggleItem(itemKey)}
                              style={{
                                cursor: "pointer",
                                display: "flex",
                                gap: 12,
                                padding: 12,
                                alignItems: "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  width: 72,
                                  height: 72,
                                  borderRadius: 8,
                                  overflow: "hidden",
                                  background: "#161b22",
                                  flexShrink: 0,
                                }}
                              >
                                {food.imageUrl ? (
                                  <img
                                    src={food.imageUrl}
                                    alt={food.name}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#6e7681",
                                      fontSize: 24,
                                    }}
                                  >
                                    🍽️
                                  </div>
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#e1e4e8",
                                      fontWeight: 600,
                                      fontSize: 14,
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {food.name || "(Unnamed item)"}
                                  </div>
                                  <div
                                    style={{
                                      color: "#3fb950",
                                      fontWeight: 700,
                                      fontSize: 14,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ${food.cost ?? "—"}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    color: "#8b949e",
                                    fontSize: 12,
                                    marginTop: 4,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {food.description || "No description"}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 8,
                                    marginTop: 6,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <span
                                    style={{
                                      background: "rgba(139, 148, 158, 0.15)",
                                      color: "#8b949e",
                                      padding: "2px 8px",
                                      borderRadius: 6,
                                      fontSize: 11,
                                    }}
                                  >
                                    {catLabel}
                                  </span>
                                  {food.deActiveItem ? (
                                    <span
                                      style={{
                                        background: "rgba(248, 81, 73, 0.15)",
                                        color: "#f85149",
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                      }}
                                    >
                                      Inactive
                                    </span>
                                  ) : numAvailable > 0 ? (
                                    <span
                                      style={{
                                        background: "rgba(63, 185, 80, 0.15)",
                                        color: "#3fb950",
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                      }}
                                    >
                                      {numAvailable} available
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        background: "rgba(210, 153, 34, 0.15)",
                                        color: "#d29922",
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                      }}
                                    >
                                      Sold out
                                    </span>
                                  )}
                                  {isPickupNowEligible && (
                                    <span
                                      title="Item carries on-hand stock and is sellable as Pickup Now"
                                      style={{
                                        background: "rgba(63, 185, 80, 0.18)",
                                        color: "#3fb950",
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        fontSize: 11,
                                        fontWeight: 600,
                                      }}
                                    >
                                      🛒 Pickup Now · {stockDisplay}
                                    </span>
                                  )}
                                  <span
                                    style={{
                                      color: "#6e7681",
                                      fontSize: 11,
                                      marginLeft: "auto",
                                    }}
                                  >
                                    {isItemExpanded ? "▲ Hide" : "▼ Details"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {isItemExpanded && (
                              <div
                                style={{
                                  borderTop: "1px solid #30363d",
                                  background: "rgba(13, 17, 23, 0.5)",
                                  padding: 14,
                                  fontSize: 13,
                                  color: "#c9d1d9",
                                }}
                              >
                                {food.imageUrl && (
                                  <img
                                    src={food.imageUrl}
                                    alt={food.name}
                                    style={{
                                      width: "100%",
                                      maxHeight: 220,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                      marginBottom: 12,
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                )}

                                <DetailRow label="Food ID" value={food.id} mono />
                                <DetailRow
                                  label="Kitchen"
                                  value={`${kitchen.name || "—"} (${kitchen.id})`}
                                />
                                <DetailRow
                                  label="Description"
                                  value={food.description || "—"}
                                />
                                <DetailRow
                                  label="Price"
                                  value={`$${food.cost ?? "—"}`}
                                />
                                <DetailRow
                                  label="Category"
                                  value={catLabel}
                                />
                                {food.foodType && (
                                  <DetailRow
                                    label="Cuisine"
                                    value={food.foodType}
                                  />
                                )}
                                <DetailRow
                                  label="Order Type"
                                  value={
                                    food.orderType === 1
                                      ? "Delivery"
                                      : food.orderType === 0
                                        ? "Pickup"
                                        : "—"
                                  }
                                />
                                <DetailRow
                                  label="Available"
                                  value={numAvailable}
                                />
                                <DetailRow
                                  label="Sold"
                                  value={numSold}
                                />
                                <DetailRow
                                  label="Stock (Pickup Now)"
                                  value={
                                    isPickupNowEligible
                                      ? `${stockDisplay} · ${stockCount} unit${stockCount === 1 ? "" : "s"}`
                                      : "—"
                                  }
                                />
                                {variableWeightOn && (
                                  <DetailRow
                                    label="Pounds / Order"
                                    value={poundsInOneOrder || "—"}
                                  />
                                )}
                                {food.minByGroup != null && (
                                  <DetailRow
                                    label="Min by Group"
                                    value={food.minByGroup}
                                  />
                                )}
                                <DetailRow
                                  label="Active"
                                  value={food.deActiveItem ? "No" : "Yes"}
                                />
                                <DetailRow
                                  label="Featured"
                                  value={food.isFeatured ? "Yes" : "No"}
                                />
                                {rating > 0 && (
                                  <DetailRow
                                    label="Rating"
                                    value={`${rating} ⭐`}
                                  />
                                )}
                                {numLikes > 0 && (
                                  <DetailRow
                                    label="Likes"
                                    value={numLikes}
                                  />
                                )}

                                <div style={{ marginTop: 10 }}>
                                  <a
                                    href={`/share?kitchenId=${kitchen.id}&foodId=${food.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color: "#58a6ff",
                                      fontSize: 13,
                                      textDecoration: "none",
                                    }}
                                  >
                                    Open customer view →
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          color: "#8b949e",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

const fieldStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #30363d",
  background: "#0d1117",
  color: "#c9d1d9",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function FilterSelect({ children, ...props }) {
  return (
    <select {...props} style={fieldStyle}>
      {children}
    </select>
  );
}

function FilterInput(props) {
  return <input {...props} style={fieldStyle} />;
}

function DetailRow({ label, value, mono = false }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "4px 0",
        borderBottom: "1px solid rgba(48, 54, 61, 0.3)",
      }}
    >
      <div
        style={{
          color: "#6e7681",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          minWidth: 110,
          paddingTop: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#c9d1d9",
          fontSize: 13,
          flex: 1,
          wordBreak: "break-word",
          fontFamily: mono
            ? "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace"
            : "inherit",
        }}
      >
        {value}
      </div>
    </div>
  );
}
