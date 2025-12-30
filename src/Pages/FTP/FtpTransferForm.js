import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function FtpTransferForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    programName: initialData?.programName || '',
    transferMethod: initialData?.transferMethod || 'FTP',
    ftpHost: initialData?.ftpHost || '',
    directory: initialData?.directory || '',
    userName: initialData?.userName || '',
    password: initialData?.password || '',
    enable: initialData?.enable ?? true,
    port: initialData?.port || '21',
  });

  const [rePassword, setRePassword] = useState(initialData?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (field === 'password') {
      setPasswordError('');
    }

    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.programName.trim()) {
      newErrors.programName = 'Program name is required';
    }

    if (!formData.ftpHost.trim()) {
      newErrors.ftpHost = 'FTP host is required';
    } else {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      const hostnamePattern =
        /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (ipPattern.test(formData.ftpHost)) {
        const octets = formData.ftpHost.split('.');
        if (octets.some((o) => parseInt(o) > 255)) {
          newErrors.ftpHost = 'Invalid IP address';
        }
      } else if (!hostnamePattern.test(formData.ftpHost)) {
        newErrors.ftpHost = 'Invalid host address';
      }
    }

    if (!formData.port.trim()) {
      newErrors.port = 'Port is required';
    } else {
      const portNum = parseInt(formData.port);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        newErrors.port = 'Port must be between 1 and 65535';
      }
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'User name is required';
    }

    if (!formData.password || !formData.password.trim()) {
      newErrors.password = 'Password is required';
      setPasswordError('Password is required');
    } else if (!rePassword || !rePassword.trim()) {
      newErrors.password = 'Please re-enter password for confirmation';
      setPasswordError('Please re-enter password for confirmation');
    } else if (formData.password !== rePassword) {
      newErrors.password = 'Passwords do not match';
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
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
          className={`form-control${errors.programName ? ' is-invalid' : ''}`}
          value={formData.programName}
          onChange={e => handleChange('programName', e.target.value)}
          required
        />
        {errors.programName && <div className="invalid-feedback">{errors.programName}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Transfer Protocol:</label>
        <select
          className="form-select"
          value={formData.transferMethod}
          onChange={e => handleChange('transferMethod', e.target.value)}
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
          className={`form-control${errors.ftpHost ? ' is-invalid' : ''}`}
          value={formData.ftpHost}
          onChange={e => handleChange('ftpHost', e.target.value)}
          required
        />
        {errors.ftpHost && <div className="invalid-feedback">{errors.ftpHost}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> Port:
        </label>
        <input
          type="number"
          className={`form-control${errors.port ? ' is-invalid' : ''}`}
          value={formData.port}
          onChange={e => handleChange('port', e.target.value)}
          required
        />
        {errors.port && <div className="invalid-feedback">{errors.port}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> User Name:
        </label>
        <input
          type="text"
          className={`form-control${errors.userName ? ' is-invalid' : ''}`}
          value={formData.userName}
          onChange={e => handleChange('userName', e.target.value)}
          required
        />
        {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">
          <span className="text-danger">*</span> Password:
        </label>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`form-control${errors.password ? ' is-invalid' : ''}`}
          value={formData.password}
          onChange={e => handleChange('password', e.target.value)}
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
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
      <div className="col-md-6 mb-3 position-relative">
        <label className="form-label">
          <span className="text-danger">*</span> Re-enter Password:
        </label>
        <input
          type={showRePassword ? 'text' : 'password'}
          className={`form-control${passwordError ? ' is-invalid' : ''}`}
          value={rePassword}
          onChange={e => setRePassword(e.target.value)}
          required
        />
        <span
          className="password-toggle-icon"
          onClick={() => setShowRePassword((prev) => !prev)}
          style={{ position: 'absolute', top: '38px', right: '16px', cursor: 'pointer', fontSize: '1.2rem' }}
          title={showRePassword ? 'Hide Password' : 'Show Password'}
        >
          <FontAwesomeIcon icon={showRePassword ? faEyeSlash : faEye} />
        </span>
        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label">Directory:</label>
        <input
          type="text"
          className="form-control"
          value={formData.directory}
          onChange={e => handleChange('directory', e.target.value)}
        />
      </div>
    

{/* <div className="col-md-6 mb-3 d-flex align-items-center">
  <label className="form-label mb-0 me-4" htmlFor="useKeyFile">
    Use Key File
  </label>

  <input
    id="useKeyFile"
    type="checkbox"
    className="form-check-input me-3"
    checked={formData.useKeyFile}
    onChange={e => handleChange('useKeyFile', e.target.checked)}
    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
  />

  <div className="d-flex flex-column">
    <button
      type="button"
      className="btn btn-outline-primary px-5"
      disabled={!formData.useKeyFile}
      onClick={() => document.getElementById('keyFileInput')?.click()}
    >
      Import Key File
    </button>

    <small className="form-text text-muted mt-1">
      If key file is encrypted, set the password above
    </small>
  </div>

  <input
    id="keyFileInput"
    type="file"
    accept=".ppk,.pem,.key,.txt"
    style={{ display: 'none' }}
    onChange={e => {
      const file = e.target.files?.[0];
      handleChange('keyFileName', file ? file.name : '');
    }}
  />
</div> */}


      <div className="col-md-6 mb-3">
        <label className="form-label">Enable:</label>
        <div className="form-check form-switch ms-2 d-inline-block">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="enableSwitch"
            checked={formData.enable}
            onChange={e => handleChange('enable', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="enableSwitch">
            {formData.enable ? 'True' : 'False'}
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
