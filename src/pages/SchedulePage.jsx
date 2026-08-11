import React, { useState } from 'react';
import { DATA_SCHEDULE_SEASON1, DATA_SCHEDULE_SEASON2 } from '../data/teamData';

export default function SchedulePage({ activeSeason, onOpenGamePage }) {
    const [filter, setFilter] = useState('all');

    const sourceData = activeSeason === 'season1' ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2;

    const list = sourceData.filter(item => {
        if (filter === 'upcoming') return item.status === 'UPCOMING';
        if (filter === 'results') return item.status !== 'UPCOMING';
        return true;
    });

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>{activeSeason === 'season1' ? 'SEASON 1 GAME SCHEDULE' : 'SEASON 2 GAME SCHEDULE'}</h2>
                <div className="filter-group">
                    <button
                        className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        ALL GAMES
                    </button>
                    <button
                        className={`filter-chip ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        UPCOMING
                    </button>
                    <button
                        className={`filter-chip ${filter === 'results' ? 'active' : ''}`}
                        onClick={() => setFilter('results')}
                    >
                        RESULTS
                    </button>
                </div>
            </div>

            <div className="schedule-table-wrapper">
                <table className="espn-table schedule-table">
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>MATCHUP</th>
                            <th>LOCATION / VENUE</th>
                            <th>RESULT / STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((m) => {
                            const gameIndex = sourceData.indexOf(m) + 1;
                            const hasBoxScore = activeSeason === 'season2' && m.status !== 'UPCOMING';
                            const gameSlug = `game-${gameIndex}`;

                            return (
                                <tr
                                    key={m.date + m.opp}
                                    className={hasBoxScore ? 'clickable' : ''}
                                    style={{ cursor: hasBoxScore ? 'pointer' : 'default' }}
                                    onClick={hasBoxScore ? () => onOpenGamePage(gameSlug) : undefined}
                                >
                                    <td><strong>{m.date}</strong></td>
                                    <td>{m.isHome ? <strong>vs</strong> : '@'} {m.opp}</td>
                                    <td>{m.venue}</td>
                                    <td>
                                        <span className={m.status.includes('W') ? 'stat-pill highlight' : 'stat-pill'}>
                                            {m.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
