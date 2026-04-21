import React, { useState } from 'react';
import './Signup.css';

interface SignupProps {
  onSignupSuccess: () => void;
  onBackToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    hospitalName: '',
    department: '',
    employeeId: '',
    role: 'Staff',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }

    if (formData.phoneNumber.length < 10) {
      setError('Phone number must be at least 10 digits');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.hospitalName.trim()) {
      setError('Hospital name is required');
      return false;
    }

    if (!formData.department.trim()) {
      setError('Department is required');
      return false;
    }

    if (!formData.employeeId.trim()) {
      setError('Employee ID is required');
      return false;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call - In production, this would call backend registration API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store user data in localStorage
      const userData = {
        UserId: Math.floor(Math.random() * 10000),
        UserName: formData.fullName,
        PhoneNumber: formData.phoneNumber,
        Email: formData.email,
        Role: formData.role,
        HospitalName: formData.hospitalName,
        Department: formData.department,
        EmployeeId: formData.employeeId,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('registrationDate', new Date().toISOString());

      setSuccess('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        onSignupSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Register as a new hospital staff member</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (10+ digits) *</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              placeholder="Enter your 10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={loading}
              maxLength={15}
              required
            />
          </div>

          {/* Hospital Name */}
          <div className="form-group">
            <label htmlFor="hospitalName">Hospital Name *</label>
            <input
              id="hospitalName"
              type="text"
              name="hospitalName"
              placeholder="Enter your hospital name"
              value={formData.hospitalName}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Department */}
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <input
              id="department"
              type="text"
              name="department"
              placeholder="e.g., Cardiology, Nursing, Administration"
              value={formData.department}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Employee ID */}
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID *</label>
            <input
              id="employeeId"
              type="text"
              name="employeeId"
              placeholder="Enter your employee ID"
              value={formData.employeeId}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={loading}
              required
            >
              <option value="Staff">Staff Member</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Administrator">Administrator</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password (min 6 characters) *</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Terms Checkbox */}
          <div className="form-group checkbox-group">
            <input
              id="agreeTerms"
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
            <label htmlFor="agreeTerms">
              I agree to the Terms and Conditions *
            </label>
          </div>

          {/* Buttons */}
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            disabled={loading}
            className="btn btn-secondary"
          >
            Back to Login
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? Click "Back to Login" above</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
