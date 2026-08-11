import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { LogIn, UserPlus, ShieldCheck, X, ShieldAlert } from 'lucide-react';
import { auth } from '../firebase';
import { getUser, getAuthEmailByUsername, claimUsername } from '../firebaseDb';
import { findMatchingRosterPlayer } from '../data/teamData';

export default function AuthPortal({ isOpen, claimedPlayers = {}, onLogin, onSignup }) {
    const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup' | 'fan_signup'

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [favoritePlayer, setFavoritePlayer] = useState('');

    const [verificationError, setVerificationError] = useState('');

    if (!isOpen) return null;

    // ── Email login ───────────────────────────────────────────────────────────
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setVerificationError('');
        try {
            let emailToUse = loginEmail.trim();
            if (!emailToUse.includes('@')) {
                const foundEmail = await getAuthEmailByUsername(emailToUse);
                if (foundEmail) {
                    emailToUse = foundEmail;
                } else {
                    throw { code: 'auth/user-not-found' };
                }
            }
            const result = await signInWithEmailAndPassword(auth, emailToUse, loginPassword);
            const profile = await getUser(result.user.uid);
            onLogin(result.user, profile || { email: result.user.email, name: result.user.email.split('@')[0], tokens: 1250 });
        } catch (err) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setVerificationError('❌ Incorrect email/username or password.');
            } else {
                setVerificationError(`❌ Login error: ${err.message}`);
            }
        }
    };

    // ── Shared verification logic ─────────────────────────────────────────────
    const runVerificationAndSave = async (isFan = false) => {
        if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
            setVerificationError('First Name, Last Name, and Phone Number are required.');
            return;
        }

        if (!signupUsername.trim()) {
            setVerificationError('A username is required to create your account.');
            return;
        }

        if (!signupPassword.trim()) {
            setVerificationError('A password is required to create your account.');
            return;
        }

        let matchedPlayer = null;
        if (!isFan) {
            matchedPlayer = findMatchingRosterPlayer(firstName, lastName, phone);
            if (!matchedPlayer) {
                setVerificationError(`❌ Verification Failed: "${firstName.trim()} ${lastName.trim()}" (${phone.trim()}) does not match any active player on the official roster.`);
                return;
            }

            if (claimedPlayers[matchedPlayer.id]) {
                const owner = claimedPlayers[matchedPlayer.id].claimedBy;
                setVerificationError(`🔒 Player Lock: ${matchedPlayer.name} has already been claimed by ${owner}.`);
                return;
            }
        } else {
            if (!favoritePlayer.trim()) {
                setVerificationError('Please enter your favorite player.');
                return;
            }
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const contactEmail = signupEmail.trim();
        const username = signupUsername.trim().toLowerCase();

        if (username.includes('@')) {
            setVerificationError('Username cannot contain an @ symbol.');
            return;
        }

        const authEmail = contactEmail;

        try {
            const existing = await getAuthEmailByUsername(username);
            if (existing) {
                setVerificationError('❌ Username is already taken.');
                return;
            }

            const result = await createUserWithEmailAndPassword(auth, authEmail, signupPassword.trim());
            await claimUsername(username, authEmail);

            onSignup(result.user.uid, {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                name: fullName,
                phone: phone.trim(),
                email: contactEmail,
                username: username,
                ...(isFan ? { favoritePlayer: favoritePlayer.trim() } : { claimedPlayerId: matchedPlayer.id, matchedPlayerName: matchedPlayer.name }),
                provider: 'Email & Password',
                tokens: isFan ? 1250 : 1750,
            });
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setVerificationError('❌ An account with this email already exists. Try signing in instead.');
            } else {
                setVerificationError(`❌ Account creation failed: ${err.message}`);
            }
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setVerificationError('');
        await runVerificationAndSave(false);
    };

    const handleFanSignupSubmit = async (e) => {
        e.preventDefault();
        setVerificationError('');
        await runVerificationAndSave(true);
    };

    return (
        <div className="auth-portal-overlay active">
            <div className="auth-portal-card" style={{ maxWidth: '540px' }}>


                <div className="auth-portal-header">
                    <img src="/assets/full-logo.webp" alt="Nanjing Monkey Kings" className="auth-logo" />
                    <h2>NANJING MONKEY KINGS</h2>
                    <p className="auth-sub">Official Teammate Claiming & Access Portal</p>
                </div>

                <div className="auth-tabs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem' }}>
                    <button
                        type="button"
                        className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                        onClick={() => { setAuthTab('login'); setVerificationError(''); }}
                    >
                        <LogIn size={16} /> SIGN IN
                    </button>
                    <button
                        type="button"
                        className={`auth-tab-btn ${authTab === 'signup' ? 'active' : ''}`}
                        onClick={() => { setAuthTab('signup'); setVerificationError(''); }}
                    >
                        <UserPlus size={16} /> PLAYER
                    </button>
                    <button
                        type="button"
                        className={`auth-tab-btn ${authTab === 'fan_signup' ? 'active' : ''}`}
                        onClick={() => { setAuthTab('fan_signup'); setVerificationError(''); }}
                    >
                        <UserPlus size={16} /> FAN
                    </button>
                </div>

                {verificationError && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid #EF4444',
                        color: '#F87171',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                        marginTop: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                    }}>
                        <ShieldAlert size={20} style={{ flexShrink: 0 }} />
                        <span>{verificationError}</span>
                    </div>
                )}

                {authTab === 'login' ? (
                    <form className="auth-form active" onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label>Email / Username</label>
                            <input type="text" name="username" autoComplete="username" required placeholder="max or max@monkeykings.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" autoComplete="current-password" required placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-auth-submit">SIGN IN TO TEAM SITE</button>
                    </form>

                ) : authTab === 'signup' ? (
                    <form className="auth-form active" onSubmit={handleSignupSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" required placeholder="Max" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" required placeholder="Lee" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" required placeholder="999-999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" autoComplete="username" required placeholder="max123" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" autoComplete="email" required placeholder="max@monkeykings.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Create Password</label>
                            <input type="password" name="new-password" autoComplete="new-password" required placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-auth-submit" style={{ marginTop: '1.2rem' }}>
                            VERIFY & REGISTER PLAYER ACCOUNT
                        </button>
                    </form>
                ) : (
                    <form className="auth-form active" onSubmit={handleFanSignupSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" required placeholder="Max" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" required placeholder="Lee" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" required placeholder="999-999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Favorite Player</label>
                            <input type="text" required placeholder="e.g. Max Lee" value={favoritePlayer} onChange={(e) => setFavoritePlayer(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" autoComplete="username" required placeholder="fan123" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" name="email" autoComplete="email" required placeholder="fan@monkeykings.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Create Password</label>
                            <input type="password" name="new-password" autoComplete="new-password" required placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-auth-submit" style={{ marginTop: '1.2rem' }}>
                            REGISTER FAN ACCOUNT
                        </button>
                    </form>
                )}


            </div>
        </div>
    );
}
