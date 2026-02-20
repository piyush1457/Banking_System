import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../api/axios';

// ─── Premium confetti burst ─────────────────────────────────────
function fireConfetti() {
    const duration = 3000;
    const animEnd = Date.now() + duration;
    const colors = ['#6c63ff', '#f72585', '#4cc9f0', '#06d6a0', '#ffd60a'];

    // Center burst
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors,
        zIndex: 9999,
    });

    // Side cannons
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors });

    // Continuous rain
    const frame = () => {
        if (Date.now() < animEnd) {
            confetti({
                particleCount: 4, angle: 60, spread: 55,
                origin: { x: 0 }, colors, zIndex: 9999,
            });
            confetti({
                particleCount: 4, angle: 120, spread: 55,
                origin: { x: 1 }, colors, zIndex: 9999,
            });
            requestAnimationFrame(frame);
        }
    };
    requestAnimationFrame(frame);
}

// ─── Format Indian currency ─────────────────────────────────────
function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
}

// ─── Dashboard Component ────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();

    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkBalance = useCallback(async () => {
        setLoading(true); setError(''); setBalance(null);

        try {
            // JWT cookie sent automatically by axios (withCredentials: true)
            const res = await api.get('/user/balance');
            setBalance(res.data.balance);

            // 🎉 Fire party popper!
            fireConfetti();
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.message || 'Failed to fetch balance. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear cookie by hitting any logout endpoint OR just redirect to login
        // Cookie expires on its own — for demo we just navigate back
        navigate('/login');
    };

    return (
        <div className="page-bg">

            {/* Floating currency symbols decoration */}
            <FloatingSymbols />

            <div className="glass-card dashboard-card">
                {/* Brand */}
                <div className="brand">
                    <div className="brand-icon">💳</div>
                    <h1>KodBank</h1>
                    <p className="welcome-text">Welcome to your dashboard</p>
                </div>

                {/* Divider */}
                <div className="divider">your account</div>

                {/* Stat boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <StatBox icon="🏦" label="Account Type" value="Customer" />
                    <StatBox icon="✅" label="Status" value="Active" />
                </div>

                {/* Error */}
                {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

                {/* Check Balance button */}
                <button
                    className="btn-check-balance"
                    onClick={checkBalance}
                    disabled={loading}
                >
                    {loading
                        ? <><span className="spinner" /> Fetching Balance...</>
                        : '💰 Check Balance'
                    }
                </button>

                {/* Balance result */}
                {balance !== null && (
                    <div className="balance-result">
                        <span className="balance-emoji">🎉</span>
                        <div className="balance-label">Your current balance is</div>
                        <div className="balance-amount">{formatINR(balance)}</div>
                        <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                            Balance verified via JWT-secured API
                        </p>
                    </div>
                )}

                {/* Logout */}
                <button className="btn-logout" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}

// ─── Sub-components ─────────────────────────────────────────────
function StatBox({ icon, label, value }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '0.75rem',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '1.3rem', marginBottom: '0.2rem' }}>{icon}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '0.2rem' }}>{value}</div>
        </div>
    );
}

function FloatingSymbols() {
    const symbols = ['₹', '💰', '🪙', '💳', '🏦', '📈'];
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
            {symbols.map((s, i) => (
                <span key={i} style={{
                    position: 'absolute',
                    top: `${10 + i * 14}%`,
                    left: i % 2 === 0 ? `${3 + i * 2}%` : `${85 - i * 2}%`,
                    fontSize: `${1.2 + (i % 3) * 0.4}rem`,
                    opacity: 0.08,
                    animation: `floatOrb ${6 + i}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.7}s`,
                }}>{s}</span>
            ))}
        </div>
    );
}
