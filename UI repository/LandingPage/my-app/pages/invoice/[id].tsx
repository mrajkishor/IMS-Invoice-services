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
    userId: string;
    shopId: string;
    invoiceId: string;
    details: string;
    amount: number;
    customerName: string;
    customerAddress: string;
    invoiceDate: string;
    dueDate: string;
    status: string;
    shopName?: string;
    shopAddress?: string;
    userEmail?: string;
    templateId?: string;
    // other properties based on your DynamoDB schema
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
            const invoice = data.Item as InvoiceData;

            // Fetch the shop details
            const shopData = await fetchShopData(invoice.shopId);
            const customerData = await fetchCustomerData(invoice.userId);

            setInvoiceData({
                ...invoice,
                shopName: shopData.shopName,
                shopAddress: shopData.shopAddress,
                userEmail: customerData.userEmail,
            });
            setTemplate(Number(invoice.templateId));
        } catch (error) {
            console.error("Error fetching invoice data:", error);
        }
    };

    const fetchShopData = async (shopId: string) => {
        const params = {
            TableName: "Shops",
            Key: {
                shopId: shopId
            }
        };

        try {
            const data = await dynamoDB.get(params).promise();
            return {
                shopName: data?.Item?.shopName || "Unknown Shop",
                shopAddress: data?.Item?.address || "Unknown Address",
            };
        } catch (error) {
            console.error("Error fetching shop data:", error);
            return { shopName: "Unknown Shop", shopAddress: "Unknown Address" };
        }
    };

    const fetchCustomerData = async (userId: string) => {
        const params = {
            TableName: "Customers",
            Key: {
                userId: userId
            }
        };

        try {
            const data = await dynamoDB.get(params).promise();
            return {
                userEmail: data?.Item?.email || "Unknown Email",
            };
        } catch (error) {
            console.error("Error fetching customer data:", error);
            return { userEmail: "Unknown Email" };
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

        // Calculate the difference in days between the invoice date and the due date
        const invoiceDate = new Date(invoiceData.invoiceDate);
        const dueDate = new Date(invoiceData.dueDate);
        const timeDiff = dueDate.getTime() - invoiceDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

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
                                <h2>{invoiceData.shopName}</h2>  {/* Display shop name */}
                                <p>{invoiceData.shopAddress}</p>  {/* Display shop address */}
                                <p>{invoiceData.userEmail}</p>    {/* Display user email */}
                            </div>
                        </header>

                        <section className="invoice-section">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.customerName}</p>
                            <p>{invoiceData.customerAddress}</p>
                        </section>

                        <section className="invoice-section">
                            <h3>Invoice Details:</h3>
                            <div className="invoice-details">
                                <p><strong>Details:</strong> {invoiceData.details}</p>
                                <p><strong>Amount:</strong> Rs.{invoiceData.amount}</p>
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDate}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                            </div>
                        </section>

                        <section className="invoice-section">
                            <h3>QR Code:</h3>
                            <div className="invoice-qrcode">
                                <QRCode value={invoiceUrl} size={128} />
                            </div>
                        </section>

                        <footer className="invoice-footer">
                            <p>Thank you for your business!</p>
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );
            case 2: // Modern Template
                return (
                    <div className="template-modern" id="invoiceTemplate">
                        <header className="invoice-header-modern">
                            <div>
                                <h1 className="invoice-title-modern">Invoice</h1>
                                <p className="invoice-id-modern">Invoice ID #{invoiceData.invoiceId}</p>
                            </div>
                            <div className="invoice-company-modern">
                                <h2>{invoiceData.shopName}</h2>
                                <p>{invoiceData.shopAddress}</p>
                                <p>{invoiceData.userEmail}</p>
                            </div>
                        </header>

                        <section className="invoice-section-modern">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.customerName}</p>
                            <p>{invoiceData.customerAddress}</p>
                        </section>

                        <section className="invoice-section-modern">
                            <h3>Invoice Details:</h3>
                            <div className="invoice-details-modern">
                                <p><strong>Details:</strong> {invoiceData.details}</p>
                                <p><strong>Amount:</strong> Rs.{invoiceData.amount}</p>
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDate}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                            </div>
                        </section>

                        <section className="invoice-section-modern">
                            <h3>QR Code:</h3>
                            <div className="invoice-qrcode-modern">
                                <QRCode value={invoiceUrl} size={128} />
                            </div>
                        </section>

                        <footer className="invoice-footer-modern">
                            <p>Thank you for your business!</p>
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );

            case 3: // Stylish Template
                return (
                    <div className="template-stylish" id="invoiceTemplate">
                        <header className="invoice-header-stylish">
                            <div className="header-left-stylish">
                                <h1 className="invoice-title-stylish">Invoice</h1>
                                <p className="invoice-id-stylish">Invoice ID #{invoiceData.invoiceId}</p>
                            </div>
                            <div className="header-right-stylish">
                                <h2>{invoiceData.shopName}</h2>
                                <p>{invoiceData.shopAddress}</p>
                                <p>{invoiceData.userEmail}</p>
                            </div>
                        </header>

                        <section className="invoice-section-stylish billed-to-stylish">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.customerName}</p>
                            <p>{invoiceData.customerAddress}</p>
                        </section>

                        <section className="invoice-section-stylish invoice-details-stylish">
                            <h3>Invoice Details:</h3>
                            <div className="details-box-stylish">
                                <p><strong>Details:</strong> {invoiceData.details}</p>
                                <p><strong>Amount:</strong> Rs.{invoiceData.amount}</p>
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDate}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                            </div>
                        </section>

                        <section className="invoice-section-stylish qr-code-stylish">
                            <h3>Scan to View:</h3>
                            <QRCode value={invoiceUrl} size={128} />
                        </section>

                        <footer className="invoice-footer-stylish">
                            <p className="thank-you-stylish">Thank you for your business!</p>
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );
            case 4: // Premium Template
                return (
                    <div className="template-premium" id="invoiceTemplate">
                        <header className="invoice-header-premium">
                            <div className="header-left-premium">
                                <h1 className="invoice-title-premium">Invoice</h1>
                                <p className="invoice-id-premium">Invoice ID #{invoiceData.invoiceId}</p>
                            </div>
                            <div className="header-right-premium">
                                <h2>{invoiceData.shopName}</h2>
                                <p>{invoiceData.shopAddress}</p>
                                <p>{invoiceData.userEmail}</p>
                            </div>
                        </header>

                        <section className="invoice-section-premium billed-to-premium">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.customerName}</p>
                            <p>{invoiceData.customerAddress}</p>
                        </section>

                        <section className="invoice-section-premium invoice-details-premium">
                            <h3>Invoice Details:</h3>
                            <div className="details-box-premium">
                                <p><strong>Details:</strong> {invoiceData.details}</p>
                                <p><strong>Amount:</strong> Rs.{invoiceData.amount}</p>
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDate}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                            </div>
                        </section>

                        <section className="invoice-section-premium qr-code-premium">
                            <h3>Scan to View:</h3>
                            <QRCode value={invoiceUrl} size={128} />
                        </section>

                        <footer className="invoice-footer-premium">
                            <p className="thank-you-premium">Thank you for your business!</p>
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );

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
