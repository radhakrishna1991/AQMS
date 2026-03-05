import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function FtpTransferForm({ initialData, onSubmit, onCancel, lookUpData }) {
  // const [formData, setFormData] = useState({
  //   FtpName: initialData?.ftpName || '',
  //   TransferMethod: initialData?.transferMethod || '',
  //   FtpHost: initialData?.ftpHost || '',
  //   Directory: initialData?.directory || '',
  //   UserName: initialData?.userName || '',
  //   UserPassword: initialData?.userPassword || '',
  //   Enabled: initialData?.enabled ?? true,
  //   Port: initialData?.port || '',
  // });

  const [formData, setFormData] = useState({
    // Common fields
    ConfigName: initialData?.configName || '',
    StorageType: initialData?.storageType || '',
    Directory: initialData?.directory || '',
    Enabled: initialData?.enabled ?? true,
  
    // FTP / Protocol
    Protocol: initialData?.protocol || '',
    FtpHost: initialData?.ftpHost || '',
    Port: initialData?.port || '',
    UserName: initialData?.userName || '',
    UserPassword: initialData?.userPassword || '',
  
    // SFTP only
    PrivateKeyPath: initialData?.privateKeyPath || '',
    PrivateKeyPassphrase: initialData?.privateKeyPassphrase || '',
  
    // SSL
    UseSsl: initialData?.useSsl ?? false,
    SslMode: initialData?.sslMode || null,  
    PassiveMode: initialData?.passiveMode ?? true,
  
    // Local
    CreateDirectoryIfNotExists:
      initialData?.createDirectoryIfNotExists ?? true,
  
    // Network (UNC)
    NetworkUserName: initialData?.networkUserName || '',
    NetworkPassword: initialData?.networkPassword || '',
  
    // OneDrive
    TenantId: initialData?.tenantId || '',
    ClientId: initialData?.clientId || '',
    ClientSecret: initialData?.clientSecret || '',
    DriveId: initialData?.driveId || '',
    FolderId: initialData?.folderId || '',
  });
  

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // const handleChange = (field, value) => {
  //   setFormData({ ...formData, [field]: value });
  //   if (errors[field]) {
  //     setErrors({ ...errors, [field]: '' });
  //   }
  // };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.FtpName.trim()) {
  //     newErrors.FtpName = 'Program name is required';
  //   }

  //   if (!formData.TransferMethod || formData.TransferMethod === '') {
  //     newErrors.TransferMethod = 'Transfer protocol is required';
  //   }

  //   if (!formData.FtpHost.trim()) {
  //     newErrors.FtpHost = 'FTP host is required';
  //   } else {
  //     const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  //     const hostnamePattern =
  //       /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  //     if (ipPattern.test(formData.FtpHost)) {
  //       const octets = formData.FtpHost.split('.');
  //       if (octets.some((o) => parseInt(o) > 255)) {
  //         newErrors.FtpHost = 'Invalid IP address';
  //       }
  //     } else if (!hostnamePattern.test(formData.FtpHost)) {
  //       newErrors.FtpHost = 'Invalid host address';
  //     }
  //   }

  //   if (!(formData.Port)?.toString().trim()) {
  //     newErrors.Port = 'Port is required';
  //   } else {
  //     const portNum = parseInt(formData.Port, 10);
  //     if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
  //       newErrors.Port = 'Port must be between 1 and 65535';
  //     }
  //   }

  //   if (!formData.UserName.trim()) {
  //     newErrors.UserName = 'User name is required';
  //   }

  //   if (!formData.UserPassword || !formData.UserPassword.trim()) {
  //     newErrors.UserPassword = 'Password is required';
  //   } 

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = () => {
    const newErrors = {};
  
    // =========================
    // Common Validation
    // =========================
    if (!formData.ConfigName.trim()) {
      newErrors.ConfigName = 'Connection name is required';
    }
  
    if (!formData.StorageType) {
      newErrors.StorageType = 'Storage type is required';
    }
  
    // =========================
    // FTP Validation
    // =========================
    if (formData.StorageType === "FTP") {
  
      if (!formData.FtpHost.trim()) {
        newErrors.FtpHost = 'FTP host is required';
      } else {
        const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const hostnamePattern =
          /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
        if (ipPattern.test(formData.FtpHost)) {
          const octets = formData.FtpHost.split('.');
          if (octets.some(o => parseInt(o) > 255)) {
            newErrors.FtpHost = 'Invalid IP address';
          }
        } else if (!hostnamePattern.test(formData.FtpHost)) {
          newErrors.FtpHost = 'Invalid host address';
        }
      }
  
      if (!formData.Port?.toString().trim()) {
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
  
      if (!formData.UserPassword?.trim()) {
        newErrors.UserPassword = 'Password is required';
      }
    }
  
    // =========================
    // Network (UNC) Validation
    // =========================
    if (formData.StorageType === "Network (UNC)") {
      if (!formData.NetworkUserName?.trim()) {
        newErrors.NetworkUserName = 'Network username is required';
      }
  
      if (!formData.NetworkPassword?.trim()) {
        newErrors.NetworkPassword = 'Network password is required';
      }
    }
  
    // =========================
    // OneDrive Validation
    // =========================
    if (formData.StorageType === "OneDrive") {
      if (!formData.TenantId?.trim()) {
        newErrors.TenantId = 'Tenant ID is required';
      }
  
      if (!formData.ClientId?.trim()) {
        newErrors.ClientId = 'Client ID is required';
      }
  
      if (!formData.ClientSecret?.trim()) {
        newErrors.ClientSecret = 'Client Secret is required';
      }
  
      if (!formData.DriveId?.trim()) {
        newErrors.DriveId = 'Drive ID is required';
      }
  
      if (!formData.FolderId?.trim()) {
        newErrors.FolderId = 'Folder ID is required';
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    onSubmit(formData);
  };
  const selectedStorageType = formData.StorageType;

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
          className={`form-control${errors.ConfigName ? ' is-invalid' : ''}`}
          value={formData.ConfigName}
          onChange={e => handleChange('ConfigName', e.target.value)}
          required
        />
        {errors.ConfigName && <div className="invalid-feedback">{errors.ConfigName}</div>}
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label"><span className="text-danger">*</span>Storage Type:</label>
        <select
          className={`form-select${errors.StorageType ? ' is-invalid' : ''}`}
          value={formData.StorageType}
          onChange={e => handleChange('StorageType', e.target.value)}

        >
          <option value="">Select storage type...</option>
            {lookUpData.listStorageTypes?.map((type) => (
              <option key={type.id} value={type.storageTypeName}>
                {type.storageTypeName}
              </option>
            ))}
        </select>
        {errors.StorageType && <div className="invalid-feedback">{errors.StorageType}</div>}
      </div>
      {selectedStorageType === 'FTP' && (
  <>
      <div className="col-md-6 mb-3">
        <label className="form-label"><span className="text-danger">*</span>Transfer Protocol:</label>
        <select
          className={`form-select${errors.Protocol ? ' is-invalid' : ''}`}
          value={formData.Protocol}
          onChange={e => handleChange('Protocol', e.target.value)}
        >
          <option value="">Select protocol...</option>
            {lookUpData.listFileTransferType?.map((type) => (
              <option key={type.fileTransferTypeID} value={type.fileTransferTypeName}>
                {type.fileTransferTypeName} ({type.fileTransferTypeDescription})
              </option>
            ))}
        </select>
        {errors.Protocol && <div className="invalid-feedback">{errors.Protocol}</div>}
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
      <div className="col-md-6 mb-3 position-relative">
      <label className="form-label">
        <span className="text-danger">*</span> Password:
      </label>

      <div className="position-relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`form-control pe-5${errors.UserPassword ? ' is-invalid' : ''}`}
          value={formData.UserPassword}
          onChange={e => handleChange('UserPassword', e.target.value)}
          required
        />

        <span
          onClick={() => setShowPassword(prev => !prev)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '15px',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#6c757d'
          }}
          title={showPassword ? 'Hide Password' : 'Show Password'}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>

        {errors.UserPassword && (
          <div className="invalid-feedback d-block">
            {errors.UserPassword}
          </div>
        )}
      </div>
    </div>
      <div className="col-md-6 mb-3">
      <label className="form-label">Private Key Path:</label>
      <input
        type="text"
        className="form-control"
        value={formData.PrivateKeyPath}
        onChange={e => handleChange('PrivateKeyPath', e.target.value)}
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Private Key Passphrase:</label>
      <input
        type="password"
        className="form-control"
        value={formData.PrivateKeyPassphrase}
        onChange={e => handleChange('PrivateKeyPassphrase', e.target.value)}
      />
    </div>
      {/* <div className="col-md-6 mb-3">
        <label className="form-label">Directory:</label>
        <input
          type="text"
          className="form-control"
          value={formData.Directory}
          onChange={e => handleChange('Directory', e.target.value)}
        />
      </div> */}


    <div className="col-md-6 mb-3">
      <label className="form-label">Use SSL:</label>
      <select
        className="form-select"
        value={formData.UseSsl?.toString()}
        onChange={e => handleChange('UseSsl', e.target.value === 'true')}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>

    <div className="col-md-6 mb-3">
    <label className="form-label">SSL Mode:</label>
    <select
      className="form-select"
      value={formData.SslMode || ''}
      onChange={(e) => handleChange('SslMode', e.target.value || null)}
    >
      <option value="">Select SSL Mode...</option>
      <option value="Implicit">Implicit</option>
      <option value="Explicit">Explicit</option>
    </select>
  </div>

     <div className="col-md-6 mb-3">
      <label className="form-label">Passive Mode:</label>
      <select
        className="form-select"
        value={formData.PassiveMode?.toString()}
        onChange={e => handleChange('PassiveMode', e.target.value === 'true')}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
  </>
)}

  {selectedStorageType === 'Local' && (
      <div className="col-md-6 mb-3">
      <label className="form-label">Create Directory If Not Exists:</label>
      <select
        className="form-select"
        value={formData.CreateDirectoryIfNotExists?.toString()}
        onChange={e =>
          handleChange('CreateDirectoryIfNotExists', e.target.value === 'true')
        }
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
      </div>
)}  

{selectedStorageType === 'Network (UNC)' && (
  <>
    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Network Username:</label>
      <input
        type="text"
        className={`form-control${errors.NetworkUserName ? ' is-invalid' : ''}`}
        value={formData.NetworkUserName || ''}
        onChange={e => handleChange('NetworkUserName', e.target.value)}
      />
       {errors.NetworkUserName && <div className="invalid-feedback">{errors.NetworkUserName}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Network Password:</label>
      <input
        type="password"
        className={`form-control${errors.NetworkPassword ? ' is-invalid' : ''}`}
        value={formData.NetworkPassword || ''}
        onChange={e => handleChange('NetworkPassword', e.target.value)}
      />
       {errors.NetworkPassword && <div className="invalid-feedback">{errors.NetworkPassword}</div>}
    </div>
  </>
)}

{selectedStorageType === 'OneDrive' && (
  <>
    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Tenant Id:</label>
      <input
        type="text"
        className={`form-control${errors.TenantId ? ' is-invalid' : ''}`}
        value={formData.TenantId || ''}
        onChange={e => handleChange('TenantId', e.target.value)}
      />
       {errors.TenantId && <div className="invalid-feedback">{errors.TenantId}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Client Id:</label>
      <input
        type="text"
        className={`form-control${errors.ClientId ? ' is-invalid' : ''}`}
        value={formData.ClientId || ''}
        onChange={e => handleChange('ClientId', e.target.value)}
      />
       {errors.ClientId && <div className="invalid-feedback">{errors.ClientId}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Client Secret:</label>
      <input
        type="password"
        className={`form-control${errors.ClientSecret ? ' is-invalid' : ''}`}
        value={formData.ClientSecret || ''}
        onChange={e => handleChange('ClientSecret', e.target.value)}
      />
       {errors.ClientSecret && <div className="invalid-feedback">{errors.ClientSecret}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Drive Id:</label>
      <input
        type="text"
        className={`form-control${errors.DriveId ? ' is-invalid' : ''}`}
        value={formData.DriveId || ''}
        onChange={e => handleChange('DriveId', e.target.value)}
      />
       {errors.DriveId && <div className="invalid-feedback">{errors.DriveId}</div>}
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label"><span className="text-danger">*</span>Folder Id:</label>
      <input
        type="text"
        className={`form-control${errors.FolderId ? ' is-invalid' : ''}`}
        value={formData.FolderId || ''}
        onChange={e => handleChange('FolderId', e.target.value)}
      />
       {errors.FolderId && <div className="invalid-feedback">{errors.FolderId}</div>}
    </div>
  </>
)}

      <div className="col-md-6 mb-3">
        <label className="form-label d-block">Enable:</label>

        <div className="form-check form-switch">
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
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
