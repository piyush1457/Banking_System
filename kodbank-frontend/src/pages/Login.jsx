import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            // Backend sets HttpOnly cookie "kodbank_token" on success
            await api.post('/auth/login', form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-bg">
            <div className="glass-card">
                {/* Brand */}
                <div className="brand">
                    <div className="brand-icon">🔐</div>
                    <h1>KodBank</h1>
                    <p>Sign in to your account</p>
                </div>

                {/* Error */}
                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            name="username" value={form.username}
                            onChange={handleChange}
                            className="form-input" placeholder="Enter your username"
                            required autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password" name="password" value={form.password}
                            onChange={handleChange}
                            className="form-input" placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Sign In →'}
                    </button>
                </form>

                <div className="divider">or</div>

                <div className="form-footer">
                    New to KodBank? <Link to="/register">Create an account</Link>
                </div>

                {/* Security hint */}
                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', marginTop: '1.2rem' }}>
                    🔒 Your session is secured with JWT Authentication
                </p>
            </div>
        </div>
    );
}
