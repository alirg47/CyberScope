'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertTriangle } from 'lucide-react';

interface EscalationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEscalate: (note: string, files: File[]) => void;
    title: string;
    targetLevel: string;
}

export default function EscalationModal({ isOpen, onClose, onEscalate, title, targetLevel }: EscalationModalProps) {
    const [note, setNote] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        onEscalate(note, files);
        setNote('');
        setFiles([]);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                width: '500px',
                background: 'var(--secondary-bg)',
                border: '1px solid var(--primary-accent)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 0 40px rgba(0, 243, 255, 0.15)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        padding: '10px',
                        background: 'rgba(0, 243, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'var(--primary-accent)'
                    }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Escalate to {targetLevel}</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{title}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        Escalation Notes (Optional)
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Describe the reason for escalation, observed patterns, and recommended actions..."
                        style={{
                            width: '100%',
                            height: '120px',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            padding: '12px',
                            color: 'var(--text-primary)',
                            fontSize: '0.875rem',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        Attachments (Optional: .pcap, .log, .pdf, .txt, .png, .jpg)
                    </label>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: '2px dashed var(--glass-border)',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            background: 'rgba(255, 255, 255, 0.02)'
                        }}
                    >
                        <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click to upload evidence files</p>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            accept=".pcap,.log,.pdf,.txt,.png,.jpg,.jpeg"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    {files.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {files.map((file, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 12px',
                                    background: 'var(--glass-bg)',
                                    borderRadius: '6px',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={14} color="var(--primary-accent)" />
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{file.name}</span>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                    <button onClick={() => removeFile(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '10px 24px',
                            background: 'var(--primary-accent)',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#000',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)'
                        }}
                    >
                        Confirm Escalation
                    </button>
                </div>
            </div>
        </div>
    );
}
