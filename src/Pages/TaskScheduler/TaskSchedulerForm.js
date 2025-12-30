
import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskSchedulerForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faRedoAlt, faCheckCircle, faCheck, faTimes, faFileAlt, faCog, faFile, faCalendar, faFolder, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ReportSelectionModal } from './ReportSelectionModal';

export function TaskSchedulerForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    taskName: initialData?.taskName || '',
    description: initialData?.description || '',
    executive: initialData?.executive || 'ISTHYDPC34',
    startTime: initialData?.startTime || '',
    repeatInterval: initialData?.repeatInterval || '6',
    intervalUnit: initialData?.intervalUnit || 'Days',
    enabled: initialData?.enabled ?? true,
    daysToRun: initialData?.daysToRun || {
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
    },
    timeRestriction: initialData?.timeRestriction || 'unrestricted',
    timeFrom: initialData?.timeFrom || '',
    timeTo: initialData?.timeTo || '',
  });
    const [activeTab, setActiveTab] = useState('file-output');
  const [config, setConfig] = useState({
    reportType: 'system-logs',
    exportFormat: 'txt',
    baseFilename: 'export',
    fileExtension: 'TXT',
    includeTimestamp: true,
    timestampFormat: 'yyyyMMddHHmm',
    enableLocalSave: true,
    destinationFolder: 'C:\\Users\\Documents\\Exports',
    enableRemoteUpload: false,
    uploadProtocol: 'sftp-secure'
  });

  const updateConfig = (field, value) => {
    // If exportFormat changes, update fileExtension too
    if (field === 'exportFormat') {
      let ext = '';
      switch (value) {
        case 'txt': ext = 'TXT'; break;
        case 'csv': ext = 'CSV'; break;
        case 'json': ext = 'JSON'; break;
        case 'xml': ext = 'XML'; break;
        case 'pdf': ext = 'PDF'; break;
        default: ext = '';
      }
      setConfig(prev => ({ ...prev, exportFormat: value, fileExtension: ext }));
    } else {
      setConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const [errors, setErrors] = useState({});
   const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

    const handleBrowseFolder = async () => {
    // Trigger the hidden file input for folder selection
    document.getElementById('folderInput').click();
  };

  const handleFolderInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Get the path from the first file
      const path = files[0].webkitRelativePath || files[0].name;
      const folderName = path.split('/')[0];
      updateConfig('destinationFolder', folderName);
    }
  };

  const handleDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysToRun: { ...prev.daysToRun, [day]: !prev.daysToRun[day] },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taskName.trim()) newErrors.taskName = 'Task name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.executive.trim()) newErrors.executive = 'Executive is required';
    if (!formData.startTime.trim()) newErrors.startTime = 'Start time is required';
    if (!formData.repeatInterval.trim()) {
      newErrors.repeatInterval = 'Repeat interval is required';
    } else {
      const interval = parseInt(formData.repeatInterval, 10);
      if (isNaN(interval) || interval < 1) newErrors.repeatInterval = 'Must be a positive number';
    }

    const hasSelectedDay = Object.values(formData.daysToRun).some(Boolean);
    if (!hasSelectedDay) newErrors.daysToRun = 'At least one day must be selected';

    if (formData.timeRestriction === 'between') {
      if (!formData.timeFrom) newErrors.timeFrom = 'Start time is required';
      if (!formData.timeTo) newErrors.timeTo = 'End time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="tsf-container">
      <div className="tsf-card">
        <div className="tsf-header">
          <div className="tsf-header-left">
            <div className="tsf-header-icon">
              <FontAwesomeIcon icon={faCalendarAlt} className="tsf-header-faicon" />
            </div>
            <div>
              <h3 className="tsf-title">Create New Schedule</h3>
              <p className="tsf-subtitle">Configure job scheduling parameters</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="tsf-form">
          {/* Task Information Section */}
          <section className="tsf-section">
            <div className="tsf-section-header">
              <FontAwesomeIcon icon={faCheckCircle} className="tsf-section-faicon" />
              <h4 className="tsf-section-title">Job Information</h4>
            </div>
            <div className="tsf-row">
              <label className="form-label">Job Name:</label>
              <div className="tsf-input-group">
                <input
                  type="text"
                  value={formData.taskName}
                  onChange={(e) => handleChange('taskName', e.target.value)}
                  className={`tsf-input${errors.taskName ? ' tsf-input-error' : ''}`}
                  placeholder="Enter job name"
                  aria-invalid={!!errors.taskName}
                  aria-describedby={errors.taskName ? 'taskName-error' : undefined}
                />
                 {errors.taskName && (
                <p id="taskName-error" className="tsf-error-text"> {errors.taskName}</p>
              )}
              </div>
            </div>
            <div className="tsf-row">
              <label className="form-label">Job Description:</label>
              <div className="tsf-input-group">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className={`tsf-textarea${errors.description ? ' tsf-input-error' : ''}`}
                  placeholder="Enter job description"
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="tsf-error-text"> {errors.description}</p>
                )}
              </div>
            </div>
            <div className="tsf-row">
              <label className="form-label">Executive:</label>
              <select
                value={formData.executive}
                onChange={(e) => handleChange('executive', e.target.value)}
                className="tsf-select"
              >
                <option value="ISTHYDPC34">ISTHYDPC34</option>
                <option value="ISTHYDPC35">ISTHYDPC35</option>
                <option value="ISTHYDPC36">ISTHYDPC36</option>
              </select>
            </div>
            <div className='time-enable-row'>
            <div className="tsf-row">
              <label className="form-label">Start Time:</label>
              <div className="tsf-input-group tsf-relative">
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DatePicker
                      selected={formData.startTime ? new Date(formData.startTime) : null}
                      onChange={(date) => {
                        if (date) {
                          const pad = (n) => n.toString().padStart(2, '0');
                          const datePart = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
                          const timePart = formData.startTime ? formData.startTime.split('T')[1] : '00:00:00';
                          handleChange('startTime', `${datePart}T${timePart}`);
                        } else {
                          handleChange('startTime', '');
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select date"
                      className={`tsf-input${errors.startTime ? ' tsf-input-error' : ''}`}
                      popperClassName="tsf-calendar-popup"
                      showTimeSelect={false}
                    />
                    {formData.startTime && formData.startTime.split('T')[0] ? (
                      <input
                        type="time"
                        step="1"
                        value={formData.startTime ? formData.startTime.split('T')[1] : ''}
                        onChange={(e) => {
                          const datePart = formData.startTime ? formData.startTime.split('T')[0] : '';
                          handleChange('startTime', `${datePart}T${e.target.value}`);
                        }}
                        className={`tsf-input tsf-time-input${errors.startTime ? ' tsf-input-error' : ''}`}
                        style={{ width: '120px' }}
                        aria-invalid={!!errors.startTime}
                        aria-describedby={errors.startTime ? 'startTime-error' : undefined}
                      />
                    ) : null}
                  </div>
                </div>
                {errors.startTime && (
                <p id="startTime-error" className="tsf-error-text"> {errors.startTime}</p>
              )}
              </div>
            </div>
            <div className='job-switch'>
               <label className="form-label">Job Enabled:</label>
               <div className="form-check form-switch ms-2 d-inline-block">
                 <input
                   className="form-check-input"
                   type="checkbox"
                   role="switch"
                   id="enabledSwitch"
                   checked={formData.enabled}
                   onChange={e => handleChange('enabled', e.target.checked)}
                 />
                 <label className="form-check-label" htmlFor="enabledSwitch">
                   {formData.enabled ? 'True' : 'False'}
                 </label>
               </div>
              
            </div>
            </div>
            <div className="tsf-row">
              <label className="form-label">Repeat Interval:</label>
              <div className="tsf-input-repeat tsf-flex flex">
                <div className="tsf-relative tsf-flex-1">
                  <input
                    type="number"
                    value={formData.repeatInterval}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      handleChange('repeatInterval', val);
                    }}
                    min="1"
                    className=" tsf-input-repeat-number"
                    // className={`tsf-input${errors.repeatInterval ? ' tsf-input-error' : ''}`}
                    placeholder="6"
                    aria-invalid={!!errors.repeatInterval}
                    aria-describedby={errors.repeatInterval ? 'repeatInterval-error' : undefined}
                  />
                </div>
                <select
                  value={formData.intervalUnit}
                  onChange={(e) => handleChange('intervalUnit', e.target.value)}
                  className="tsf-select"
                >
                    <option value="Seconds">Seconds</option>
                    <option value="Minutes">Minutes</option>
                     <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>

                </select>
              </div>
              {errors.repeatInterval && (
                <p id="repeatInterval-error" className="tsf-error-text"> {errors.repeatInterval}</p>
              )}
            </div>
          </section>
          {/* Days to Run Section */}
          <section className="tsf-section">
            <div className="tsf-section-header">
              <FontAwesomeIcon icon={faCalendarAlt} className="tsf-section-faicon" />
              <h4 className="tsf-section-title">Days to Run</h4>
            </div>
            <div className="tsf-days-row">
              {dayKeys.map((day, idx) => {
                const selected = formData.daysToRun[day];
                return (
                  <label
                    key={day}
                    className={`tsf-day-label${selected ? ' tsf-day-selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleDayChange(day)}
                      className="tsf-day-checkbox"
                      aria-label={dayLabels[idx]}
                    />
                    <span className="tsf-day-label-text">{dayLabels[idx]}</span>
                    <span className={`tsf-day-check${selected ? ' tsf-day-check-selected' : ''}`}>
                      <FontAwesomeIcon icon={selected ? faCheck : faTimes} size="lg" />
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.daysToRun && (
              <p className="tsf-error-text tsf-error-days"> {errors.daysToRun}</p>
            )}
          </section>
          {/* Time of Day Restriction Section */}
          <section className="tsf-section">
            <div className="tsf-section-header">
              <FontAwesomeIcon icon={faClock} className="tsf-section-faicon" />
              <h4 className="tsf-section-title">Time of Day Restriction</h4>
            </div>
            <div className="tsf-time-restriction-group">
             <label
  className={`tsf-radio-label tsf-radio-full ${
    formData.timeRestriction === 'unrestricted' ? 'tsf-radio-selected' : ''
  }`}
>
                <input
                  type="radio"
                  name="timeRestriction"
                  checked={formData.timeRestriction === 'unrestricted'}
                  onChange={() => handleChange('timeRestriction', 'unrestricted')}
                  className="tsf-radio"
                />
                <span className="tsf-radio-text">Unrestricted</span>
              </label>
              <div className={`tsf-radio-between${formData.timeRestriction === 'between' ? ' tsf-radio-selected' : ''}`}>
              <label
  className={`tsf-radio-label tsf-radio-full ${
    formData.timeRestriction === 'between' ? 'tsf-radio-selected' : ''
  }`}
>
                  <input
                    type="radio"
                    name="timeRestriction"
                    checked={formData.timeRestriction === 'between'}
                    onChange={() => handleChange('timeRestriction', 'between')}
                    className="tsf-radio"
                  />
                  <span className={`tsf-radio-text${formData.timeRestriction === 'between' ? ' tsf-radio-text-selected' : ''}`}>Run only between:</span>
                </label>
                {formData.timeRestriction === 'between' && (
                  <div className="tsf-between-time-row">
                    <div className="w-full sm:flex-1">
                      <label className="tsf-between-label">From Time (HH:MM:SS)</label>
                      <input
                        type="time"
                        step="1"
                        value={formData.timeFrom}
                        onChange={(e) => handleChange('timeFrom', e.target.value)}
                        className={`tsf-input${errors.timeFrom ? ' tsf-input-error' : ''}`}
                        aria-invalid={!!errors.timeFrom}
                        aria-describedby={errors.timeFrom ? 'timeFrom-error' : undefined}
                      />
                      {errors.timeFrom && (
                        <p id="timeFrom-error" className="tsf-error-text"> {errors.timeFrom}</p>
                      )}
                    </div>
                    <span className="tsf-between-and">and</span>
                    <div className="w-full sm:flex-1">
                      <label className="tsf-between-label">To Time (HH:MM:SS)</label>
                      <input
                        type="time"
                        step="1"
                        value={formData.timeTo}
                        onChange={(e) => handleChange('timeTo', e.target.value)}
                        className={`tsf-input${errors.timeTo ? ' tsf-input-error' : ''}`}
                        aria-invalid={!!errors.timeTo}
                        aria-describedby={errors.timeTo ? 'timeTo-error' : undefined}
                      />
                      {errors.timeTo && (
                        <p id="timeTo-error" className="tsf-error-text"> {errors.timeTo}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

<section className="tsf-section">
  {/* ===== Section Header ===== */}
  <div className="tsf-section-header">
    <FontAwesomeIcon icon={faFileAlt} className="tsf-section-faicon" />
    <h4 className="tsf-section-title">Report Data</h4>
  </div>

  {/* ===== Top Bar: Data Source + Export Filters ===== */}

  <div className="tsf-topbar-grid" aria-label="Report Data Source and Export Filters" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0 16px' }}>
    <label className="form-label" htmlFor="dataSourceSelect" style={{ margin: 0, whiteSpace: 'nowrap' }}>Report:</label>
    <select
      id="dataSourceSelect"
      value={config.reportType}
      onChange={(e) => updateConfig('reportType', e.target.value)}
      className="tsf-select tsf-select-legacy"
      style={{ minWidth: '200px' }}
    >
      <option value="system-logs">System Logs</option>
      <option value="event-history">Event History</option>
      <option value="activity-records">Activity Records</option>
      <option value="performance-metrics">Performance Metrics</option>
    </select>
    <button
      type="button"
      className="tsf-btn tsf-btn-legacy"
      aria-label="Configure Report Query"
      onClick={() => setIsModalOpen(true)} // Placeholder action
      style={{ whiteSpace: 'nowrap' }}
    >
      <FontAwesomeIcon icon={faCog} className="tsf-btn-icon" />
      Configure Report Query
    </button>
  </div>


  {/* ===== Tabs ===== */}
  <div className="tsf-row tsf-row-tabs" role="tablist" aria-label="Report tabs">
    <button
      type="button"
      role="tab"
      aria-selected={true}
      aria-controls="tab-file-output"
      className="tsf-tab-btn tsf-tab-btn-active"
      tabIndex={0}
    >
      File Output Settings
    </button>
  </div>

  {/* ===== Tab Content ===== */}
  <div className="tsf-tab-content">
    <div id="tab-file-output" role="tabpanel" className="tsf-file-output-settings">
        {/* Export Format */}
        <div className="tsf-row">
          <label className="form-label" htmlFor="exportFormat">Export Format:</label>
          <div className="tsf-input-group">
            <select
              id="exportFormat"
              value={config.exportFormat}
              onChange={(e) => updateConfig('exportFormat', e.target.value)}
              className="tsf-select"
            >
              <option value="">Select format...</option>
              <option value="txt">Text File (.txt)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="json">JSON (.json)</option>
              <option value="xml">XML (.xml)</option>
              <option value="pdf">PDF (.pdf)</option>
            </select>
          </div>
        </div>

        {/* File Naming Settings */}
        <div className="tsf-row-group">
          <div className="tsf-row tsf-row-half">
            <label className="form-label" htmlFor="baseFilename">Base Filename:</label>
            <div className="tsf-input-group">
              <input
                id="baseFilename"
                type="text"
                value={config.baseFilename}
                onChange={(e) => updateConfig('baseFilename', e.target.value)}
                className="tsf-input"
                placeholder="Enter base filename"
              />
            </div>
          </div>

          <div className="tsf-row tsf-row-half">
            <label className="form-label" htmlFor="fileExtension">File Extension:</label>
            <div className="tsf-input-group">
              <input
                id="fileExtension"
                type="text"
                value={config.fileExtension}
                onChange={(e) => updateConfig('fileExtension', e.target.value)}
                className="tsf-input"
                placeholder="TXT"
              />
            </div>
          </div>

          <div className="tsf-row tsf-row-checkbox tsf-row-checkbox-bg">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                checked={config.includeTimestamp}
                onChange={(e) => updateConfig('includeTimestamp', e.target.checked)}
                className="form-checkbox tsf-checkbox"
              />
               <label className="form-label" htmlFor="includeTimestamp">Enable Timestamp :</label>
            </label>
            {config.includeTimestamp && (
              <div className="tsf-row tsf-row-timestamp">
                <label className="form-label" htmlFor="timestampFormat">
                  <FontAwesomeIcon icon={faCalendar} className="tsf-row-timestamp-icon" />
                  Timestamp Format in Filename:
                </label>
                <div className="tsf-input-group">
                  <input
                    id="timestampFormat"
                    type="text"
                    value={config.timestampFormat}
                    onChange={(e) => updateConfig('timestampFormat', e.target.value)}
                    className="tsf-input"
                    placeholder="yyyyMMddHHmm"
                  />
                   <p className="tsf-help-text">
                  Example: {config.baseFilename}_20231215143022.{(config.fileExtension || '').toLowerCase()}
                </p>
                </div>
              </div>
            )}
          </div>

          {/* Local Storage Option (moved here) */}
          <div className="tsf-row tsf-row-folder" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label className="form-checkbox-label" style={{ margin: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={config.enableLocalSave}
                onChange={(e) => updateConfig('enableLocalSave', e.target.checked)}
                className="form-checkbox tsf-checkbox"
                style={{ marginRight: '8px' }}
              />
              <label className="form-label" htmlFor="enableLocalSave">Enable Local Save</label>
            </label>
            {config.enableLocalSave && <>
              <label className="form-label" htmlFor="destinationFolder" style={{ margin: 0, whiteSpace: 'nowrap' }}>Directory:</label>
              <input
                id="destinationFolder"
                type="text"
                value={config.destinationFolder}
                onChange={(e) => updateConfig('destinationFolder', e.target.value)}
                className="tsf-input"
                placeholder="Select destination folder"
                style={{ flex: 1, marginBottom: 0, minWidth: 0 }}
                disabled={!config.enableLocalSave}
              />
              <input
                id="folderInput"
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderInputChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleBrowseFolder}
                className="tsf-btn tsf-btn-secondary tsf-btn-inline"
                style={{ marginBottom: 0, whiteSpace: 'nowrap' }}
                disabled={!config.enableLocalSave}
              >
                Browse
              </button>
            </>}
          </div>

          {/* Remote Upload Option (moved here) */}
          <div className="tsf-row tsf-row-upload" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label className="form-checkbox-label" style={{ margin: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={config.enableRemoteUpload}
                onChange={(e) => updateConfig('enableRemoteUpload', e.target.checked)}
                className="form-checkbox tsf-checkbox"
                style={{ marginRight: '8px' }}
              />
              <label className="form-label" htmlFor="enableRemoteUpload">Enable Remote Upload</label>
            </label>
            {config.enableRemoteUpload && <>
              <label className="form-label" htmlFor="uploadProtocol" style={{ margin: 0, whiteSpace: 'nowrap' }}>Protocol:</label>
              <select
                id="uploadProtocol"
                value={config.uploadProtocol}
                onChange={(e) => updateConfig('uploadProtocol', e.target.value)}
                className="tsf-select"
                style={{ minWidth: '180px' }}
              >
                <option value="sftp-secure">SFTP - Secure</option>
                <option value="ftp-standard">FTP - Standard</option>
                <option value="ftps-ssl">FTPS - SSL/TLS</option>
                <option value="scp-protocol">SCP - Protocol</option>
              </select>
            </>}
          </div>
        </div>
      </div>
    </div>
</section>

          {/* Actions */}
          <div className="tsf-actions">
            <button
              type="button"
              onClick={onCancel}
              className="tsf-btn tsf-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tsf-btn tsf-btn-submit"
            >
              {initialData ? '✓ Update' : '+ Create'}
            </button>
          </div>
        </form>
      </div>
      <ReportSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
