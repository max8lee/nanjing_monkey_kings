import React, { useState } from 'react';
import { X, Ticket } from 'lucide-react';

export default function TicketModal({ isOpen, onClose, userEmail }) {
    const [tier, setTier] = useState('Courtside Baseline ($25)');

    if (!isOpen) return null;

    const handleConfirm = () => {
        alert(`🎟️ Ticket Reserved! Seat Tier: ${tier}. Mobile entry QR code sent to ${userEmail || 'your email'}!`);
        onClose();
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-card">
                <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
                <div className="modal-header">
                    <Ticket className="gold-text" size={24} />
                    <h2>RESERVE GAME DAY TICKETS</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                    Select your seating preferences for the upcoming Nanjing Monkey Kings matchup at Telegraph Hill Community Center.
                </p>

                <div className="form-group">
                    <label>Seating Tier</label>
                    <select value={tier} onChange={(e) => setTier(e.target.value)}>
                        <option>Courtside Baseline ($25)</option>
                        <option>VIP Bench Row ($20)</option>
                        <option>General Admission Bleachers ($12)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Quantity</label>
                    <select defaultValue="2">
                        <option value="1">1 Ticket</option>
                        <option value="2">2 Tickets</option>
                        <option value="4">4 Tickets (Family Pack)</option>
                    </select>
                </div>

                <button className="btn-espn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleConfirm}>
                    CONFIRM & GENERATE MOBILE QR TICKETS
                </button>
            </div>
        </div>
    );
}
