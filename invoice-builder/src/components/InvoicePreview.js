import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

const InvoicePreview = ({ invoice, subtotal, taxAmount, total }) => {
  const invoiceRef = useRef();

  const downloadPDF = () => {
    if (!invoiceRef.current) {
      alert("Error: Invoice preview not found");
      return;
    }

    html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true
    }).then((canvas) => {
      try {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multiple pages if invoice is longer than one page
        while (heightLeft >= 0) {
          pdf.addPage();
          position = heightLeft - imgHeight;
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("invoice.pdf");
      } catch (error) {
        alert("Error generating PDF: " + error.message);
      }
    }).catch((error) => {
      alert("Error capturing invoice: " + error.message);
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: "Invoice",
    onSuccess: () => console.log("Print completed")
  });

  return (
    <div>
      <div ref={invoiceRef} className="invoice-preview">
        <h2>Invoice</h2>
        <p><b>Client Name:</b> {invoice.clientName || "N/A"}</p>
        <p><b>Address:</b> {invoice.address || "N/A"}</p>
        <p><b>Invoice No:</b> {invoice.invoiceNumber}</p>
        <p><b>Date:</b> {invoice.date}</p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.length > 0 ? (
              invoice.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.desc || "N/A"}</td>
                  <td>{item.qty}</td>
                  <td>₹ {item.rate}</td>
                  <td>₹ {(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No items added</td>
              </tr>
            )}
          </tbody>
        </table>

        <h3>Subtotal: ₹ {subtotal.toFixed(2)}</h3>
        <h3>Tax ({invoice.tax}%): ₹ {taxAmount.toFixed(2)}</h3>
        <h2>Total: ₹ {total.toFixed(2)}</h2>
      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button onClick={downloadPDF} style={{ marginRight: "10px" }}> Download PDF</button>
        <button onClick={handlePrint}> Print</button>
      </div>
    </div>
  );
};

export default InvoicePreview;