
import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskSchedulerForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faRedoAlt, faCheckCircle, faCheck, faTimes, faFileAlt, faCog, faFile, faCalendar, faFolder, faUpload } from '@fortawesome/free-solid-svg-icons';

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
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);

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
            <div className='d-flex'>
            <div className="tsf-row col-6">
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
            <div className="col-6">
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
            <div className="tsf-section-header">
              <FontAwesomeIcon icon={faFileAlt} className="tsf-section-faicon" />
              <h4 className="tsf-section-title">Report Data</h4>
            </div>
                  <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm text-slate-600 mb-2">Data Source:</label>
            <select
              value={config.reportType}
              onChange={(e) => updateConfig('reportType', e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="system-logs">System Logs</option>
              <option value="event-history">Event History</option>
              <option value="activity-records">Activity Records</option>
              <option value="performance-metrics">Performance Metrics</option>
            </select>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mt-auto">
            <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
            Set Export Filters
          </button>
        </div>
              <div className="border-b border-slate-200 bg-slate-50">
        <div className="flex gap-1 px-6">
          <button
            onClick={() => setActiveTab('printing')}
            className={`px-5 py-3 transition-colors relative ${
              activeTab === 'printing'
                ? 'text-blue-700 bg-white border-t-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Print Settings
          </button>
          <button
            onClick={() => setActiveTab('notification')}
            className={`px-5 py-3 transition-colors relative ${
              activeTab === 'notification'
                ? 'text-blue-700 bg-white border-t-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Notification Settings
          </button>
          <button
            onClick={() => setActiveTab('file-output')}
            className={`px-5 py-3 transition-colors relative ${
              activeTab === 'file-output'
                ? 'text-blue-700 bg-white border-t-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            File Output Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'printing' && (
          <div className="text-center py-12 text-slate-500">
            <FontAwesomeIcon icon={faFile} className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Print settings configuration</p>
          </div>
        )}

        {activeTab === 'notification' && (
          <div className="text-center py-12 text-slate-500">
            <FontAwesomeIcon icon={faFile} className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Notification settings configuration</p>
          </div>
        )}

        {activeTab === 'file-output' && (
          <div className="space-y-6">
            {/* Export Format */}
            <div className="bg-slate-50 rounded-lg p-5">
              <label className="block text-slate-700 mb-3">Export Format:</label>
              <select
                value={config.exportFormat}
                onChange={(e) => updateConfig('exportFormat', e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select format...</option>
                <option value="txt">Text File (.txt)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
                <option value="xml">XML (.xml)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>

            {/* File Naming Settings */}
            <div className="border border-slate-200 rounded-lg p-5">
              <h3 className="text-slate-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFile} className="w-5 h-5 text-blue-600" />
                File Naming Settings
              </h3>
              
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-600 mb-2">Base Filename:</label>
                  <input
                    type="text"
                    value={config.baseFilename}
                    onChange={(e) => updateConfig('baseFilename', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter base filename"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-600 mb-2">File Extension:</label>
                  <input
                    type="text"
                    value={config.fileExtension}
                    onChange={(e) => updateConfig('fileExtension', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="TXT"
                  />
                </div>
              </div>

              <div className="mt-5 bg-blue-50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={config.includeTimestamp}
                      onChange={(e) => updateConfig('includeTimestamp', e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-700 group-hover:text-slate-900">Include Timestamp in Filename</span>
                    {config.includeTimestamp && (
                      <div className="mt-3">
                        <label className="block text-sm text-slate-600 mb-2 flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                          Timestamp Format:
                        </label>
                        <input
                          type="text"
                          value={config.timestampFormat}
                          onChange={(e) => updateConfig('timestampFormat', e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                          placeholder="yyyyMMddHHmm"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Example: {config.baseFilename}_20231215143022.{config.fileExtension.toLowerCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Local Storage Options */}
            <div className="border border-slate-200 rounded-lg p-5">
              <h3 className="text-slate-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFolder} className="w-5 h-5 text-blue-600" />
                Local Storage Options
              </h3>

              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={config.enableLocalSave}
                    onChange={(e) => updateConfig('enableLocalSave', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <span className="text-slate-700 group-hover:text-slate-900">Enable Local Save</span>
              </label>

              {config.enableLocalSave && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="block text-sm text-slate-600 mb-2">Destination Folder:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.destinationFolder}
                      onChange={(e) => updateConfig('destinationFolder', e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                      placeholder="Select destination folder"
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
                      onClick={handleBrowseFolder}
                      className="px-5 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Browse
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Remote Upload Settings */}
            <div className="border border-slate-200 rounded-lg p-5">
              <h3 className="text-slate-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} className="w-5 h-5 text-blue-600" />
                Remote Upload Settings
              </h3>

              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={config.enableRemoteUpload}
                    onChange={(e) => updateConfig('enableRemoteUpload', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <span className="text-slate-700 group-hover:text-slate-900">Enable Remote Upload</span>
              </label>

              {config.enableRemoteUpload && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="block text-sm text-slate-600 mb-2">Upload Protocol:</label>
                  <select
                    value={config.uploadProtocol}
                    onChange={(e) => updateConfig('uploadProtocol', e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="sftp-secure">SFTP - Secure</option>
                    <option value="ftp-standard">FTP - Standard</option>
                    <option value="ftps-ssl">FTPS - SSL/TLS</option>
                    <option value="scp-protocol">SCP - Protocol</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
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
    </div>
  );
}
