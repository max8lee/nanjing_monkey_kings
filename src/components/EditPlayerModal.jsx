import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Sparkles, UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function EditPlayerModal({ isOpen, player, onClose, onSave }) {
    const [nickname, setNickname] = useState('');
    const [jersey, setJersey] = useState('');
    const [pos, setPos] = useState('');
    const [heightFeet, setHeightFeet] = useState('6');
    const [heightInches, setHeightInches] = useState('0');
    const [weight, setWeight] = useState('');
    const [college, setCollege] = useState('');
    const [bio, setBio] = useState('');
    const [img, setImg] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (player) {
            setNickname(player.nickname || '');
            setJersey(player.jersey !== undefined && player.jersey !== null ? String(player.jersey).replace('#', '') : '');
            setPos(player.pos || 'Guard');
            
            if (player.height) {
                const parts = player.height.split("'");
                if (parts.length === 2) {
                    setHeightFeet(parts[0]);
                    setHeightInches(parts[1].replace('"', ''));
                } else {
                    setHeightFeet('6');
                    setHeightInches('0');
                }
            } else {
                setHeightFeet('6');
                setHeightInches('0');
            }
            
            if (player.weight) {
                setWeight(player.weight.toString().replace(/[^0-9]/g, ''));
            } else {
                setWeight('');
            }
            
            setCollege(player.college || '');
            setBio(player.bio || '');
            setImg(player.img || '');
        }
    }, [player]);

    if (!isOpen || !player) return null;

    const processFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please drop or select a valid image file (PNG, JPG, WEBP, etc.).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const imgElement = new Image();
            imgElement.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; // Small size is fine for a profile pic
                const MAX_HEIGHT = 400;
                let width = imgElement.width;
                let height = imgElement.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgElement, 0, 0, width, height);
                
                // Compress as webp for smaller base64 size
                const compressedDataUrl = canvas.toDataURL('image/webp', 0.8);
                
                // Firestore document limit is 1MB (~1,048,576 bytes). 
                // A base64 string of a 400x400 webp should be well under that (e.g. 20-50kb).
                setImg(compressedDataUrl);
            };
            imgElement.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleResetPhoto = () => {
        setImg(player.img || '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedPlayer = {
            ...player,
            nickname,
            jersey: jersey ? `#${jersey}` : '',
            pos,
            height: `${heightFeet}'${heightInches}"`,
            weight: weight ? `${weight} lbs` : '',
            college,
            bio,
            img
        };
        onSave(updatedPlayer);
        onClose();
    };

    return (
        <div className="modal-overlay active">
            <div className="modal-card" style={{ maxWidth: '600px' }}>
                <button className="modal-close-btn" onClick={onClose} title="Close Editor">
                    <X size={18} />
                </button>

                <div className="modal-header">
                    <Sparkles className="gold-text" size={24} style={{ marginRight: '8px' }} />
                    <h2>CUSTOMIZE PLAYER PROFILE</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                    Updating bio & vitals for <strong>{player.name} ({player.jersey})</strong>. Official game stats remain strictly verified by Volo scorekeepers.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Nickname</label>
                            <input
                                type="text"
                                placeholder='e.g. "MUDBONE"'
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Jersey Number</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={jersey}
                                onChange={(e) => setJersey(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Primary Position</label>
                            <select value={pos} onChange={(e) => setPos(e.target.value)}>
                                <option value="Guard">Guard (PG/SG)</option>
                                <option value="Forward">Forward (SF/PF)</option>
                                <option value="Center">Center (C)</option>
                                <option value="Forward/Center">Forward/Center</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group">
                            <label>Height</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select 
                                    value={heightFeet} 
                                    onChange={(e) => setHeightFeet(e.target.value)}
                                    style={{ flex: 1 }}
                                >
                                    {['4', '5', '6', '7'].map(f => (
                                        <option key={f} value={f}>{f}'</option>
                                    ))}
                                </select>
                                <select 
                                    value={heightInches} 
                                    onChange={(e) => setHeightInches(e.target.value)}
                                    style={{ flex: 1 }}
                                >
                                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                                        <option key={i} value={i}>{i}"</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Weight (lbs)</label>
                            <input
                                type="number"
                                placeholder="195"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>College / School</label>
                            <input
                                type="text"
                                placeholder="Stanford"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* DRAG AND DROP PLAYER PHOTO UPLOADER ZONE */}
                    <div className="form-group">
                        <label>Player Profile Photo</label>
                        <div className="photo-dropzone-wrapper">
                            <div className="photo-preview-circle">
                                <img src={img || '/assets/hero.jpg'} alt="Player Preview" />
                            </div>

                            <div
                                className={`photo-dropzone-box ${isDragging ? 'drag-over' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <UploadCloud size={28} className={isDragging ? 'gold-text' : 'muted-text'} />
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ fontSize: '0.88rem', color: '#FFF', display: 'block' }}>
                                        {isDragging ? 'Release to Drop Photo' : 'Drag & Drop Player Photo Here'}
                                    </strong>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        or click to browse your computer (PNG, JPG, WEBP)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {img && img !== player.img && (
                            <button
                                type="button"
                                className="btn-reset-photo"
                                onClick={handleResetPhoto}
                            >
                                <Trash2 size={13} /> Reset to Original Photo
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Custom Player Biography</label>
                        <textarea
                            rows="4"
                            style={{
                                width: '100%',
                                background: 'var(--navy-card)',
                                border: '1px solid var(--border-color)',
                                color: '#FFF',
                                padding: '0.8rem 1rem',
                                borderRadius: '10px',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem'
                            }}
                            placeholder="Tell your team story, playing background, favorite moves, or highlight reel details..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-espn-gold" style={{ width: '100%', marginTop: '1rem' }}>
                        <Save size={16} /> SAVE PROFILE
                    </button>
                </form>
            </div>
        </div>
    );
}
