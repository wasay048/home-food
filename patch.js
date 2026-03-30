const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminOrdersTab.jsx', 'utf8');

// 1. Add state variables before the grouping options
content = content.replace(
  'const [groupBy, setGroupBy] = useState("kitchen");',
  `// Specific Item-Level filters\n  const [filterCat8, setFilterCat8] = useState(false);\n  const [filterStatus, setFilterStatus] = useState("inprogress");\n  const [filterDate, setFilterDate] = useState("01/01/2000");\n\n  // Grouping options\n  const [groupBy, setGroupBy] = useState("kitchen");`
);

// 2. Add filtering block and replace instances of "orders.forEach" inside groupedOrders
let groupedOrdersStart = content.indexOf('const groupedOrders = useMemo(() => {');
let groupedOrdersEnd = content.indexOf('}, [orders, groupBy]);');

let groupedOrdersBlock = content.substring(groupedOrdersStart, groupedOrdersEnd + '}, [orders, groupBy]);'.length);

let newGroupedOrdersBlock = groupedOrdersBlock.replace(
  'if (groupBy === "kitchen") {',
  `let processedOrders = orders;

    if (filterCat8) {
      processedOrders = orders.map((order) => {
        const matchedItems = order.orderedFoodItems?.filter((item) => {
          const maxCat = getMaxCategoryId(item.foodCategory);
          if (maxCat !== "Category 8") return false;

          const itemStatus = (item.orderStatus || order.orderStatus || "")
            .toLowerCase()
            .replace(/\\s/g, "");
          const matchStatus = filterStatus.toLowerCase().replace(/\\s/g, "");
          if (matchStatus && !itemStatus.includes(matchStatus)) return false;

          const pDate = item.pickDateString || item.pickupDate || item.dateString;
          if (filterDate && pDate !== filterDate) return false;

          return true;
        });

        if (matchedItems && matchedItems.length > 0) {
          return { ...order, orderedFoodItems: matchedItems };
        }
        return null;
      }).filter(Boolean);
    }

    if (groupBy === "kitchen") {`
).split('orders.forEach((order) => {').join('processedOrders.forEach((order) => {')
 .replace('}, [orders, groupBy]);', '}, [orders, groupBy, filterCat8, filterStatus, filterDate]);');

content = content.replace(groupedOrdersBlock, newGroupedOrdersBlock);

let filtersDivStart = content.indexOf('<div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>');
let resultCountStart = content.indexOf('<span className="admin-result-count">');

let filtersBlock = content.substring(filtersDivStart, resultCountStart);

let newControls = `<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ color: "#8b949e", fontSize: "14px" }}>Group By:</span>
            <button
              className={\`admin-tab \${groupBy === "kitchen" ? "active" : ""}\`}
              onClick={() => setGroupBy("kitchen")}
              style={{ margin: 0, padding: "6px 12px", minWidth: "auto" }}
            >
              Kitchen
            </button>
            <button
              className={\`admin-tab \${groupBy === "kitchen-category" ? "active" : ""}\`}
              onClick={() => setGroupBy("kitchen-category")}
              style={{ margin: 0, padding: "6px 12px", minWidth: "auto" }}
            >
              Kitchen &rarr; Category
            </button>
            <button
              className={\`admin-tab \${groupBy === "category" ? "active" : ""}\`}
              onClick={() => setGroupBy("category")}
              style={{ margin: 0, padding: "6px 12px", minWidth: "auto" }}
            >
              Category
            </button>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#c9d1d9", fontSize: "14px", cursor: "pointer", marginRight: "10px" }}>
              <input 
                type="checkbox" 
                checked={filterCat8} 
                onChange={(e) => setFilterCat8(e.target.checked)} 
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              Filter Category 8: "In Progress" & Date
            </label>
            
            {filterCat8 && (
              <>
                <input 
                  type="text" 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)} 
                  placeholder="Status (e.g. inprogress)"
                  style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #30363d", background: "#0d1117", color: "#c9d1d9", fontSize: "13px", outline: "none" }}
                />
                <input 
                  type="text" 
                  value={filterDate} 
                  onChange={(e) => setFilterDate(e.target.value)} 
                  placeholder="Date (e.g. 01/01/2000)"
                  style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid #30363d", background: "#0d1117", color: "#c9d1d9", fontSize: "13px", outline: "none" }}
                />
              </>
            )}
          </div>
        </div>`;


content = content.replace(filtersBlock, newControls + '\n        ');

fs.writeFileSync('src/pages/admin/AdminOrdersTab.jsx', content);

