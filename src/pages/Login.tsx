import React, { useState } from 'react';
import { Hospital } from '../types';
import { useAuth } from '../services/auth';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
  onCreateAccount?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onCreateAccount }) => {
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

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const hospitalsList = await preAuth(phoneNumber);

      if (hospitalsList.length === 0) {
        setError('No hospitals found for this phone number');
        setLoading(false);
        return;
      }

      setHospitals(hospitalsList);

      // Auto-select GRAPES IDMR if available
      const grapesHospital = hospitalsList.find(
        (h) => h.hospital_name.includes('GRAPES') || h.hospital_name.includes('IDMR')
      );

      if (grapesHospital) {
        setSelectedHospital(grapesHospital);
        setStep('password');
      } else {
        setStep('hospital');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Handle hospital selection
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setStep('password');
  };

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (!selectedHospital) {
      setError('Please select a hospital');
      return;
    }

    setLoading(true);
    try {
      await login(phoneNumber, selectedHospital.hospital_id, password);
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
    } else if (step === 'password') {
      if (hospitals.length > 1) {
        setStep('hospital');
      } else {
        setStep('phone');
      }
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
          {onCreateAccount && (
            <button
              type="button"
              onClick={onCreateAccount}
              className="signup-link"
            >
              Don't have an account? Create one
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
