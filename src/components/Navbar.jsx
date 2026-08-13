import React from 'react';
import { Home, Calendar, Users, BarChart3, Award, Video, Target } from 'lucide-react';

export default function Navbar({ activeTab, onNavigate }) {
    const tabs = [
        { id: 'home', label: 'HOME', icon: Home },
        { id: 'schedule', label: 'SCHEDULE', icon: Calendar },
        { id: 'roster', label: 'ROSTER', icon: Users },
        { id: 'stats', label: 'PLAYER STATS', icon: BarChart3 },
        { id: 'team-stats', label: 'TEAM STATS', icon: BarChart3 },
        { id: 'standings', label: 'STANDINGS', icon: Award },
        { id: 'film', label: 'GAME FILM', icon: Video },
        { id: 'player-props', label: 'FAN PROPS', icon: Target },
    ];

    return (
        <nav className="espn-nav-bar">
            <div className="nav-tabs-container">
                {tabs.map((t) => {
                    const IconComp = t.icon;
                    return (
                        <button
                            key={t.id}
                            className={`nav-tab ${activeTab === t.id ? 'active' : ''}`}
                            onClick={() => onNavigate(t.id)}
                        >
                            <IconComp size={16} style={{ marginRight: '6px' }} />
                            {t.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
