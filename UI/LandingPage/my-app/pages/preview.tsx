import { useState } from "react";
import Image from 'next/image';
import "./preview.css"; // Import the CSS file for styling


// List of template names and paths to images
const templates = Array.from({ length: 14 }, (_, index) => ({
    name: `Template ${index + 1}`,
    imagePath: require(`../public/assets/templates/${index + 1}.webp`)
}));


export default function TemplatePreview() {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

    const handleTemplateClick = (index: number) => {
        setSelectedTemplate(index);
    };

    const handleCloseModal = () => {
        setSelectedTemplate(null);
    };

    return (
        <main className="template-preview-main">
            <h1>Chalaan.com</h1>
            <h2>Invoice Templates Preview</h2>
            <div className="template-grid">
                {templates.map((template, index) => (
                    <div
                        key={index}
                        className="template-item"
                        onClick={() => handleTemplateClick(index)}
                    >
                        <Image
                            src={template.imagePath}
                            alt={template.name}
                            width={100}
                            height={100}
                            className="template-thumbnail"
                        />
                        <p className="template-name">{template.name}</p>
                    </div>
                ))}
            </div>

            {selectedTemplate !== null && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>&times;</span>
                        <Image
                            src={templates[selectedTemplate].imagePath}
                            alt={templates[selectedTemplate].name}
                            width={800}
                            height={600}
                            className="modal-image"
                        />
                        <p className="modal-template-name">{templates[selectedTemplate].name}</p>
                    </div>
                </div>
            )}
        </main>
    );
}
