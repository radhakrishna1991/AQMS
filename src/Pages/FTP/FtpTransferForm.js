import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function FtpTransferForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    FtpName: initialData?.ftpName || '',
    TransferMethod: initialData?.transferMethod || '',
    FtpHost: initialData?.ftpHost || '',
    Directory: initialData?.directory || '',
    UserName: initialData?.userName || '',
    UserPassword: initialData?.userPassword || '',
    Enabled: initialData?.enabled ?? true,
    Port: initialData?.port || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.FtpName.trim()) {
      newErrors.FtpName = 'Program name is required';
    }

    if (!formData.FtpHost.trim()) {
      newErrors.FtpHost = 'FTP host is required';
    } else {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      const hostnamePattern =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (ipPattern.test(formData.FtpHost)) {
        const octets = formData.FtpHost.split('.');
        if (octets.some((o) => parseInt(o) > 255)) {
          newErrors.FtpHost = 'Invalid IP address';
        }
      } else if (!hostnamePattern.test(formData.FtpHost)) {
        newErrors.FtpHost = 'Invalid host address';
      }
    }

    if (!(formData.Port)?.toString().trim()) {
      newErrors.Port = 'Port is required';
    } else {
      const portNum = parseInt(formData.Port, 10);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        newErrors.Port = 'Port must be between 1 and 65535';
      }
    }

    if (!formData.UserName.trim()) {
      newErrors.UserName = 'User name is required';
    }

    if (!formData.UserPassword || !formData.UserPassword.trim()) {
      newErrors.UserPassword = 'Password is required';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="row" noValidate>
      <div className="text-danger mb-3 text-start" style={{ fontSize: '12px' }}>
        * Mark fields are mandatory to fill
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> Configuration Name:
        </label>
        <input
          type="text"
          className={`form-control${errors.FtpName ? ' is-invalid' : ''}`}
          value={formData.FtpName}
          onChange={e => handleChange('FtpName', e.target.value)}
          required
        />
        {errors.FtpName && <div className="invalid-feedback">{errors.FtpName}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Transfer Protocol:</label>
        <select
          className="form-select"
          value={formData.TransferMethod}
          onChange={e => handleChange('TransferMethod', e.target.value)}
        >
            <option value="FTP">FTP</option>
            <option value="FTPS_IMPLICIT">FTP/SSL implicit</option>
            <option value="FTPS_EXPLICIT">FTP/SSL explicit</option>
            <option value="SFTP">SFTP</option>
        </select>
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> Server Address:
        </label>
        <input
          type="text"
          className={`form-control${errors.FtpHost ? ' is-invalid' : ''}`}
          value={formData.FtpHost}
          onChange={e => handleChange('FtpHost', e.target.value)}
          required
        />
        {errors.FtpHost && <div className="invalid-feedback">{errors.FtpHost}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> Port:
        </label>
        <input
          type="number"
          className={`form-control${errors.Port ? ' is-invalid' : ''}`}
          value={formData.Port}
          onChange={e => handleChange('Port', e.target.value)}
          required
        />
        {errors.Port && <div className="invalid-feedback">{errors.Port}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> User Name:
        </label>
        <input
          type="text"
          className={`form-control${errors.UserName ? ' is-invalid' : ''}`}
          value={formData.UserName}
          onChange={e => handleChange('UserName', e.target.value)}
          required
        />
        {errors.UserName && <div className="invalid-feedback">{errors.UserName}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> Password:
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`form-control${errors.UserPassword ? ' is-invalid' : ''}`}
          value={formData.UserPassword}
          onChange={e => handleChange('UserPassword', e.target.value)}
          required
        />
        <span
          className="password-icon"
          onClick={() => setShowPassword((prev) => !prev)}
          style={{ position: 'absolute', top: '38px', right: '16px', cursor: 'pointer', fontSize: '1.2rem' }}
          title={showPassword ? 'Hide Password' : 'Show Password'}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
        {errors.UserPassword && <div className="invalid-feedback">{errors.UserPassword}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Directory:</label>
        <input
          type="text"
          className="form-control"
          value={formData.Directory}
          onChange={e => handleChange('Directory', e.target.value)}
        />
      </div>
    



      <div className="col-md-6 mb-3">
        <label className="form-label">Enable:</label>
        <div className="form-check form-switch ms-2 d-inline-block">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="enableSwitch"
            checked={formData.Enabled}
            onChange={e => handleChange('Enabled', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="enableSwitch">
            {formData.Enabled ? 'True' : 'False'}
          </label>
        </div>
      </div>
      <div className="col-md-12 text-center mt-4">
        <button
          type="button"
          className="btn btn-secondary mx-2"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary mx-2"
        >
          {initialData ? 'Update FTP Configuration' : 'Create FTP Configuration'}
        </button>
      </div>
    </form>
  );
}
