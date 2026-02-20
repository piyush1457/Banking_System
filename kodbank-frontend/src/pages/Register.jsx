import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        uid: '', username: '', password: '',
        email: '', phone: '', role: 'Customer',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError(''); setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');

        try {
            await api.post('/auth/register', form);
            setSuccess('🎉 Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-bg">
            <div className="glass-card">
                {/* Brand */}
                <div className="brand">
                    <div className="brand-icon">🏦</div>
                    <h1>KodBank</h1>
                    <p>Create your account to get started</p>
                </div>

                {/* Alerts */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="form-grid">
                        {/* UID */}
                        <div className="form-group">
                            <label className="form-label">User ID</label>
                            <input
                                name="uid" value={form.uid}
                                onChange={handleChange}
                                className="form-input" placeholder="e.g. u001"
                                required
                            />
                        </div>

                        {/* Username */}
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                name="username" value={form.username}
                                onChange={handleChange}
                                className="form-input" placeholder="johndoe"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password" name="password" value={form.password}
                                onChange={handleChange}
                                className="form-input" placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input
                                name="phone" value={form.phone}
                                onChange={handleChange}
                                className="form-input" placeholder="9999999999"
                                required
                            />
                        </div>

                        {/* Email — full width */}
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Email</label>
                            <input
                                type="email" name="email" value={form.email}
                                onChange={handleChange}
                                className="form-input" placeholder="john@example.com"
                                required
                            />
                        </div>

                        {/* Role — full width, locked to Customer */}
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label className="form-label">Role</label>
                            <select name="role" value={form.role} onChange={handleChange} className="form-input">
                                <option value="Customer">Customer</option>
                            </select>
                        </div>
                    </div>

                    {/* Initial Balance note */}
                    <div style={{ fontSize: '0.78rem', color: 'rgba(6,214,160,0.8)', marginBottom: '0.5rem', textAlign: 'center' }}>
                        🎁 Initial balance of <strong>₹1,00,000</strong> will be credited automatically
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Create Account'}
                    </button>
                </form>

                <div className="form-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
