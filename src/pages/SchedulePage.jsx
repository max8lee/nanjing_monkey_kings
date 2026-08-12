import React, { useState } from 'react';
import { DATA_SCHEDULE_SEASON1, DATA_SCHEDULE_SEASON2, formatDateTime } from '../data/teamData';

export default function SchedulePage({ activeSeason, seasonGames, onOpenGamePage }) {
    const [filter, setFilter] = useState('all');

    const sourceData = seasonGames.length > 0 ? seasonGames : (activeSeason === 'season1' ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2);

    const list = sourceData.filter(item => {
        const isUpcoming = (item.result !== 'W' && item.result !== 'L' && item.result !== 'T');
        if (filter === 'upcoming') return isUpcoming;
        if (filter === 'results') return !isUpcoming;
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
                            const hasBoxScore = !!m.result || (m.status && m.status !== 'UPCOMING');
                            const gameSlug = m.gameSlug;

                            return (
                                <tr
                                    key={m.date + m.opp}
                                    className={hasBoxScore ? 'clickable' : ''}
                                    style={{ cursor: hasBoxScore ? 'pointer' : 'default' }}
                                    onClick={hasBoxScore ? () => onOpenGamePage(gameSlug) : undefined}
                                >
                                    <td><strong>{formatDateTime(m.date)}</strong></td>
                                    <td>{m.isHome ? <strong>vs</strong> : '@'} {m.opp}</td>
                                    <td>{m.venue || 'Telegraph Hill Community Center'}</td>
                                    <td>
                                        <span className={(m.result === 'W' || m.status?.includes('W')) ? 'stat-pill highlight' : 'stat-pill'}>
                                            {(m.result === 'W' || m.result === 'L' || m.result === 'T') ? `${m.result} ${Math.max(m.finalTotal || 0, m.oppFinalTotal || 0)}-${Math.min(m.finalTotal || 0, m.oppFinalTotal || 0)}` : (m.status || 'UPCOMING')}
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
