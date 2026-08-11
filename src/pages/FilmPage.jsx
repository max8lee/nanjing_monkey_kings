import React from 'react';
import { DATA_FILM } from '../data/teamData';
import { Play } from 'lucide-react';

export default function FilmPage({ onPlayVideo }) {
    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>🎥 TEAM GAME FILM & PLAY HIGHLIGHTS</h2>
            </div>

            <div className="film-grid-layout" id="film-grid">
                {DATA_FILM.map((f) => (
                    <div key={f.id} className="film-card" onClick={() => onPlayVideo(f.title, f.video)}>
                        <div className="film-thumb-box">
                            <img src={f.img} alt={f.title} />
                            <div className="play-overlay"><Play size={24} color="#FFF" /></div>
                            <span className="duration-badge">{f.duration}</span>
                        </div>
                        <div className="film-info">
                            <h3>{f.title}</h3>
                            <p>{f.views} • Team Game Film</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
