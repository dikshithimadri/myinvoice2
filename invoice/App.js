import React, { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoicePreview from "./components/InvoicePreview";
import "./App.css";

function App() {
  const [invoice, setInvoice] = useState({
    clientName: "",
    address: "",
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().substring(0, 10),
    items: [],
    tax: 5,
  });

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { desc: "", qty: 1, rate: 0 }],
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const deleteItem = (index) => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice({ ...invoice, items: updatedItems });
  };

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.qty * item.rate,
    0
  );

  const taxAmount = (subtotal * invoice.tax) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="container">
      <h1>ABC's KITCHEN</h1>

      <InvoiceForm
        invoice={invoice}
        setInvoice={setInvoice}
        addItem={addItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
      />

      <InvoicePreview
        invoice={invoice}
        subtotal={subtotal}
        taxAmount={taxAmount}
        total={total}
      />
    </div>
  );
}

export default App;