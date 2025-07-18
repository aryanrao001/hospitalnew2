import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role: 'receptionist', // ✅ Hardcoded here only
      });
      setMsg('✅ Registration successful. You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-banner">
        <h1>Create Account</h1>
        <p>Start your journey with us.</p>
        <p className="mt-4">Already have an account?</p>
        <button className="btn btn-outline-light" onClick={() => navigate('/login')}>
          Login Here
        </button>
      </div>

      <div className="auth-card">
        <h3 className="mb-4">📝 Register</h3>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={handleRegister}>
          <div className="input-group mb-3">
            <span className="input-group-text"><FaUser /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text"><FaEnvelope /></span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group mb-4">
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

          <button className="btn btn-success w-100">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;





