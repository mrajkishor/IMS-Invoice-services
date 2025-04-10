import { useEffect, useState, useCallback } from "react";
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
    invoiceDateTimeStamp: string;
    dueDateTimeStamp: string;
    status?: string; // Optional as it is missing in JSON
    shopName?: string; // Derived or optional
    shopAddress?: string; // Derived or optional
    userEmailorMobile?: string; // Derived or optional
    invoiceTemplateId: string;
    thankYouNote: string;
    termsNServicesMessage: {
        defaultMessage: string;
        customMessage: string;
        showDefaultMsg: boolean;
        toShow: boolean;
    };
    business: {
        mobile: string;
        name: string;
        logo: string;
        address: string;
        slogan: string;
        email: string;
    };
    billedTo: {
        customer: {
            name: string;
            address: string;
            phone: string;
            email: string;
        };
    };
    invoiceTable: {
        totalableIndex: number;
        maxColLimit: number;
        value: string[][];
        columns: string[];
    };
    tax: {
        isTaxable: boolean;
        amount: string; // Changed from number to string
        percentage: string;
    };
    subTotal: string;
    total: string;
    packageDiscount: {
        amount: string; // Changed from number to string
        percentage: string;
    };
    paymentStatus: string;
    paymentMethod: {
        isUPI: boolean;
        isCash: boolean;
        isBank: boolean;
        Upis: string[];
        UpisMaxLimit?: number; // Optional as per JSON
        bank: {
            accountNumber: string;
            accountHolderName: string;
            branchName?: string; // Optional as per JSON
            country?: string; // Optional as per JSON
            ifscCode?: string; // Optional as per JSON
            recipientAddress?: string; // Optional as per JSON
            swiftCode?: string; // Optional as per JSON
        };
    };
    invoiceCreator: {
        name: string;
        designation: string;
        signatureInWords: string;
        signaturePhoto: string;
    };
}


