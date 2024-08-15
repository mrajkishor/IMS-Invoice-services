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
        <>
            <Head>
                <title>Feedback - Your App Name</title>
                <meta name="description" content="Submit your feedback for Your App Name" />
            </Head>
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                <h1>Feedback</h1>
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
                                style={{ width: '100%', padding: '10px' }}
                                placeholder="Enter your feedback here..."
                            />
                        </div>
                        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                            Submit
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default Feedback;
