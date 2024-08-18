import React, { useState } from 'react';
import Head from 'next/head';

const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // You would typically send the feedback to your backend or API here.

        console.log('Feedback submitted:', feedback);
        setSubmitted(true);
    };

    return (
        <div style={{ color: '#ffffff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#27ae60' }}>
            <Head>
                <title>Help Center - Chalaan</title>
                <meta name="description" content="Submit your feedback for Chalaan" />
            </Head>
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>Chalaan {'>'} Help Center</h1>
                <p>We value your feedback! Please let us know what you think about our app.</p>
                {submitted ? (
                    <p>Thank you for your feedback!</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={5}
                                style={{ width: '100%', padding: '1vw', borderRadius: '1vw', outline: 0, boxShadow: '10px 10px' }}
                                placeholder="Enter your feedback here..."
                            />
                        </div>
                        <button type="submit" style={{ padding: '1vw', cursor: 'pointer', borderRadius: '1vw', background: '#ecf0f1' }}>
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Feedback;
