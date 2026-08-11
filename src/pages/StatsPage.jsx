import React from 'react';
import { DATA_STATS_SEASON1, DATA_STATS_SEASON2, getPlayerSlug } from '../data/teamData';

export default function StatsPage({ activeSeason, onOpenPlayerBio }) {
    const sourceData = activeSeason === 'season1' ? DATA_STATS_SEASON1 : DATA_STATS_SEASON2;

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>{activeSeason === 'season1' ? 'SEASON 1 INDIVIDUAL STATISTICAL LEADERS' : 'SEASON 2 INDIVIDUAL STATISTICAL LEADERS'}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click any player row to open full player bio page</span>
            </div>

            <div className="schedule-table-wrapper">
                <table className="espn-table">
                    <thead>
                        <tr>
                            <th>PLAYER</th>
                            <th>POS</th>
                            <th>GP</th>
                            <th>MPG</th>
                            <th>PPG</th>
                            <th>RPG</th>
                            <th>APG</th>
                            <th>SPG</th>
                            <th>BPG</th>
                            <th>FG%</th>
                            <th>3P%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sourceData.map((s) => {
                            const slug = getPlayerSlug(s.name);
                            return (
                                <tr
                                    key={s.id + s.name}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onOpenPlayerBio(slug)}
                                >
                                    <td><strong className="gold-text">{s.name} 👤</strong></td>
                                    <td>{s.pos}</td>
                                    <td>{s.gp}</td>
                                    <td>{s.mpg}</td>
                                    <td><strong>{s.ppg}</strong></td>
                                    <td>{s.rpg}</td>
                                    <td>{s.apg}</td>
                                    <td>{s.spg}</td>
                                    <td>{s.bpg}</td>
                                    <td>{s.fg}</td>
                                    <td>{s.p3}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
