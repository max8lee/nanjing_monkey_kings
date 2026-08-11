import React, { useState, useEffect } from 'react';

const GAME_PLAYLISTS = [
    {
        id: 'season-2-game-4',
        title: 'Season 2 Game 4',
        videos: [
            { id: 'Rf6bPrvFk7k', title: 'Part 1: 1st Quarter' },
            { id: '5Met1__W50o', title: 'Part 2: 2nd Quarter' },
            { id: 'orSbdIIwyZU', title: 'Part 3: 3rd Quarter' },
            { id: 'w6UVQ1JNZuA', title: 'Part 4: 4th Quarter' }
        ]
    },
    {
        id: 'season-2-game-3',
        title: 'Season 2 Game 3',
        videos: [
            { id: 'EWq0gyAQneY', title: 'Part 1: 1st Quarter' },
            { id: 'NeEkiVB3JeQ', title: 'Part 2: 2nd Quarter' },
            { id: 'O_P3FQgtgAc', title: 'Part 3: 3rd Quarter' },
            { id: 'IVQcqO6dK-A', title: 'Part 4: 4th Quarter' }
        ]
    },
    {
        id: 'season-2-game-2',
        title: 'Season 2 Game 2',
        videos: [
            { id: 'czYl4O-t5uA', title: 'Part 1: 1st Quarter' },
            { id: '7No7Ovjye_s', title: 'Part 2: 2nd Quarter' },
            { id: 'pSNJjXCVXwM', title: 'Part 3: 3rd Quarter' },
            { id: '6Wj37KJcvY4', title: 'Part 4: 4th Quarter' }
        ]
    }
];

export default function FilmPage({ filmSlug, onOpenFilmPage }) {
    const [expandedPlaylistIndex, setExpandedPlaylistIndex] = useState(0);
    const [activeVideo, setActiveVideo] = useState(GAME_PLAYLISTS[0].videos[0].id);

    useEffect(() => {
        if (filmSlug) {
            const idx = GAME_PLAYLISTS.findIndex(p => p.id === filmSlug);
            if (idx !== -1) {
                setExpandedPlaylistIndex(idx);
                // Only change active video if the newly opened playlist has a valid video
                const firstValidVideo = GAME_PLAYLISTS[idx].videos.find(v => v.id);
                if (firstValidVideo) {
                    setActiveVideo(firstValidVideo.id);
                } else {
                    setActiveVideo(null); // No video yet
                }
            }
        } else {
            // Default to most recent game if no slug provided
            setExpandedPlaylistIndex(0);
            setActiveVideo(GAME_PLAYLISTS[0].videos[0].id);
        }
    }, [filmSlug]);

    const handleExpand = (pIdx) => {
        if (expandedPlaylistIndex === pIdx) {
            setExpandedPlaylistIndex(-1); // collapse
        } else {
            if (onOpenFilmPage) {
                onOpenFilmPage(GAME_PLAYLISTS[pIdx].id);
            } else {
                setExpandedPlaylistIndex(pIdx);
            }
        }
    };

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>FILM</h2>
            </div>

            <div className="custom-playlist-container">
                {/* Main Video Player */}
                <div style={{ flex: '1', aspectRatio: '16/9', background: '#000' }}>
                    {activeVideo ? (
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                            title="Game Film" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            style={{ display: 'block' }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', border: '1px solid #333' }}>
                            Video not available yet
                        </div>
                    )}
                </div>

                {/* Custom Playlist Sidebar Accordion */}
                <div className="custom-playlist-sidebar">
                    {GAME_PLAYLISTS.map((playlist, pIdx) => (
                        <div key={pIdx} className="playlist-group">
                            <div 
                                className={`playlist-header ${expandedPlaylistIndex === pIdx ? 'expanded' : ''}`}
                                onClick={() => handleExpand(pIdx)}
                            >
                                <span>{playlist.title}</span>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                    {expandedPlaylistIndex === pIdx ? '▼' : '▶'}
                                </span>
                            </div>
                            
                            {expandedPlaylistIndex === pIdx && (
                                <div className="playlist-videos">
                                    {playlist.videos.map((video, vIdx) => (
                                        <div 
                                            key={vIdx} 
                                            onClick={() => {
                                                if (video.id) setActiveVideo(video.id);
                                            }}
                                            className={`playlist-item ${activeVideo === video.id && video.id !== '' ? 'active' : ''}`}
                                            style={{ opacity: video.id ? 1 : 0.5, cursor: video.id ? 'pointer' : 'not-allowed' }}
                                        >
                                            {video.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

