import React from 'react';
import { X, Play } from 'lucide-react';

export default function VideoModal({ isOpen, title, videoSrc, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay active">
            <div className="modal-card video-modal-card">
                <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
                <h3 className="video-modal-title">{title}</h3>
                <div className="video-placeholder-player">
                    {videoSrc ? (
                        <video controls autoPlay style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'contain' }}>
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <Play size={48} className="gold-text" style={{ margin: '0 auto 1rem' }} />
                            <p>{title}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
