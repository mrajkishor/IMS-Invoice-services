import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const TermsOfService = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            <Head>
                <title>Terms of Service - Chalaan</title>
                <meta name="description" content="Terms of Service for Chalaan" />
            </Head>

            {isClient && (
                <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", padding: '1em' }}>
                    <h1>Terms of Service</h1>
                    <p>Welcome to Chalaan! These terms and conditions outline the rules and regulations for the use of Chalaan&apos;s mobile application and services (hereby referred to as &quot;Application&quot;). By accessing and using our Application, you agree to these terms and conditions.</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By downloading, installing, and using the Application, you accept and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not access or use the Application.</p>

                    <h2>2. Use of the Application</h2>
                    <p>Chalaan is provided to you free of charge and is intended for your personal, non-commercial use. You agree to use the Application in compliance with all applicable laws and not to engage in any unauthorized use of the Application, including but not limited to the modification, copying, distribution, transmission, display, performance, or creation of derivative works from the Application.</p>

                    <h2>3. User Accounts</h2>
                    <p>To use certain features of the Application, you may be required to create an account and provide accurate and complete information. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify Chalaan immediately of any unauthorized use of your account.</p>

                    <h2>4. Intellectual Property Rights</h2>
                    <p>The Application and its original content, features, and functionality are and will remain the exclusive property of Chalaan and its licensors. You are granted a limited, non-exclusive, non-transferable, and revocable license to use the Application solely for your personal, non-commercial use.</p>

                    <h2>5. Restrictions</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Modify, decompile, reverse-engineer, or otherwise attempt to extract the source code of the Application;</li>
                        <li>Use the Application for any illegal or unauthorized purpose;</li>
                        <li>Interfere with or disrupt the integrity or performance of the Application;</li>
                        <li>Attempt to gain unauthorized access to the Application or its related systems or networks;</li>
                        <li>Use the Application in a manner that violates the intellectual property rights or other rights of Chalaan or third parties.</li>
                    </ul>

                    <h2>6. Termination</h2>
                    <p>Chalaan reserves the right to terminate or suspend your access to the Application at any time, with or without notice, for any reason, including but not limited to a breach of these Terms of Service.</p>

                    <h2>7. Limitation of Liability</h2>
                    <p>In no event shall Chalaan, its affiliates, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                    <ul>
                        <li>Your access to or use of or inability to access or use the Application;</li>
                        <li>Any unauthorized access to or use of our servers and/or any personal information stored therein;</li>
                        <li>Any interruption or cessation of transmission to or from the Application;</li>
                        <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Application by any third party;</li>
                        <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Application.</li>
                    </ul>

                    <h2>8. Disclaimer</h2>
                    <p>The Application is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>

                    <h2>9. Governing Law</h2>
                    <p>These Terms of Service shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. Any disputes arising under or in connection with these Terms of Service shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].</p>

                    <h2>10. Changes to the Terms of Service</h2>
                    <p>Chalaan reserves the right to modify or replace these Terms of Service at any time. We will notify you of any changes by posting the new Terms of Service on this page. You are advised to review these Terms of Service periodically for any changes. Continued use of the Application following the posting of changes constitutes your acceptance of such changes.</p>

                    <h2>11. Contact Us</h2>
                    <p>If you have any questions about these Terms of Service, please contact us at quickroutes@gmail.com.</p>
                </div>
            )}
        </>
    );
};

export default TermsOfService;
