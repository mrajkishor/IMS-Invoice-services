import { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import "./invoice/invoice.css"; // Import the same CSS file for styling

interface InvoiceData {
    customerName: string;
    customerAddress: string;
    shopName: string;
    shopAddress: string;
    userEmailorMobile: string;
    invoiceId: string;
    invoiceDate: string;
    dueDate: string;
    amount: number;
}

// Dummy Data for Preview
const dummyInvoiceData: InvoiceData = {
    customerName: "Rosemary James",
    customerAddress: "123 Anywhere St., Any City, ST 12345",
    shopName: "Nimble Signals",
    shopAddress: "123 Anywhere St., Any City, ST 123145",
    userEmailorMobile: "hello@reallygreatsite.com",
    invoiceId: "1234",
    invoiceDate: "2024-05-25",
    dueDate: "2024-06-25",
    amount: 2025,
};

export default function Preview() {
    const [template, setTemplate] = useState<number>(5); // Set default template to 5 for preview
    const [invoiceUrl, setInvoiceUrl] = useState<string>("");

    // Check if window exists and set the URL
    useEffect(() => {
        if (typeof window !== "undefined") {
            setInvoiceUrl(window.location.href); // Only access `window` on the client-side
        }
    }, []);
    const renderTemplate = (invoiceData: InvoiceData) => {

        // Calculate the difference in days between the invoice date and the due date
        const invoiceDate = new Date(invoiceData.invoiceDate);
        const dueDate = new Date(invoiceData.dueDate);
        const timeDiff = dueDate.getTime() - invoiceDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

        switch (template) {
            case 5: // Stylish Sales Invoice Template (Template 5)
                return (
                    <div className="template5" id="invoiceTemplate">
                        <header className="invoice-header-5">
                            <div className="logo-container-5">
                                <img src="/path-to-your-logo.png" alt="Company Logo" className="logo-5" />
                            </div>
                            <div className="header-right-5">
                                <h1 className="invoice-title-5">SALES INVOICE</h1>
                                <p className="invoice-id-5">Issued: {invoiceData.invoiceDate}</p>
                                <p className="invoice-id-5">Invoice #{invoiceData.invoiceId}</p>
                            </div>
                        </header>

                        <section className="billing-info-5">
                            <div className="bill-to-5">
                                <h3>BILL TO:</h3>
                                <p>{invoiceData.customerName}</p>
                                <p>{invoiceData.customerAddress}</p>
                            </div>
                            <div className="payable-to-5">
                                <h3>PAYABLE TO:</h3>
                                <p>{invoiceData.shopName}</p>
                                <p>{invoiceData.userEmailorMobile}</p>
                            </div>
                        </section>

                        <section className="invoice-details-5">
                            <table className="details-table-5">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Home Internet Plan A</td>
                                        <td>1</td>
                                        <td>₹1500</td>
                                        <td>₹1500</td>
                                    </tr>
                                    <tr>
                                        <td>Installment</td>
                                        <td>1</td>
                                        <td>₹150</td>
                                        <td>₹150</td>
                                    </tr>
                                    <tr>
                                        <td>Wifi accessories ethernet products</td>
                                        <td>1</td>
                                        <td>₹100</td>
                                        <td>₹200</td>
                                    </tr>
                                    <tr>
                                        <td>Network Extender</td>
                                        <td>1</td>
                                        <td>₹100</td>
                                        <td>₹100</td>
                                    </tr>
                                    <tr>
                                        <td>Write the service or item description here</td>
                                        <td>0</td>
                                        <td>₹0</td>
                                        <td>₹0</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="total-label-5">TOTAL:</td>
                                        <td className="total-amount-5">₹{invoiceData.amount}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        <section className="invoice-section">
                            <h3>QR Code:</h3>
                            <div className="invoice-qrcode">
                                <QRCode value={invoiceUrl} size={128} />
                            </div>
                        </section>

                        <footer className="invoice-footer-5">
                            <p>Thank you for your business! For any billing concerns, please reach out to us at:</p>
                            <p>{invoiceData.shopName}, {invoiceData.shopAddress}</p>
                        </footer>
                    </div>
                );

            default:
                return <div>No Template Selected</div>;
        }
    };

    return (
        <main className="invoice-main">
            <div className="invoice-container">
                {renderTemplate(dummyInvoiceData)}
            </div>
        </main>
    );
}
