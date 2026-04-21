import React, { useState } from 'react';
import { Hospital } from '../types';
import { useAuth } from '../services/auth';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { preAuth, login } = useAuth();

  // Form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [password, setPassword] = useState('');

  // UI state
  const [step, setStep] = useState<'phone' | 'hospital' | 'password'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle phone number submission
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const normalizedPhone = phoneNumber.replace(/\D/g, '');

    if (!normalizedPhone || normalizedPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const hospitalsList = await preAuth(normalizedPhone);

      if (hospitalsList.length === 0) {
        setError('No hospitals found for this phone number');
        setLoading(false);
        return;
      }

      setHospitals(hospitalsList);
      setSelectedHospital(null);
      setPhoneNumber(normalizedPhone);
      setStep('hospital');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Handle hospital selection
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setPassword('');
    setError('');
    setStep('password');
  };

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      setError('Please enter your password');
      return;
    }

    if (!selectedHospital) {
      setError('Please select a hospital');
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    if (!normalizedPhone || normalizedPhone.length < 10) {
      setError('Invalid mobile number. Please go back and enter again.');
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    try {
      await login(
        normalizedPhone,
        (selectedHospital.hospital_id),
        trimmedPassword
      );
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'hospital') {
      setStep('phone');
      setHospitals([]);
      setSelectedHospital(null);
      setPassword('');
    } else if (step === 'password') {
      setStep('hospital');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Grapes HMS</h1>
          <p>Hospital Management System</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
                maxLength={15}
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'hospital' && hospitals.length > 0 && (
          <div>
            <p className="step-title">Select Your Hospital</p>
            <div className="hospital-list">
              {hospitals.map((hospital) => (
                <button
                  key={hospital.hospital_id}
                  type="button"
                  className={`hospital-item ${
                    selectedHospital?.hospital_id === hospital.hospital_id ? 'selected' : ''
                  }`}
                  onClick={() => handleHospitalSelect(hospital)}
                >
                  <span className="hospital-name">{hospital.hospital_name}</span>
                  <span className="hospital-id">ID: {hospital.hospital_id}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
          </div>
        )}

        {step === 'password' && selectedHospital && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="hospital-info">
              <p>
                <strong>Hospital:</strong> {selectedHospital.hospital_name}
              </p>
              <p>
                <strong>Phone:</strong> {phoneNumber}
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>© 2024 Grapes Innovative Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
