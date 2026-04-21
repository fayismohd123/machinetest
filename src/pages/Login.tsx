import React, { useState } from 'react';
import { Hospital } from '../types';
import { useAuth } from '../services/auth';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { preAuth, login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [password, setPassword] = useState('');

  const [step, setStep] = useState<'phone' | 'hospital' | 'password'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedPhone = phoneNumber.replace(/\D/g, '');

    if (!normalizedPhone || normalizedPhone.length < 10) {
      setError('Enter valid mobile number');
      return;
    }

    setLoading(true);
    try {
      const hospitalsList = await preAuth(normalizedPhone);

      if (hospitalsList.length === 0) {
        setError('No hospitals found');
        return;
      }

      setHospitals(hospitalsList);
      setStep('hospital');
    } catch {
      setError('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !selectedHospital) {
      setError('Enter password and select hospital');
      return;
    }

    setLoading(true);
    try {
      await login(phoneNumber, selectedHospital.hospital_id, password);
      onLoginSuccess();
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'hospital') setStep('phone');
    if (step === 'password') setStep('hospital');
  };

  return (
    <div className="login-container">
      <div className="login-layout">

        {/* ===== LEFT SIDE ===== */}
        <div className="login-left">

          {/* TOP LEFT LOGO */}
          <img
            src="/grapeslogo.png"
            alt="logo"
            className="top-logo"
          />

          {/* 🔥 FIXED HEARTBEAT BACKGROUND */}
          <img
            src="/heartbeat-logo.png"
            alt="heartbeat"
            className="heartbeat-bg"
          />

          {/* 🔥 DYNAMIC CONTENT */}
          <div className="left-center">

            <img
              src="/hospital-logo.png"
              alt="hospital"
              className="hospital-logo-large"
            />

            <h2>Welcome, to Grapes HMS</h2>
            <p>Designed for Modern Healthcare Professionals</p>

          </div>

        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div className="login-right">

          <div className="login-card">

            <h1>Login</h1>

            {error && <div className="alert">{error}</div>}

            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit}>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button className="btn-primary">
                  {loading ? 'Loading...' : 'Continue'}
                </button>
              </form>
            )}

            {step === 'hospital' && (
              <>
                <h4>Select Hospital</h4>
                {hospitals.map((h) => (
                  <div
                    key={h.hospital_id}
                    className="hospital-item"
                    onClick={() => handleHospitalSelect(h)}
                  >
                    {h.hospital_name}
                  </div>
                ))}
                <button className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              </>
            )}

            {step === 'password' && selectedHospital && (
              <form onSubmit={handlePasswordSubmit}>
                <div className="info-box">
                  <p>{selectedHospital.hospital_name}</p>
                  <p>{phoneNumber}</p>
                </div>

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn-primary">
                  {loading ? 'Logging in...' : 'Login'}
                </button>

                <button className="btn-secondary" onClick={handleBack}>
                  Back
                </button>
              </form>
            )}

          </div>

          {/* FOOTER */}
          <div className="login-footer">
            <span>Version : 25.8.8</span>
            <span>grapeshms@gmail.com</span>
            <span>PROD-DB01</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;