export default function Invoice() {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [template, setTemplate] = useState<number>(1);

    const fetchInvoiceData = useCallback(async (invoiceId: string) => {
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
                userEmailorMobile: customerData.userEmailorMobile,
            });
            setTemplate(Number(invoice.invoiceTemplateId));
        } catch (error) {
            console.error("Error fetching invoice data:", error);
        }
    }, []);// Dependencies: empty array means it only creates the function once


    useEffect(() => {
        if (id) {
            fetchInvoiceData(id);
        }
    }, [id, fetchInvoiceData]);


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
            console.log(data);
            return {
                userEmailorMobile: data?.Item?.email || data?.Item?.mobile || "Unknown Contact",
            };
        } catch (error) {
            console.error("Error fetching customer data:", error);
            return { userEmailorMobile: "Unknown Email" };
        }
    };

    const downloadPDF = async (templateId: string | number) => {
        const element = document.getElementById('invoiceTemplate'); // Ensure the correct template is captured

        if (element) {
            // Detect if the screen width is below the mobile threshold (768px)
            const isMobile = window.innerWidth <= 768;

            // Variables to store original styles, if applied
            let originalWidth, originalTransform, originalOverflow;

            // For template IDs other than 6, apply desktop-like styles for PDF generation
            if (isMobile && templateId !== "6") {
                // Store the current styles to restore them later
                originalWidth = element.style.width;
                originalTransform = element.style.transform;
                originalOverflow = element.style.overflow;

                // Apply desktop-like styles for PDF generation
                element.style.width = '210mm'; // A4 width for desktop-like rendering
                element.style.overflow = 'visible'; // Ensure content is fully visible
                element.style.transform = 'scale(1)'; // Ensure scaling is set to normal
            }

            // Ensure images are fully loaded before capturing
            await ensureImagesLoaded();

            // Generate canvas using html2canvas with CORS enabled
            const canvas = await html2canvas(element, {
                scale: 2,       // High resolution for better quality
                useCORS: true,  // Ensure cross-origin images can be loaded
            });

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size in portrait mode

            const imgWidth = 210; // A4 page width in mm
            const pageHeight = 295; // A4 page height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate proportional image height

            let positionX = 0; // X-coordinate for centering
            let positionY = 0; // Y-coordinate for centering

            // Check if content height is greater than page height
            if (imgHeight > pageHeight) {
                // Scale the image down to fit on one page
                const scaleFactor = pageHeight / imgHeight;
                const newWidth = imgWidth * scaleFactor;
                const newHeight = imgHeight * scaleFactor;

                // Center horizontally and vertically
                positionX = (imgWidth - newWidth) / 2;
                positionY = (pageHeight - newHeight) / 2;

                pdf.addImage(imgData, 'PNG', positionX, positionY, newWidth, newHeight);
            } else {
                // Center the content if it fits within the page
                positionX = 0; // Already fits width-wise
                positionY = (pageHeight - imgHeight) / 2; // Center vertically

                pdf.addImage(imgData, 'PNG', positionX, positionY, imgWidth, imgHeight);
            }

            pdf.save(`invoice_${invoiceData?.invoiceId}.pdf`);

            // Restore the original mobile styles after the PDF is generated for non-template 6
            if (isMobile && templateId !== "6") {
                element.style.width = originalWidth || '';
                element.style.overflow = originalOverflow || '';
                element.style.transform = originalTransform || '';
            }
        }
    };

    // Function to ensure all images are fully loaded
    const ensureImagesLoaded = () => {
        const images = Array.from(document.images);
        const imagePromises = images.map((img) => {
            if (img.complete) {
                return Promise.resolve(); // Image is already loaded
            } else {
                return new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
            }
        });
        return Promise.all(imagePromises); // Wait for all images to load
    };


    // const renderClassicTemplate = (invoiceDataRef: InvoiceData) => {
    //     if (!invoiceDataRef) {
    //         return null;
    //     }

    //     const invoiceUrl = window.location.href;

    //     // Dynamic date calculations
    //     const invoiceDate = new Date(invoiceDataRef.invoiceDateTimeStamp);
    //     const dueDate = new Date(invoiceDataRef.dueDateTimeStamp);
    //     const timeDiff = dueDate.getTime() - invoiceDate.getTime();
    //     const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    //     return (
    //         <div className="default-template-wrapper default" id="invoiceTemplate">
    //             <header className="invoice-header-default">
    //                 <div className="invoice-header-default-details">
    //                     <div className="default-shop-logo">
    //                         <img src={invoiceDataRef.business.logo} alt="Shop Logo" />
    //                     </div>

    //                     <div className="default-invoice-details">
    //                         <div className="invoice-left">
    //                             <p><strong>ISSUED TO:</strong></p>
    //                             <p>{invoiceDataRef.billedTo.customer.name}</p>
    //                             <p>{invoiceDataRef.billedTo.customer.address}</p>
    //                             <p>{invoiceDataRef.billedTo.customer.phone}</p>
    //                             <p>{invoiceDataRef.billedTo.customer.email}</p>
    //                         </div>
    //                         <div className="invoice-right">
    //                             <p><strong>INVOICE NO:</strong></p>
    //                             <p><strong>#{invoiceDataRef.invoiceId}</strong></p>
    //                             <p>{invoiceDataRef.invoiceDateTimeStamp}</p>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </header>

    //             <section className="invoice-details-table">
    //                 <div className="table-container">
    //                     <p><strong>INVOICE TABLE</strong></p>
    //                     <table className="invoice-table">
    //                         <thead>
    //                             <tr>
    //                                 {invoiceDataRef.invoiceTable.columns.map((col, idx) => (
    //                                     <th key={idx}>{col}</th>
    //                                 ))}
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {invoiceDataRef.invoiceTable.value.map((item, index) => (
    //                                 <tr key={index}>
    //                                     {item.map((cell, cellIndex) => (
    //                                         <td key={cellIndex}>{cell}</td>
    //                                     ))}
    //                                 </tr>
    //                             ))}
    //                         </tbody>
    //                         <tfoot>
    //                             <tr>
    //                                 <td colSpan={3} className="footer-label">Total:</td>
    //                                 <td>₹{invoiceDataRef.subTotal}</td>
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={3} className="footer-label">Tax:</td>
    //                                 <td>{invoiceDataRef.tax.isTaxable && (`₹${invoiceDataRef.tax.amount} (${invoiceDataRef.tax.percentage})`)}</td>
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={3} className="footer-label">Discount:</td>
    //                                 <td>₹{invoiceDataRef.packageDiscount.amount} ({invoiceDataRef.packageDiscount.percentage})</td>
    //                             </tr>
    //                             <tr>
    //                                 <td colSpan={3} className="footer-label">Amount Due:</td>
    //                                 <td>₹{invoiceDataRef.total}</td>
    //                             </tr>
    //                         </tfoot>
    //                     </table>
    //                 </div>
    //             </section>

    //             <section className="default-payment-details">
    //                 <h3>Payment Details</h3>
    //                 <p>Payment Status: {invoiceDataRef.paymentStatus}</p>
    //                 <p>Bank Transfer</p>
    //                 <p>Account Holder Name: {invoiceDataRef.paymentMethod.bank.accountHolderName}</p>
    //                 <p>Account Number: {invoiceDataRef.paymentMethod.bank.accountNumber}</p>
    //             </section>

    //             <section className="default-owner-details">
    //                 <h3>Contact Details</h3>
    //                 <strong>Owner Details</strong>
    //                 <p>Name: {invoiceDataRef.invoiceCreator.name}</p>
    //                 <p>Designation: {invoiceDataRef.invoiceCreator.designation}</p>
    //                 <strong>Business Details</strong>
    //                 <p>Address: {invoiceDataRef.business.address}</p>
    //                 <p>Email: {invoiceDataRef.business.email}</p>
    //                 <p>Mobile: {invoiceDataRef.business.mobile}</p>
    //                 <p>Business Name: {invoiceDataRef.business.name}</p>
    //                 <p>Slogan: {invoiceDataRef.business.slogan}</p>
    //                 <strong>Signature</strong>
    //                 <p>{invoiceDataRef.invoiceCreator.signatureInWords}</p>
    //                 <img src={invoiceDataRef.invoiceCreator.signaturePhoto} alt="Signature" />
    //             </section>

    //             <section className="qr-code-classic">
    //                 <h3>QR Code</h3>
    //                 <QRCode value={invoiceUrl} size={128} />
    //             </section>

    //             <footer className="invoice-footer-classic">
    //                 <p>{invoiceDataRef.thankYouNote}</p>
    //                 {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
    //                 {invoiceDataRef.termsNServicesMessage.toShow && (
    //                     <p>
    //                         {invoiceDataRef.termsNServicesMessage.showDefaultMsg
    //                             ? invoiceDataRef.termsNServicesMessage.defaultMessage.replace("{##}time{##}", daysDiff.toString())
    //                             : invoiceDataRef.termsNServicesMessage.customMessage}
    //                     </p>
    //                 )}
    //             </footer>
    //         </div>
    //     );
    // };


    const renderClassicTemplate = (invoiceDataRef: InvoiceData) => {
        if (!invoiceDataRef) {
            return null;
        }

        const invoiceUrl = window.location.href;

        // Dynamic date calculations
        const invoiceDate = new Date(invoiceDataRef.invoiceDateTimeStamp);
        const dueDate = new Date(invoiceDataRef.dueDateTimeStamp);
        const timeDiff = dueDate.getTime() - invoiceDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return (
            <div className="default-template-wrapper default" id="invoiceTemplate">
                <header className="invoice-header-default">
                    <div className="invoice-header-default-details">
                        <div className="default-shop-logo">
                            <img src={invoiceDataRef.business.logo} alt="Shop Logo" />
                        </div>

                        <div className="default-invoice-details">
                            <div className="invoice-left">
                                <p><strong>ISSUED TO:</strong></p>
                                <p>{invoiceDataRef.billedTo.customer.name}</p>
                                <p>{invoiceDataRef.billedTo.customer.address}</p>
                                <p>{invoiceDataRef.billedTo.customer.phone}</p>
                                <p>{invoiceDataRef.billedTo.customer.email}</p>
                            </div>
                            <div className="invoice-right">
                                <p><strong>INVOICE NO:</strong></p>
                                <p><strong>#{invoiceDataRef.invoiceId}</strong></p>
                                <p>{invoiceDataRef.invoiceDateTimeStamp}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="invoice-details-table">
                    <div className="table-container">
                        <p><strong>INVOICE TABLE</strong></p>
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    {invoiceDataRef.invoiceTable.columns.map((col, idx) => (
                                        <th key={idx}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceDataRef.invoiceTable.value.map((item, index) => (
                                    <tr key={index}>
                                        {item.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="footer-label">SubTotal:</td>
                                    <td>₹{invoiceDataRef.subTotal}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="footer-label">Tax:</td>
                                    <td>{invoiceDataRef.tax.isTaxable && (`₹${invoiceDataRef.tax.amount} (${invoiceDataRef.tax.percentage})`)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="footer-label">Discount:</td>
                                    <td>₹{invoiceDataRef.packageDiscount.amount} ({invoiceDataRef.packageDiscount.percentage})</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="footer-label">Amount Due:</td>
                                    <td>₹{invoiceDataRef.total}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>

                <section className="default-payment-details">
                    <h3 style={{
                        textAlign: "center",
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        marginBottom: "20px",
                        color: "#333"
                    }}>
                        Payment Details
                    </h3>
                    <div style={{
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        lineHeight: "1.6",
                    }}>
                        <p style={{
                            fontSize: "1.2rem",
                            color: "#555",
                            marginBottom: "10px"
                        }}>
                            Payment Status: <b style={{ color: "#007BFF" }}>{invoiceDataRef.paymentStatus}</b>
                        </p>
                        <p style={{
                            fontSize: "1.2rem",
                            color: "#555",
                            fontWeight: "bold",
                            marginBottom: "10px"
                        }}>
                            Payment Method:
                        </p>

                        {invoiceDataRef.paymentMethod.isCash && (
                            <p style={{
                                margin: "5px 0",
                                color: "#333",
                                paddingLeft: "20px",
                                position: "relative"
                            }}>
                                <span style={{
                                    content: '""',
                                    position: "absolute",
                                    left: "0",
                                    width: "8px",
                                    height: "8px",
                                    backgroundColor: "#007BFF",
                                    borderRadius: "50%",
                                    marginTop: "8px"
                                }}></span>
                                Cash
                            </p>
                        )}

                        {invoiceDataRef.paymentMethod.isUPI && (
                            <>
                                <p style={{
                                    margin: "5px 0",
                                    color: "#333",
                                    fontWeight: "bold",
                                    paddingLeft: "20px",
                                    position: "relative"
                                }}>
                                    <span style={{
                                        content: '""',
                                        position: "absolute",
                                        left: "0",
                                        width: "8px",
                                        height: "8px",
                                        backgroundColor: "#007BFF",
                                        borderRadius: "50%",
                                        marginTop: "8px"
                                    }}></span>
                                    UPI IDs:
                                </p>
                                <ul style={{
                                    listStyleType: "none",
                                    paddingLeft: "20px",
                                    marginBottom: "10px"
                                }}>
                                    {invoiceDataRef.paymentMethod.Upis.map((upi, idx) => (
                                        <li key={idx} style={{
                                            color: "#555",
                                            marginBottom: "5px"
                                        }}>
                                            {upi}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {invoiceDataRef.paymentMethod.isBank && (
                            <>
                                <p style={{
                                    margin: "5px 0",
                                    color: "#333",
                                    fontWeight: "bold",
                                    paddingLeft: "20px",
                                    position: "relative"
                                }}>
                                    <span style={{
                                        content: '""',
                                        position: "absolute",
                                        left: "0",
                                        width: "8px",
                                        height: "8px",
                                        backgroundColor: "#007BFF",
                                        borderRadius: "50%",
                                        marginTop: "8px"
                                    }}></span>
                                    Bank Transfer
                                </p>
                                <ul style={{
                                    listStyleType: "none",
                                    paddingLeft: "20px",
                                    marginBottom: "10px"
                                }}>
                                    <li style={{ marginBottom: "5px", color: "#555" }}>
                                        <strong>Account Holder Name:</strong> {invoiceDataRef.paymentMethod.bank.accountHolderName}
                                    </li>
                                    <li style={{ marginBottom: "5px", color: "#555" }}>
                                        <strong>Account Number:</strong> {invoiceDataRef.paymentMethod.bank.accountNumber}
                                    </li>
                                    {invoiceDataRef.paymentMethod.bank.branchName && (
                                        <li style={{ marginBottom: "5px", color: "#555" }}>
                                            <strong>Branch Name:</strong> {invoiceDataRef.paymentMethod.bank.branchName}
                                        </li>
                                    )}
                                    {invoiceDataRef.paymentMethod.bank.ifscCode && (
                                        <li style={{ marginBottom: "5px", color: "#555" }}>
                                            <strong>IFSC Code:</strong> {invoiceDataRef.paymentMethod.bank.ifscCode}
                                        </li>
                                    )}
                                    {invoiceDataRef.paymentMethod.bank.country && (
                                        <li style={{ marginBottom: "5px", color: "#555" }}>
                                            <strong>Country:</strong> {invoiceDataRef.paymentMethod.bank.country}
                                        </li>
                                    )}
                                    {invoiceDataRef.paymentMethod.bank.recipientAddress && (
                                        <li style={{ marginBottom: "5px", color: "#555" }}>
                                            <strong>Recipient Address:</strong> {invoiceDataRef.paymentMethod.bank.recipientAddress}
                                        </li>
                                    )}
                                    {invoiceDataRef.paymentMethod.bank.swiftCode && (
                                        <li style={{ marginBottom: "5px", color: "#555" }}>
                                            <strong>SWIFT Code:</strong> {invoiceDataRef.paymentMethod.bank.swiftCode}
                                        </li>
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                </section>


                <section className="contact-and-signature-details">
                    <h3 style={{
                        textAlign: "center",
                        fontSize: "1.8rem",
                        fontWeight: "bold",
                        marginBottom: "20px",
                        color: "#333"
                    }}>
                        Contact & Signature Details
                    </h3>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "20px",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}>
                        {/* Contact Details */}
                        <div style={{
                            flex: "1",
                            lineHeight: "1.6"
                        }}>
                            <h4 style={{
                                fontSize: "1.4rem",
                                fontWeight: "bold",
                                color: "#007BFF",
                                marginBottom: "10px"
                            }}>
                                Contact Details
                            </h4>
                            <div style={{ marginBottom: "20px" }}>
                                <h5 style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    color: "#555",
                                    marginBottom: "10px"
                                }}>
                                    Owner Details
                                </h5>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Name:</strong> {invoiceDataRef.invoiceCreator.name || "N/A"}
                                </p>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Designation:</strong> {invoiceDataRef.invoiceCreator.designation || "N/A"}
                                </p>
                            </div>
                            <div>
                                <h5 style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    color: "#555",
                                    marginBottom: "10px"
                                }}>
                                    Business Details
                                </h5>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Name:</strong> {invoiceDataRef.business.name}
                                </p>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Slogan:</strong> {invoiceDataRef.business.slogan}
                                </p>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Address:</strong> {invoiceDataRef.business.address}
                                </p>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Email:</strong> {invoiceDataRef.business.email}
                                </p>
                                <p style={{ fontSize: "1.1rem", color: "#555", marginBottom: "5px" }}>
                                    <strong>Mobile:</strong> {invoiceDataRef.business.mobile}
                                </p>
                            </div>
                        </div>

                        {/* Signature Details */}
                        <div style={{
                            flex: "1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center"
                        }}>
                            <h4 style={{
                                fontSize: "1.4rem",
                                fontWeight: "bold",
                                color: "#007BFF",
                                marginBottom: "10px"
                            }}>
                                Signature
                            </h4>
                            <div style={{
                                marginBottom: "15px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center"
                            }}>
                                {invoiceDataRef.invoiceCreator.signaturePhoto ? (
                                    <img
                                        src={invoiceDataRef.invoiceCreator.signaturePhoto}
                                        alt="Signature"
                                        style={{
                                            maxWidth: "250px",
                                            maxHeight: "100px",
                                            objectFit: "contain",
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                            padding: "5px",
                                            backgroundColor: "#fff"
                                        }}
                                    />
                                ) : (
                                    <p style={{
                                        color: "#888",
                                        fontSize: "1rem",
                                        marginBottom: "15px"
                                    }}>
                                        No signature image provided
                                    </p>
                                )}
                                <p style={{
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    color: "#555"
                                }}>
                                    <strong>Signature in Words:</strong> {invoiceDataRef.invoiceCreator.signatureInWords || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>



                <section className="qr-code-classic">
                    <h3>QR Code</h3>
                    <QRCode value={invoiceUrl} size={128} />
                </section>

                <footer className="invoice-footer-classic">
                    <p>{invoiceDataRef.thankYouNote}</p>
                    {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                    {invoiceDataRef.termsNServicesMessage.toShow && (
                        <p>
                            {invoiceDataRef.termsNServicesMessage.showDefaultMsg
                                ? invoiceDataRef.termsNServicesMessage.defaultMessage.replace("{##}time{##}", daysDiff.toString())
                                : invoiceDataRef.termsNServicesMessage.customMessage}
                        </p>
                    )}
                </footer>
            </div>
        );
    };

    const renderPosTemplate = (invoiceDataRef: InvoiceData) => {
        if (!invoiceDataRef) {
            return null;
        }

        const invoiceUrl = window.location.href;

        // Calculate the difference in days between the invoice date and the due date
        const invoiceDate = new Date(invoiceDataRef.invoiceDateTimeStamp);
        const dueDate = new Date(invoiceDataRef.dueDateTimeStamp);
        const timeDiff = dueDate.getTime() - invoiceDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return (

            <div className="template-pos" id="invoiceTemplate">
                <div className="pos-header">
                    <div className="pos-title">Invoice</div>
                    <div className="pos-shop-info">
                        <p><strong>Shop Name:</strong> {invoiceDataRef.business.name}</p>
                        <p><strong>Address:</strong> {invoiceDataRef.business.address}</p>
                        <p><strong>Contact:</strong> {invoiceDataRef.business.mobile}</p>
                    </div>
                </div>

                <div className="pos-customer-info">
                    <p><strong>Customer:</strong> {invoiceDataRef.billedTo.customer.name}</p>
                    <p><strong>Address:</strong> {invoiceDataRef.billedTo.customer.address}</p>
                    <p><strong>Contact:</strong> {invoiceDataRef.billedTo.customer.phone}</p>
                    <p><strong>Email:</strong> {invoiceDataRef.billedTo.customer.email}</p>
                </div>

                <div className="pos-details">
                    <p><strong>Invoice Date:</strong> {invoiceDataRef.invoiceDateTimeStamp}</p>
                    <p><strong>Due Date:</strong> {invoiceDataRef.dueDateTimeStamp}</p>
                    <p><strong>Status:</strong> {invoiceDataRef.paymentStatus}</p>
                </div>

                <table className="pos-table">
                    <thead>
                        <tr>
                            {invoiceDataRef.invoiceTable.columns.map((col, idx) => (
                                <th key={idx}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceDataRef.invoiceTable.value.map((item, index) => (
                            <tr key={index}>
                                {item.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pos-summary">
                    <p><strong>SubTotal:</strong> ₹{invoiceDataRef.subTotal}</p>
                    <p><strong>Tax ({invoiceDataRef.tax.percentage}):</strong> ₹{invoiceDataRef.tax.amount}</p>
                    <p><strong>Discount ({invoiceDataRef.packageDiscount.percentage}):</strong> ₹{invoiceDataRef.packageDiscount.amount}</p>
                    <p className="pos-total"><strong>Total:</strong> ₹{invoiceDataRef.total}</p>
                </div>

                <div className="pos-qrcode">
                    <QRCode value={invoiceUrl} size={128} />
                </div>

                <div className="pos-footer">
                    <p>{invoiceDataRef.thankYouNote}</p>
                    {invoiceDataRef.termsNServicesMessage.toShow && (
                        <p>
                            {invoiceDataRef.termsNServicesMessage.showDefaultMsg
                                ? invoiceDataRef.termsNServicesMessage.defaultMessage.replace("{##}time{##}", daysDiff.toString())
                                : invoiceDataRef.termsNServicesMessage.customMessage}
                        </p>
                    )}
                </div>


                {/* 
                <a href="#" className="pos-btn">Download PDF</a> */}
            </div>
        );
    };



    const renderTemplate = () => {
        if (!invoiceData) {
            return null;
        }

        const invoiceUrl = window.location.href; // Get the current URL for the QR code

        // Calculate the difference in days between the invoice date and the due date
        const invoiceDate = new Date(invoiceData.invoiceDateTimeStamp);
        const dueDate = new Date(invoiceData.dueDateTimeStamp);
        const timeDiff = dueDate.getTime() - invoiceDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

        switch (template) {
            case 1:
                return renderClassicTemplate(invoiceData);
            case 2:
                return renderPosTemplate(invoiceData);
            case 3:
                return (
                    <div className="template1" id="invoiceTemplate">
                        <header className="invoice-header">
                            <div>
                                <h1 className="invoice-title">Invoice</h1>
                                <p className="invoice-id">Invoice ID #{invoiceData.invoiceId}</p>
                            </div>
                            <div className="invoice-company">
                                <h2>{invoiceData.shopName}</h2> {/* Display shop name */}
                                <p>{invoiceData.shopAddress}</p> {/* Display shop address */}
                                <p>Contact: {invoiceData.userEmailorMobile}</p> {/* Display user email or mobile */}
                            </div>
                        </header>

                        <section className="invoice-section">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.billedTo.customer.name}</p> {/* Customer Name */}
                            <p>{invoiceData.billedTo.customer.address}</p> {/* Customer Address */}
                        </section>

                        <section className="invoice-section">
                            <h3>Invoice Details:</h3>
                            <div className="invoice-details">
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDateTimeStamp}</p> {/* Use invoiceDateTimeStamp */}
                                <p><strong>Due Date:</strong> {invoiceData.dueDateTimeStamp}</p> {/* Use dueDateTimeStamp */}
                                <p><strong>Status:</strong> {invoiceData.status}</p> {/* Invoice status */}
                                <p><strong>Total Amount:</strong> Rs.{invoiceData.total}</p> {/* Total amount */}
                            </div>
                        </section>

                        <section className="invoice-section">
                            <h3>QR Code:</h3>
                            <div className="invoice-qrcode">
                                <QRCode value={invoiceUrl} size={128} />
                            </div>
                        </section>

                        <footer className="invoice-footer">
                            <p>{invoiceData.thankYouNote}</p> {/* Thank you note */}
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );

            case 4: // Modern Template
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
                                <p>Contact: {invoiceData.userEmailorMobile}</p>
                            </div>
                        </header>

                        <section className="invoice-section-modern">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.billedTo.customer.name}</p>
                            <p>{invoiceData.billedTo.customer.address}</p>
                        </section>

                        <section className="invoice-section-modern">
                            <h3>Invoice Details:</h3>
                            <div className="invoice-details-modern">
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDateTimeStamp}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDateTimeStamp}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                                <p><strong>Total Amount:</strong> Rs.{invoiceData.total}</p>
                            </div>
                        </section>

                        <section className="invoice-section-modern">
                            <h3>QR Code:</h3>
                            <div className="invoice-qrcode-modern">
                                <QRCode value={invoiceUrl} size={128} />
                            </div>
                        </section>

                        <footer className="invoice-footer-modern">
                            <p>{invoiceData.thankYouNote}</p>
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );

            case 5: // Stylish Template
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
                                <p>Contact: {invoiceData.userEmailorMobile}</p>
                            </div>
                        </header>

                        <section className="invoice-section-stylish billed-to-stylish">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.billedTo.customer.name}</p>
                            <p>{invoiceData.billedTo.customer.address}</p>
                        </section>

                        <section className="invoice-section-stylish invoice-details-stylish">
                            <h3>Invoice Details:</h3>
                            <div className="details-box-stylish">
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDateTimeStamp}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDateTimeStamp}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                                <p><strong>Total Amount:</strong> Rs.{invoiceData.total}</p>
                            </div>
                        </section>

                        <section className="invoice-section-stylish qr-code-stylish">
                            <h3>Scan to View:</h3>
                            <QRCode value={invoiceUrl} size={128} />
                        </section>

                        <footer className="invoice-footer-stylish">
                            <p className="thank-you-stylish">{invoiceData.thankYouNote}</p>
                            {daysDiff > 0 && <p>Payment is due within {daysDiff} days</p>}
                            <p>Please make checks payable to: {invoiceData.shopName}</p>
                        </footer>
                    </div>
                );

            case 6: // Premium Template
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
                                <p>Contact: {invoiceData.userEmailorMobile}</p>
                            </div>
                        </header>

                        <section className="invoice-section-premium billed-to-premium">
                            <h3>Billed To:</h3>
                            <p>{invoiceData.billedTo.customer.name}</p>
                            <p>{invoiceData.billedTo.customer.address}</p>
                        </section>

                        <section className="invoice-section-premium invoice-details-premium">
                            <h3>Invoice Details:</h3>
                            <div className="details-box-premium">
                                <p><strong>Invoice Date:</strong> {invoiceData.invoiceDateTimeStamp}</p>
                                <p><strong>Due Date:</strong> {invoiceData.dueDateTimeStamp}</p>
                                <p><strong>Status:</strong> {invoiceData.status}</p>
                                <p><strong>Total Amount:</strong> Rs.{invoiceData.total}</p>
                            </div>
                        </section>

                        <section className="invoice-section-premium qr-code-premium">
                            <h3>Scan to View:</h3>
                            <QRCode value={invoiceUrl} size={128} />
                        </section>

                        <footer className="invoice-footer-premium">
                            <p className="thank-you-premium">{invoiceData.thankYouNote}</p>
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
                        {invoiceData && renderTemplate()}
                        <div className="invoice-actions">
                            <button
                                onClick={() => downloadPDF(invoiceData.invoiceTemplateId)}
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
            {/* Powered by Chalaan.com footer */}
            <footer className="invoice-powered-by">
                <p>
                    Powered by <a href="https://chalaan.com" target="_blank" rel="noopener noreferrer">Chalaan.com</a> &copy; 2024
                </p>
            </footer>
        </main>
    );
}
