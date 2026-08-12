import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import {
    getUser,
    saveUser,
    updateUser,
    getAllClaimedPlayers,
    claimPlayer,
    getAllCustomBios,
    saveCustomBio,
    getSeasonGames,
    getSeasonPlayerLogs
} from './firebaseDb';

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
    const [filmSlugParam, setFilmSlugParam] = useState(null);

    // USER & SHARED DATA
    const [currentUser, setCurrentUser] = useState(null);
    const [claimedPlayers, setClaimedPlayers] = useState({});
    const [customPlayerBios, setCustomPlayerBios] = useState({});
    const [seasonGames, setSeasonGames] = useState([]);
    const [seasonLogs, setSeasonLogs] = useState([]);

    // authReady: true once Firebase has resolved the initial auth state
    // Prevents a flash of the auth modal for already-signed-in users
    const [authReady, setAuthReady] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [videoModalData, setVideoModalData] = useState({ isOpen: false, title: '', src: '' });
    const [editPlayerTarget, setEditPlayerTarget] = useState(null);

    // ── Firebase Auth listener + shared data load on mount ───────────────────
    useEffect(() => {
        // Load shared data visible to all users
        getAllClaimedPlayers().then(setClaimedPlayers).catch(() => {});
        getAllCustomBios().then(setCustomPlayerBios).catch(() => {});


        // Listen for auth state — fires immediately with current user or null.
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Slight delay to ensure the Auth token is fully propagated to the Firestore SDK
                await new Promise(r => setTimeout(r, 500));

                let profile = null;
                try { 
                    profile = await getUser(firebaseUser.uid); 
                } catch (err) {
                    console.error("Failed to fetch user profile:", err);
                }

                if (profile) {
                    // Known user with a Firestore profile — log them in
                    setCurrentUser(profile);
                    setIsAuthOpen(false);
                } else {
                    // Firebase Auth user exists but no Firestore profile yet.
                    setCurrentUser(null);
                    setIsAuthOpen(true);
                }
            } else {
                setCurrentUser(null);
                setIsAuthOpen(true);
            }
            setAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // ── Hash Route Syncing & Browser Back/Forward ────────────────────────────
    const syncRouteFromHash = () => {
        const hash = window.location.hash.replace('#', '').trim();
        if (!hash) {
            setActiveTab('home');
            setPlayerSlugParam(null);
            setGameSlugParam(null);
            return;
        }
        if (hash.startsWith('player-bio/')) {
            setActiveTab('player-bio');
            setPlayerSlugParam(hash.replace('player-bio/', ''));
            setGameSlugParam(null);
            setFilmSlugParam(null);
        } else if (hash.startsWith('game/')) {
            setActiveTab('game');
            setGameSlugParam(hash.replace('game/', ''));
            setPlayerSlugParam(null);
            setFilmSlugParam(null);
        } else if (hash.startsWith('film/')) {
            setActiveTab('film');
            setFilmSlugParam(hash.replace('film/', ''));
            setPlayerSlugParam(null);
            setGameSlugParam(null);
        } else {
            const known = ['home', 'schedule', 'roster', 'stats', 'standings', 'film', 'player-props'];
            setActiveTab(known.includes(hash) ? hash : 'home');
            setPlayerSlugParam(null);
            setGameSlugParam(null);
            setFilmSlugParam(null);
        }
    };

    useEffect(() => {
        syncRouteFromHash();
        window.addEventListener('popstate', syncRouteFromHash);
        return () => window.removeEventListener('popstate', syncRouteFromHash);
    }, []);

    useEffect(() => {
        setSeasonGames([]);
        setSeasonLogs([]);
        getSeasonGames(activeSeason).then(setSeasonGames).catch(() => {});
        getSeasonPlayerLogs(activeSeason).then(setSeasonLogs).catch(() => {});
    }, [activeSeason]);

    // ── Navigation ───────────────────────────────────────────────────────────
    const navigateToTab = (tabId, updateHash = true) => {
        setActiveTab(tabId);
        setPlayerSlugParam(null);
        setGameSlugParam(null);
        setFilmSlugParam(null);
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

    const handleOpenFilmPage = (slug, updateHash = true) => {
        setActiveTab('film');
        setFilmSlugParam(slug);
        if (updateHash && window.location.hash !== `#film/${slug}`) {
            window.history.pushState({ tab: 'film', slug }, '', `#film/${slug}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Auth Handlers (called by AuthPortal) ─────────────────────────────────



    // Full email signup after roster verification or fan registration
    const handleSignup = async (uid, { firstName, lastName, name, phone, email, username, claimedPlayerId, matchedPlayerName, favoritePlayer }) => {
        if (claimedPlayerId) {
            const claimData = { claimedBy: name, phone, email };
            await claimPlayer(claimedPlayerId, claimData);
            setClaimedPlayers(prev => ({ ...prev, [claimedPlayerId]: claimData }));
        }

        const userProfile = {
            firstName, lastName, name, phone, email, username,
            ...(claimedPlayerId ? { claimedPlayerId } : {}),
            ...(favoritePlayer ? { favoritePlayer } : {}),
            provider: claimedPlayerId ? 'Verified Teammate' : 'Registered Fan',
            tokens: claimedPlayerId ? 1500 : 1250,
        };

        await saveUser(uid, userProfile);
        const saved = await getUser(uid);
        setCurrentUser(saved);
        
        if (claimedPlayerId) {
            alert(`🎉 3-Way Verification Success!\n\nWelcome ${name}! Your details matched official roster record (${matchedPlayerName}). You have automatically claimed your player profile (+250 Bonus Tokens awarded).`);
        } else {
            alert(`🎉 Registration Success!\n\nWelcome ${name}! Your fan account has been created.`);
        }
        setIsAuthOpen(false);
    };

    const handleSavePlayerCustomization = async (updatedData) => {
        try {
            await saveCustomBio(updatedData.id, updatedData);
            setCustomPlayerBios(prev => ({ ...prev, [updatedData.id]: updatedData }));
            alert(`✨ Player profile for ${updatedData.id} successfully updated and saved!`);
        } catch (error) {
            console.error("Failed to save bio:", error);
            alert(`❌ Failed to save profile: ${error.message}`);
        }
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to sign out?')) {
            await signOut(auth);
            setCurrentUser(null);
            setIsAuthOpen(true);
        }
    };

    const handleUpdateTokens = async (delta) => {
        if (!currentUser?.uid) return;
        const newTokens = (currentUser.tokens || 1250) + delta;
        const updated = { ...currentUser, tokens: newTokens };
        setCurrentUser(updated);
        await updateUser(currentUser.uid, { tokens: newTokens });
    };

    // Don't render until Firebase has resolved auth state (prevents modal flash)
    if (!authReady) return null;

    return (
        <div className={`app-wrapper ${!currentUser ? 'auth-locked' : ''}`}>
            <Header
                activeSeason={activeSeason}
                setActiveSeason={setActiveSeason}
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenTicketModal={() => setIsTicketOpen(true)}
                onLogout={handleLogout}
                onNavigate={navigateToTab}
                onOpenPlayerBio={handleOpenPlayerBio}
            />

            <Navbar activeTab={activeTab} onNavigate={(tab) => navigateToTab(tab)} />

            <main className="main-content-container">
                {activeTab === 'home' && (
                    <HomePage
                        activeSeason={activeSeason}
                        seasonGames={seasonGames}
                        seasonLogs={seasonLogs}
                        onNavigate={navigateToTab}
                        onOpenPlayerBio={handleOpenPlayerBio}
                        onOpenGamePage={handleOpenGamePage}
                        onOpenFilmPage={handleOpenFilmPage}
                        onOpenTicketModal={() => setIsTicketOpen(true)}
                        currentUser={currentUser}
                    />
                )}
                {activeTab === 'schedule' && (
                    <SchedulePage 
                        activeSeason={activeSeason} 
                        seasonGames={seasonGames}
                        onOpenGamePage={handleOpenGamePage} 
                    />
                )}
                {activeTab === 'roster' && (
                    <RosterPage
                        activeSeason={activeSeason}
                        customPlayerBios={customPlayerBios}
                        seasonLogs={seasonLogs}
                        onOpenPlayerBio={handleOpenPlayerBio}
                    />
                )}
                {activeTab === 'stats' && (
                    <StatsPage 
                        activeSeason={activeSeason} 
                        seasonLogs={seasonLogs}
                        onOpenPlayerBio={handleOpenPlayerBio} 
                    />
                )}
                {activeTab === 'standings' && (
                    <StandingsPage activeSeason={activeSeason} />
                )}
                {activeTab === 'film' && (
                    <FilmPage
                        filmSlug={filmSlugParam}
                        onOpenFilmPage={handleOpenFilmPage}
                        onPlayVideo={(title, video) => setVideoModalData({ isOpen: true, title, src: video })}
                    />
                )}
                {activeTab === 'player-props' && (
                    <PlayerPropsPage currentUser={currentUser} onUpdateTokens={handleUpdateTokens} />
                )}
                {activeTab === 'player-bio' && (
                    <PlayerBioPage
                        playerSlug={playerSlugParam}
                        activeSeason={activeSeason}
                        currentUser={currentUser}
                        customPlayerBios={customPlayerBios}
                        claimedPlayers={claimedPlayers}
                        seasonGames={seasonGames}
                        seasonLogs={seasonLogs}
                        onBack={() => window.history.back()}
                        onOpenEditModal={(player) => setEditPlayerTarget(player)}
                        onOpenGamePage={handleOpenGamePage}
                    />
                )}
                {activeTab === 'game' && (
                    <GameCenterPage
                        gameSlug={gameSlugParam}
                        activeSeason={activeSeason}
                        seasonGames={seasonGames}
                        seasonLogs={seasonLogs}
                        customPlayerBios={customPlayerBios}
                        onBack={() => window.history.back()}
                        onOpenPlayerBio={handleOpenPlayerBio}
                    />
                )}
            </main>

            <AuthPortal
                isOpen={isAuthOpen}
                claimedPlayers={claimedPlayers}
                onLogin={(user, profile) => {
                    setCurrentUser(profile);
                    setIsAuthOpen(false);
                }}
                onSignup={handleSignup}
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
