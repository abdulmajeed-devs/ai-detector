'use client';

import React, { useState } from 'react';

const DetectionForm: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.target.value;
        setInputText(text);
        setCharCount(text.length);
        setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Add logic to handle form submission and API call
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
                value={inputText}
                onChange={handleChange}
                placeholder="Enter text for AI detection..."
                className="border p-2 mb-2"
                rows={5}
                maxLength={5000}
            />
            <div className="flex justify-between mb-2">
                <span>Characters: {charCount}/5000</span>
                <span>Words: {wordCount}</span>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Detect AI Content
            </button>
        </form>
    );
};

export default DetectionForm;