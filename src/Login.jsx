import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);

      alert('✅ Login successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('❌ Invalid credentials or access denied!');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-banner">
        <h1>Welcome Back 👋</h1>
        <p>Don't have an account?</p>
        <button className="btn btn-outline-light" onClick={() => navigate('/register')}>
          Register Here
        </button>
      </div>

      <div className="auth-card">
        <h3 className="mb-4">🔐 Login to your account</h3>
        <form onSubmit={handleLogin}>
          <div className="input-group mb-3">
            <span className="input-group-text"><FaEnvelope /></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text"><FaLock /></span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text"><FaUserTag /></span>
            <select
              className="form-control"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>

          <button className="btn btn-primary w-100 mt-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;






