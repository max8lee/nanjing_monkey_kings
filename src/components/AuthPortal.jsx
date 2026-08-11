import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck, X, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react';
import { findMatchingRosterPlayer } from '../data/teamData';

export default function AuthPortal({ isOpen, onClose, onLogin, onSignup, onOAuthLogin, onDemoLogin, claimedPlayers = {} }) {
    const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup' | 'oauth_verify'
    
    // Login Form State (Username or Email + Password)
    const [loginIdentity, setLoginIdentity] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup / Mandatory Setup State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [username, setUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    
    // OAuth State
    const [pendingOAuthData, setPendingOAuthData] = useState(null);
    const [isOAuthLoading, setIsOAuthLoading] = useState(null);
    const [verificationError, setVerificationError] = useState('');

    if (!isOpen) return null;

    // Retrieve persistent registered users database
    const getUsersDB = () => {
        try {
            const raw = localStorage.getItem('users_db');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    };

    const saveUserToDB = (newUser) => {
        const db = getUsersDB();
        const existingIdx = db.findIndex(u => (u.email && u.email === newUser.email) || (u.username && u.username.toLowerCase() === newUser.username.toLowerCase()));
        if (existingIdx >= 0) {
            db[existingIdx] = { ...db[existingIdx], ...newUser };
        } else {
            db.push(newUser);
        }
        localStorage.setItem('users_db', JSON.stringify(db));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setVerificationError('');

        const cleanIdent = loginIdentity.trim().toLowerCase();
        const db = getUsersDB();

        // Find user by Username or Email
        const foundUser = db.find(u => 
            (u.email && u.email.toLowerCase() === cleanIdent) || 
            (u.username && u.username.toLowerCase() === cleanIdent)
        );

        if (foundUser) {
            if (foundUser.password && foundUser.password !== loginPassword) {
                setVerificationError('❌ Incorrect password. Please check your credentials.');
                return;
            }
            onOAuthLogin(foundUser);
            return;
        }

        // Fallback for standard first-time email login
        onLogin(loginIdentity, loginPassword);
    };

    const handleVerifyAndClaimSubmit = (e, isOAuthFlow = false) => {
        e.preventDefault();
        setVerificationError('');

        if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
            setVerificationError('First Name, Last Name, and Phone Number are mandatory to claim your player profile.');
            return;
        }

        if (!username.trim() || !signupPassword.trim()) {
            setVerificationError('Creating a Username and Password is mandatory for account setup.');
            return;
        }

        // Check if username is taken
        const db = getUsersDB();
        const existingUser = db.find(u => u.username && u.username.toLowerCase() === username.trim().toLowerCase());
        if (existingUser && (!pendingOAuthData || existingUser.email !== pendingOAuthData.email)) {
            setVerificationError(`❌ Username "${username.trim()}" is already taken. Please choose another username.`);
            return;
        }

        // Run 3-Way Verification Match against Roster Dataset (Google Sheet Column F)
        const matchedPlayer = findMatchingRosterPlayer(firstName, lastName, phone);

        if (!matchedPlayer) {
            setVerificationError(`❌ Verification Failed: "${firstName.trim()} ${lastName.trim()}" (${phone.trim()}) does not match any active player on the official Monkey Kings roster database. Please check your details.`);
            return;
        }

        // Check if player is already claimed by another user
        if (claimedPlayers[matchedPlayer.id]) {
            const owner = claimedPlayers[matchedPlayer.id].claimedBy;
            setVerificationError(`🔒 Player Lock Alert: ${matchedPlayer.name} has already been claimed by ${owner}.`);
            return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;

        const newUserAccount = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            name: fullName,
            phone: phone.trim(),
            username: username.trim(),
            password: signupPassword.trim(),
            email: isOAuthFlow && pendingOAuthData ? pendingOAuthData.email : (signupEmail.trim() || `${username.trim()}@monkeykings.com`),
            claimedPlayerId: matchedPlayer.id,
            matchedPlayerName: matchedPlayer.name,
            provider: isOAuthFlow && pendingOAuthData ? pendingOAuthData.provider : 'Verified Teammate',
            tokens: 1750
        };

        saveUserToDB(newUserAccount);

        if (isOAuthFlow) {
            onOAuthLogin(newUserAccount);
        } else {
            onSignup(newUserAccount);
        }
    };

    const triggerOAuthFlow = (provider) => {
        setIsOAuthLoading(provider);
        setVerificationError('');

        setTimeout(() => {
            const mockEmail = provider === 'google' ? 'google.user@gmail.com' : 'github.user@github.com';
            const db = getUsersDB();

            // CHECK IF THIS OAUTH ACCOUNT HAS ALREADY BEEN CREATED & VERIFIED BEFORE
            const existingAccount = db.find(u => u.email === mockEmail || u.provider.includes(provider === 'google' ? 'Google' : 'GitHub'));

            setIsOAuthLoading(null);

            if (existingAccount && existingAccount.claimedPlayerId) {
                // ONE-TIME REQUIREMENT MET! LOG IN INSTANTLY WITHOUT ASKING AGAIN!
                onOAuthLogin(existingAccount);
            } else {
                // FIRST TIME SETUP REQUIRED: Prompt for Name, Phone, Username, Password
                setPendingOAuthData({
                    email: mockEmail,
                    provider: provider === 'google' ? 'Google OAuth 2.0' : 'GitHub OAuth',
                    avatar: provider === 'google' ? 'https://lh3.googleusercontent.com/a/default-user' : 'https://github.githubassets.com/favicons/favicon.png'
                });
                setAuthTab('oauth_verify');
            }
        }, 500);
    };

    const handleCancelOAuthVerify = () => {
        setAuthTab('login');
        setPendingOAuthData(null);
        setVerificationError('');
    };

    return (
        <div className="auth-portal-overlay active">
            <div className="auth-portal-card" style={{ maxWidth: '540px' }}>
                {onClose && (
                    <button className="modal-close-btn" onClick={onClose} title="Close Portal">
                        <X size={18} />
                    </button>
                )}

                <div className="auth-portal-header">
                    <img src="/assets/full-logo.webp" alt="Nanjing Monkey Kings" className="auth-logo" />
                    <h2>NANJING MONKEY KINGS</h2>
                    <p className="auth-sub">Official Teammate Claiming & Access Portal</p>
                </div>

                {authTab !== 'oauth_verify' && (
                    <>
                        {/* ONE-CLICK GOOGLE OAUTH SIGN-IN */}
                        <div className="oauth-buttons-wrapper">
                            <button
                                type="button"
                                className="btn-oauth google-btn"
                                onClick={() => triggerOAuthFlow('google')}
                                disabled={isOAuthLoading !== null}
                            >
                                <svg className="oauth-icon" viewBox="0 0 24 24" width="18" height="18">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                </svg>
                                {isOAuthLoading === 'google' ? 'Authenticating Google OAuth...' : 'Sign in with Google OAuth'}
                            </button>
                        </div>

                        <div className="auth-demo-divider">OR TEAMMATE LOGIN</div>

                        <div className="auth-tabs">
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
                                <UserPlus size={16} /> REGISTER PLAYER
                            </button>
                        </div>
                    </>
                )}

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

                {authTab === 'oauth_verify' ? (
                    /* MANDATORY FIRST-TIME ACCOUNT CREATION & VERIFICATION FORM */
                    <form className="auth-form active" style={{ marginTop: '1rem' }} onSubmit={(e) => handleVerifyAndClaimSubmit(e, true)}>
                        <div style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid var(--gold-primary)',
                            padding: '0.84rem 1rem',
                            borderRadius: '10px',
                            marginBottom: '1rem',
                            fontSize: '0.83rem',
                            color: 'var(--gold-text)'
                        }}>
                            <Sparkles size={16} style={{ marginRight: '6px' }} />
                            <strong>First-Time Sign Up Setup!</strong> Please enter your Roster details (First Name, Last Name, Phone Number) and set up your Username and Password.
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label>First Name (Required)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Max"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name (Required)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Lee"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number (Required)</label>
                            <input
                                type="tel"
                                required
                                placeholder="999-999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                You must sign up with your phone number to claim your player profile.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label>Create Username</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="monkeymax"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Create Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
                            <button
                                type="button"
                                className="btn-bio-back"
                                style={{ flex: '1', justifyContent: 'center' }}
                                onClick={handleCancelOAuthVerify}
                            >
                                <ArrowLeft size={16} /> CANCEL
                            </button>
                            <button type="submit" className="btn-auth-submit" style={{ flex: '2', marginTop: 0 }}>
                                VERIFY & COMPLETE SETUP
                            </button>
                        </div>
                    </form>
                ) : authTab === 'login' ? (
                    <form className="auth-form active" onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label>Username or Email</label>
                            <input
                                type="text"
                                required
                                placeholder="monkeymax or max@monkeykings.com"
                                value={loginIdentity}
                                onChange={(e) => setLoginIdentity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-auth-submit">
                            SIGN IN TO TEAM SITE
                        </button>
                    </form>
                ) : (
                    <form className="auth-form active" onSubmit={(e) => handleVerifyAndClaimSubmit(e, false)}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label>First Name (Mandatory)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Max"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name (Mandatory)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Lee"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number (Mandatory Roster Verification)</label>
                            <input
                                type="tel"
                                required
                                placeholder="999-999-9999"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                🔒 First Name, Last Name, and Phone Number must match Column F of official sheet.
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="max@monkeykings.com"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div className="form-group">
                                <label>Create Username</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="monkeymax"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Create Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-auth-submit" style={{ marginTop: '1.2rem' }}>
                            VERIFY & REGISTER PLAYER ACCOUNT
                        </button>
                    </form>
                )}

                <button type="button" className="btn-demo-access" onClick={onDemoLogin}>
                    <ShieldCheck size={16} /> CONTINUE AS GUEST FAN
                </button>
            </div>
        </div>
    );
}
