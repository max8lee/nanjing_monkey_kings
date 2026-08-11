import React from 'react';
import { DATA_STANDINGS_SEASON1, DATA_STANDINGS_SEASON2 } from '../data/teamData';

export default function StandingsPage({ activeSeason }) {
    const sourceData = activeSeason === 'season1' ? DATA_STANDINGS_SEASON1 : DATA_STANDINGS_SEASON2;

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>{activeSeason === 'season1' ? 'SEASON 1 VOLO MEN\'S LEAGUE STANDINGS' : 'SEASON 2 VOLO MEN\'S LEAGUE STANDINGS'}</h2>
            </div>

            <div className="schedule-table-wrapper">
                <table className="espn-table">
                    <thead>
                        <tr>
                            <th>RK</th>
                            <th>TEAM</th>
                            <th>W</th>
                            <th>L</th>
                            <th>PCT</th>
                            <th>GB</th>
                            <th>HOME</th>
                            <th>AWAY</th>
                            <th>STRK</th>
                            <th>L10</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sourceData.map((st) => (
                            <tr key={st.rk + st.team} className={st.highlight ? 'highlight-row' : ''}>
                                <td><strong>{st.rk}</strong></td>
                                <td>{st.highlight ? '🏀 ' : ''}<strong>{st.team}</strong></td>
                                <td>{st.w}</td>
                                <td>{st.l}</td>
                                <td>{st.pct}</td>
                                <td>{st.gb}</td>
                                <td>{st.home}</td>
                                <td>{st.away}</td>
                                <td>
                                    <span className={st.strk.includes('W') ? 'stat-pill highlight' : 'stat-pill'}>
                                        {st.strk}
                                    </span>
                                </td>
                                <td>{st.l10}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
