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
      backgroundColor: "#ffffff"
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

        // Handle multiple pages if invoice is longer than one page
        while (heightLeft >= 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          if (heightLeft >= 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
          }
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
    onBeforePrint: () => console.log("Preparing to print..."),
    onAfterPrint: () => console.log("Print completed"),
  });

  return (
    <div>
      <div ref={invoiceRef} className="invoice-preview">
        <h2>Invoice</h2>
        <p><b>Name:</b> {invoice.clientName}</p>
        <p><b>Address:</b> {invoice.address}</p>
        <p><b>Invoice No:</b> {invoice.invoiceNumber}</p>
        <p><b>Date:</b> {invoice.date}</p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td>{item.desc}</td>
                <td>{item.qty}</td>
                <td>{item.rate}</td>
                <td>{item.qty * item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Subtotal: ₹ {subtotal}</h3>
        <h3>Tax: ₹ {taxAmount}</h3>
        <h2>Total: ₹ {total}</h2>
      </div>

      <button onClick={downloadPDF}>Download PDF</button>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default InvoicePreview;