export function formatSeasonString(season) {
    if (!season) return '';
    const upper = season.toUpperCase();
    return upper.replace('SEASON', 'SEASON ');
}
