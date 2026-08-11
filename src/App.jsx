import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import AuthPortal from './components/AuthPortal';
import TicketModal from './components/TicketModal';
import VideoModal from './components/VideoModal';
import EditPlayerModal from './components/EditPlayerModal';

import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import RosterPage from './pages/RosterPage';
import StatsPage from './pages/StatsPage';
import StandingsPage from './pages/StandingsPage';
import FilmPage from './pages/FilmPage';
import PlayerPropsPage from './pages/PlayerPropsPage';
import PlayerBioPage from './pages/PlayerBioPage';
import GameCenterPage from './pages/GameCenterPage';

export default function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [activeSeason, setActiveSeason] = useState('season2');
    const [playerSlugParam, setPlayerSlugParam] = useState(null);
    const [gameSlugParam, setGameSlugParam] = useState(null);

    // PERSISTENT USER & CLAIMING REGISTRIES (CLEARED TO FRESH 100% UNCLAIMED DATABASE)
    const [currentUser, setCurrentUser] = useState(null);
    const [claimedPlayers, setClaimedPlayers] = useState({});
    const [customPlayerBios, setCustomPlayerBios] = useState({});

    // Wipe browser storage once on mount to guarantee fresh clean database
    useEffect(() => {
        localStorage.removeItem('users_db');
        localStorage.removeItem('monkey_kings_user');
        localStorage.removeItem('claimed_players');
        localStorage.removeItem('custom_player_bios');
    }, []);

    // MODAL STATES
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [videoModalData, setVideoModalData] = useState({ isOpen: false, title: '', src: '' });
    const [editPlayerTarget, setEditPlayerTarget] = useState(null);

    // Save Claimed Players & Custom Bios to localStorage
    useEffect(() => {
        localStorage.setItem('claimed_players', JSON.stringify(claimedPlayers));
    }, [claimedPlayers]);

    useEffect(() => {
        localStorage.setItem('custom_player_bios', JSON.stringify(customPlayerBios));
    }, [customPlayerBios]);

    // Handle Hash Route Syncing & Browser Back/Forward
    const syncRouteFromHash = () => {
        const hash = window.location.hash.replace('#', '').trim();
        if (!hash) {
            setActiveTab('home');
            setPlayerSlugParam(null);
            setGameSlugParam(null);
            return;
        }

        if (hash.startsWith('player-bio/')) {
            const slug = hash.replace('player-bio/', '');
            setActiveTab('player-bio');
            setPlayerSlugParam(slug);
            setGameSlugParam(null);
        } else if (hash.startsWith('game/')) {
            const slug = hash.replace('game/', '');
            setActiveTab('game');
            setGameSlugParam(slug);
            setPlayerSlugParam(null);
        } else {
            const known = ['home', 'schedule', 'roster', 'stats', 'standings', 'film', 'player-props'];
            if (known.includes(hash)) {
                setActiveTab(hash);
                setPlayerSlugParam(null);
                setGameSlugParam(null);
            } else {
                setActiveTab('home');
            }
        }
    };

    useEffect(() => {
        syncRouteFromHash();
        window.addEventListener('popstate', syncRouteFromHash);
        return () => window.removeEventListener('popstate', syncRouteFromHash);
    }, []);

    const navigateToTab = (tabId, updateHash = true) => {
        setActiveTab(tabId);
        setPlayerSlugParam(null);
        setGameSlugParam(null);
        if (updateHash && window.location.hash !== `#${tabId}`) {
            window.history.pushState({ tab: tabId }, '', `#${tabId}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenPlayerBio = (slug, updateHash = true) => {
        setActiveTab('player-bio');
        setPlayerSlugParam(slug);
        if (updateHash && window.location.hash !== `#player-bio/${slug}`) {
            window.history.pushState({ tab: 'player-bio', slug }, '', `#player-bio/${slug}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenGamePage = (slug, updateHash = true) => {
        setActiveTab('game');
        setGameSlugParam(slug);
        if (updateHash && window.location.hash !== `#game/${slug}`) {
            window.history.pushState({ tab: 'game', slug }, '', `#game/${slug}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOAuthLogin = (oauthUser) => {
        // Automatically claim target player if available
        if (oauthUser.claimedPlayerId && !claimedPlayers[oauthUser.claimedPlayerId]) {
            setClaimedPlayers(prev => {
                const updated = {
                    ...prev,
                    [oauthUser.claimedPlayerId]: { claimedBy: oauthUser.name, phone: oauthUser.phone, email: oauthUser.email }
                };
                localStorage.setItem('claimed_players', JSON.stringify(updated));
                return updated;
            });
        }
        setCurrentUser(oauthUser);
        localStorage.setItem('monkey_kings_user', JSON.stringify(oauthUser));
        setIsAuthOpen(false);
    };

    const handleLogin = (email) => {
        const name = email.split('@')[0];
        const user = { name: name.charAt(0).toUpperCase() + name.slice(1), email, provider: 'Email Auth', tokens: 1250 };
        setCurrentUser(user);
        localStorage.setItem('monkey_kings_user', JSON.stringify(user));
        setIsAuthOpen(false);
    };

    const handleSignup = ({ firstName, lastName, name, phone, email, claimedPlayerId, matchedPlayerName }) => {
        // Register claim
        setClaimedPlayers(prev => {
            const updated = {
                ...prev,
                [claimedPlayerId]: { claimedBy: name, phone: phone, email: email }
            };
            localStorage.setItem('claimed_players', JSON.stringify(updated));
            return updated;
        });

        const user = {
            firstName: firstName,
            lastName: lastName,
            name: name,
            phone: phone,
            email: email,
            claimedPlayerId: claimedPlayerId,
            provider: 'Verified Teammate',
            tokens: 1500
        };

        setCurrentUser(user);
        localStorage.setItem('monkey_kings_user', JSON.stringify(user));
        alert(`🎉 3-Way Verification Success!\n\nWelcome ${name}! Your details matched official roster record (${matchedPlayerName}). You have automatically claimed your player profile (+250 Bonus Tokens awarded).`);
        setIsAuthOpen(false);
    };

    const handleSavePlayerCustomization = (updatedData) => {
        setCustomPlayerBios(prev => {
            const updated = {
                ...prev,
                [updatedData.id]: updatedData
            };
            localStorage.setItem('custom_player_bios', JSON.stringify(updated));
            return updated;
        });
        alert(`✨ Player profile for ${updatedData.id} successfully updated and saved!`);
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('monkey_kings_user');
            setCurrentUser(null);
            setIsAuthOpen(true);
        }
    };

    const handleUpdateTokens = (delta) => {
        if (!currentUser) return;
        const updated = { ...currentUser, tokens: (currentUser.tokens || 1250) + delta };
        setCurrentUser(updated);
        localStorage.setItem('monkey_kings_user', JSON.stringify(updated));
    };

    return (
        <div className={`app-wrapper ${!currentUser ? 'auth-locked' : ''}`}>
            {/* ESPN HEADER */}
            <Header
                activeSeason={activeSeason}
                setActiveSeason={setActiveSeason}
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenTicketModal={() => setIsTicketOpen(true)}
                onLogout={handleLogout}
            />

            {/* NAV BAR */}
            <Navbar activeTab={activeTab} onNavigate={(tab) => navigateToTab(tab)} />

            {/* MAIN CONTENT AREA */}
            <main className="main-content-container">
                {activeTab === 'home' && (
                    <HomePage
                        activeSeason={activeSeason}
                        onNavigate={navigateToTab}
                        onOpenPlayerBio={handleOpenPlayerBio}
                        onOpenGamePage={handleOpenGamePage}
                        onOpenTicketModal={() => setIsTicketOpen(true)}
                    />
                )}
                {activeTab === 'schedule' && (
                    <SchedulePage
                        activeSeason={activeSeason}
                        onOpenGamePage={handleOpenGamePage}
                    />
                )}
                {activeTab === 'roster' && (
                    <RosterPage
                        activeSeason={activeSeason}
                        customPlayerBios={customPlayerBios}
                        onOpenPlayerBio={handleOpenPlayerBio}
                    />
                )}
                {activeTab === 'stats' && (
                    <StatsPage
                        activeSeason={activeSeason}
                        onOpenPlayerBio={handleOpenPlayerBio}
                    />
                )}
                {activeTab === 'standings' && (
                    <StandingsPage activeSeason={activeSeason} />
                )}
                {activeTab === 'film' && (
                    <FilmPage
                        onPlayVideo={(title, video) => setVideoModalData({ isOpen: true, title, src: video })}
                    />
                )}
                {activeTab === 'player-props' && (
                    <PlayerPropsPage
                        currentUser={currentUser}
                        onUpdateTokens={handleUpdateTokens}
                    />
                )}
                {activeTab === 'player-bio' && (
                    <PlayerBioPage
                        playerSlug={playerSlugParam}
                        activeSeason={activeSeason}
                        currentUser={currentUser}
                        customPlayerBios={customPlayerBios}
                        claimedPlayers={claimedPlayers}
                        onBack={() => window.history.back()}
                        onOpenEditModal={(player) => setEditPlayerTarget(player)}
                    />
                )}
                {activeTab === 'game' && (
                    <GameCenterPage
                        gameSlug={gameSlugParam}
                        activeSeason={activeSeason}
                        onBack={() => window.history.back()}
                        onOpenPlayerBio={handleOpenPlayerBio}
                    />
                )}
            </main>

            {/* MODALS */}
            <AuthPortal
                isOpen={isAuthOpen}
                claimedPlayers={claimedPlayers}
                onClose={() => setIsAuthOpen(false)}
                onLogin={handleLogin}
                onSignup={handleSignup}
                onOAuthLogin={handleOAuthLogin}
                onDemoLogin={() => {
                    handleLogin('demo@monkeykings.com');
                }}
            />
            <TicketModal
                isOpen={isTicketOpen}
                userEmail={currentUser?.email}
                onClose={() => setIsTicketOpen(false)}
            />
            <VideoModal
                isOpen={videoModalData.isOpen}
                title={videoModalData.title}
                videoSrc={videoModalData.src}
                onClose={() => setVideoModalData({ isOpen: false, title: '', src: '' })}
            />
            <EditPlayerModal
                isOpen={!!editPlayerTarget}
                player={editPlayerTarget}
                onClose={() => setEditPlayerTarget(null)}
                onSave={handleSavePlayerCustomization}
            />
        </div>
    );
}
