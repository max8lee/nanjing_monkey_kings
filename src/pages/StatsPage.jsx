import React, { useMemo, useState } from 'react';
import { getMergedRoster, getPlayerSlug } from '../data/teamData';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function StatsPage({ activeSeason, seasonLogs, onOpenPlayerBio }) {
    const [sortConfig, setSortConfig] = useState({ key: 'ppg', direction: 'desc' });

    const sourceData = useMemo(() => {
        const merged = getMergedRoster(activeSeason, {}, seasonLogs);
        return merged.filter(p => p.gp > 0).map(p => ({
            id: p.id,
            name: p.name,
            pos: p.pos,
            gp: p.gp,
            ppg: p.ppg,
            rpg: p.rpg,
            or: p.orpg,
            dr: p.drpg,
            apg: p.apg,
            spg: p.spg,
            bpg: p.bpg,
            fg: p.fgPct,
            p3: p.p3Pct,
            ft: p.ftPct,
            to: p.topg
        }));
    }, [activeSeason, seasonLogs]);

    const sortedData = useMemo(() => {
        const data = [...sourceData];
        data.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];
            
            // Handle percentage strings like "50.0%"
            if (typeof aVal === 'string' && aVal.includes('%')) {
                aVal = parseFloat(aVal) || 0;
            }
            if (typeof bVal === 'string' && bVal.includes('%')) {
                bVal = parseFloat(bVal) || 0;
            }
            
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return data;
    }, [sourceData, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'asc' ? 
            <ArrowUp size={12} style={{ marginLeft: '4px', display: 'inline' }}/> : 
            <ArrowDown size={12} style={{ marginLeft: '4px', display: 'inline' }}/>;
    };

    return (
        <div className="page-section active">
            <div className="section-header-bar">
                <h2>{activeSeason === 'season1' ? 'SEASON 1 STATS' : 'SEASON 2 STATS'}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click any column header to sort • Click row to view player</span>
            </div>

            <div className="schedule-table-wrapper">
                <table className="espn-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>PLAYER <SortIcon columnKey="name" /></th>
                            <th onClick={() => handleSort('pos')} style={{cursor: 'pointer'}}>POS <SortIcon columnKey="pos" /></th>
                            <th onClick={() => handleSort('gp')} style={{cursor: 'pointer'}}>GP <SortIcon columnKey="gp" /></th>
                            <th onClick={() => handleSort('ppg')} style={{cursor: 'pointer'}}>PTS <SortIcon columnKey="ppg" /></th>
                            <th onClick={() => handleSort('rpg')} style={{cursor: 'pointer'}}>REB <SortIcon columnKey="rpg" /></th>
                            <th onClick={() => handleSort('or')} style={{cursor: 'pointer'}}>OR <SortIcon columnKey="or" /></th>
                            <th onClick={() => handleSort('dr')} style={{cursor: 'pointer'}}>DR <SortIcon columnKey="dr" /></th>
                            <th onClick={() => handleSort('apg')} style={{cursor: 'pointer'}}>AST <SortIcon columnKey="apg" /></th>
                            <th onClick={() => handleSort('spg')} style={{cursor: 'pointer'}}>STL <SortIcon columnKey="spg" /></th>
                            <th onClick={() => handleSort('bpg')} style={{cursor: 'pointer'}}>BLK <SortIcon columnKey="bpg" /></th>
                            <th onClick={() => handleSort('to')} style={{cursor: 'pointer'}}>TO <SortIcon columnKey="to" /></th>
                            <th onClick={() => handleSort('fg')} style={{cursor: 'pointer'}}>FG% <SortIcon columnKey="fg" /></th>
                            <th onClick={() => handleSort('p3')} style={{cursor: 'pointer'}}>3P% <SortIcon columnKey="p3" /></th>
                            <th onClick={() => handleSort('ft')} style={{cursor: 'pointer'}}>FT% <SortIcon columnKey="ft" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((s) => {
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
                                    <td><strong>{s.ppg}</strong></td>
                                    <td>{s.rpg}</td>
                                    <td>{s.or}</td>
                                    <td>{s.dr}</td>
                                    <td>{s.apg}</td>
                                    <td>{s.spg}</td>
                                    <td>{s.bpg}</td>
                                    <td>{s.to}</td>
                                    <td>{s.fg}</td>
                                    <td>{s.p3}</td>
                                    <td>{s.ft}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
