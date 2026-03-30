import React from "react";

const ItemRow = ({ item, index, updateItem, deleteItem }) => {
  return (
    <div className="item-row">
      <input
        placeholder="Description"
        value={item.desc}
        onChange={(e) => updateItem(index, "desc", e.target.value)}
      />

      <input
        type="number"
        value={item.qty}
        onChange={(e) => updateItem(index, "qty", parseFloat(e.target.value) || 0)}
      />

      <input
        type="number"
        value={item.rate}
        onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
      />

      <span>₹ {item.qty * item.rate}</span>

      <button onClick={() => deleteItem(index)}>Delete</button>
    </div>
  );
};

export default ItemRow;