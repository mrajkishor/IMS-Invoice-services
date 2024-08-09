import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AWS from 'aws-sdk';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WhatsappShareButton } from 'next-share';
import QRCode from 'qrcode.react'; // Import the QRCode component
import "./Invoice.css"; // Import the CSS file for styling

// Initialize AWS DynamoDB client
AWS.config.update({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

interface InvoiceData {
    invoiceId: string;
    details: string;
    amount: number;
    // Add other properties based on your DynamoDB schema
}

export default function Invoice() {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [template, setTemplate] = useState<number>(1);

    useEffect(() => {
        if (id) {
            fetchInvoiceData(id);
        }
    }, [id]);

    const fetchInvoiceData = async (invoiceId: string) => {
        const params = {
            TableName: "Invoices",
            Key: {
                invoiceId: invoiceId
            }
        };

        try {
            const data = await dynamoDB.get(params).promise();
            setInvoiceData(data.Item as InvoiceData);
        } catch (error) {
            console.error("Error fetching invoice data:", error);
        }
    };

    const downloadPDF = async () => {
        const element = document.getElementById('invoiceTemplate');
        if (element) {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 295; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`invoice_${id}.pdf`);
        }
    };

    const renderTemplate = () => {
        if (!invoiceData) {
            return null;
        }

        const invoiceUrl = window.location.href; // Get the current URL for the QR code

        switch (template) {
            case 1:
                return (
                    <div className="template1" id="invoiceTemplate">
                        <header className="invoice-header">
                            <div>
                                <h1 className="invoice-title">Invoice</h1>
                                <p className="invoice-id">Invoice ID #{invoiceData.invoiceId}</p>
                            </div>
                            <div className="invoice-company">
                                <h2>Your Company Name</h2>
                                <p>123 Your Street, City, Country</p>
                                <p>your.email@example.com</p>
                            </div>
                        </header>

                        <section className="invoice-section">
                            <h3>Billed To:</h3>
                            {/* Uncomment and use when customer data is available */}
                            <p>{"invoiceData.customerName"}</p>
                            <p>{"invoiceData.customerAddress"}</p>
                        </section>

                        <section className="invoice-section">
                            <h3>Invoice Details:</h3>
                            <div className="invoice-details">
                                <p><strong>Details:</strong> {invoiceData.details}</p>
                                <p><strong>Amount:</strong> ${invoiceData.amount}</p>
                                {/* Uncomment and use when additional data is available */}
                                <p><strong>Due Date:</strong> {"invoiceData.dueDate"}</p>
                                <p><strong>Status:</strong> {"invoiceData.status"}</p>
                            </div>
                        </section>

                        <section className="invoice-section">
                            <h3>QR Code:</h3>
                            <div className="invoice-qrcode">
                                <QRCode value={invoiceUrl} size={128} /> {/* QR code */}
                            </div>
                        </section>

                        <footer className="invoice-footer">
                            <p>Thank you for your business!</p>
                            {/* Remove this line if no due dates or paid immediately */}
                            <p>Payment is due within 15 days</p>
                            <p>Please make checks payable to: Your Company Name</p>
                        </footer>
                    </div>
                );
            case 2:
                return (
                    <div className="template2">
                        {/* Different design for Template 2 */}
                    </div>
                );
            // Add more cases for other templates
            default:
                return <div>Invalid Template</div>;
        }
    };

    return (
        <main className="invoice-main">
            <div className="invoice-container">
                {invoiceData ? (
                    <>
                        {renderTemplate()}
                        <div className="invoice-actions">
                            <button
                                onClick={downloadPDF}
                                className="btn btn-download"
                            >
                                Download as PDF
                            </button>
                            <WhatsappShareButton
                                url={window.location.href}
                                title={`Check out this invoice #${invoiceData.invoiceId}`}
                            >
                                <button className="btn btn-share">
                                    Share via WhatsApp
                                </button>
                            </WhatsappShareButton>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </main>
    );
}
