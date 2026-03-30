import React from "react";
import ItemRow from "./ItemRow";

const InvoiceForm = ({
  invoice,
  setInvoice,
  addItem,
  updateItem,
  deleteItem,
}) => {
  return (
    <div className="form">
      <h2>Invoice Details</h2>

      <input
        placeholder="Client Name"
        value={invoice.clientName}
        onChange={(e) =>
          setInvoice({ ...invoice, clientName: e.target.value })
        }
      />

      <input
        placeholder="Address"
        value={invoice.address}
        onChange={(e) =>
          setInvoice({ ...invoice, address: e.target.value })
        }
      />

      <input
        placeholder="Invoice Number"
        value={invoice.invoiceNumber}
        onChange={(e) =>
          setInvoice({ ...invoice, invoiceNumber: e.target.value })
        }
      />

      <input
        type="date"
        value={invoice.date}
        onChange={(e) =>
          setInvoice({ ...invoice, date: e.target.value })
        }
      />

      <h3>Items</h3>

      {invoice.items.map((item, index) => (
        <ItemRow
          key={index}
          item={item}
          index={index}
          updateItem={updateItem}
          deleteItem={deleteItem}
        />
      ))}

      <button onClick={addItem}>+ Add Item</button>

      <label>GST Tax %</label>
      <input
        type="number"
        value={invoice.tax}
        onChange={(e) =>
          setInvoice({ ...invoice, tax: parseFloat(e.target.value) || 0 })
        }
      />
    </div>
  );
};

export default InvoiceForm;