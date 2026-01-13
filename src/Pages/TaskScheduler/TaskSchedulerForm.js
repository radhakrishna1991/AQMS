import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskSchedulerForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faCheck,
  faTimes,
  faFileAlt,
  faCog,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { ReportSelectionModal } from './ReportSelectionModal';
import CommonFunctions from "../../utils/CommonFunctions";
import { toast } from "react-toastify";

export function TaskSchedulerForm({ initialData, onSubmit, onCancel, fetchTaskSchedulerLookup, lookUpData }) {
  const [formData, setFormData] = useState({
    taskName: initialData?.jobName || '',
    description: initialData?.jobDescription || '',
    startTime: initialData?.effectiveStartDateTime || '',
    repeatInterval: initialData?.executionIntervalMinutes || '',
    intervalUnit: initialData?.intervalUnit || '',
    numberOfRetries: initialData?.retryLimit || '',
    intervalBetweenRetries: initialData?.retryDelayMinutes || '',
    intervalBetweenRetriesUnit: initialData?.intervalBetweenRetriesUnit || '',
    enabled: initialData?.isActive ?? true,
    daysToRun: {
      sunday: initialData?.executeOnSunday || true,
      monday: initialData?.executeOnMonday || true,
      tuesday: initialData?.executeOnTuesday || true,
      wednesday: initialData?.executeOnWednesday || true,
      thursday: initialData?.executeOnThursday || true,
      friday: initialData?.executeOnFriday || true,
      saturday: initialData?.executeOnSaturday || true,
    },
    timeRestriction:
      (!initialData?.dailyExecutionStartTime && !initialData?.dailyExecutionEndTime)
        ? 'unrestricted'
        : 'between',
    timeFrom: initialData?.dailyExecutionStartTime || '',
    timeTo: initialData?.dailyExecutionEndTime || '',
  });
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [activeTab, setActiveTab] = useState('file-output');
  const [config, setConfig] = useState({});
    // State for reportQuery to send to ReportSelectionModal
  const [reportQuery, setReportQuery] = useState({});

  useEffect(() => {
    if (initialData) {
      setReportQuery({
        parametersID: initialData.parametersID || "",
        timePeriodTypeID: initialData.timePeriodTypeID || "",
        averageInterval: initialData.averageInterval || "",
        showFlag: initialData.showFlag || false,
        showNullCodes: initialData.showNullCodes || false,
        showInvalidValues: initialData.showInvalidValues || false,
        lookbackValue: initialData.lookbackInterval || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || ""
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) return;

    // Helper to update formData fields
    const updateForm = (fields) => setFormData(prev => ({ ...prev, ...fields }));
    // Helper to update config fields
    const updateCfg = (fields) => setConfig(prev => ({ ...prev, ...fields }));

    // Split interval/unit fields
    if (initialData.retryDelayMinutes) {
      const [interval, unit] = initialData.retryDelayMinutes.split('-');
      updateForm({ repeatInterval: interval, intervalUnit: unit });
    }
    if (initialData.executionIntervalMinutes) {
      const [interval, unit] = initialData.executionIntervalMinutes.split('-');
      updateForm({ intervalBetweenRetries: interval, intervalBetweenRetriesUnit: unit });
    }

    // Simple assignments
    if (initialData.retryLimit !== undefined) updateForm({ numberOfRetries: initialData.retryLimit });

    // Days to run
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    if (days.some(day => initialData[`executeOn${day.charAt(0).toUpperCase() + day.slice(1)}`] !== undefined)) {
      updateForm({
        daysToRun: Object.fromEntries(
          days.map(day => [
            day,
            initialData[`executeOn${day.charAt(0).toUpperCase() + day.slice(1)}`] ?? true
          ])
        )
      });
    }

    // Time restriction
    updateForm(
      !initialData.dailyExecutionStartTime && !initialData.dailyExecutionEndTime
        ? { timeRestriction: 'unrestricted' }
        : {
            timeRestriction: 'between',
            timeFrom: initialData.dailyExecutionStartTime || '',
            timeTo: initialData.dailyExecutionEndTime || ''
          }
    );

    // Config assignments
    if (initialData.downloadedFileName) updateCfg({ baseFilename: initialData.downloadedFileName });
    if (initialData.localFileDownloadPath) updateCfg({ destinationFolder: initialData.localFileDownloadPath });
    if (initialData.localFileDownload !== undefined) updateCfg({ enableLocalSave: !!initialData.localFileDownload });
    if (initialData.ftpFileDownload !== undefined) updateCfg({ enableRemoteUpload: !!initialData.ftpFileDownload });
    if (initialData.ftpConfigID) updateCfg({ uploadProtocol: initialData.ftpConfigID });

    if (initialData.fileDownloadFormat !== undefined) {
      const extMap = { xls: 'XLS', csv: 'CSV', pdf: 'PDF' };
      updateCfg({
        exportFormat: initialData.fileDownloadFormat,
        fileExtension: extMap[(initialData.fileDownloadFormat || '').toLowerCase()] || ''
      });
    }
    if (initialData.isDateFormatAppend !== undefined) updateCfg({ includeTimestamp: initialData.isDateFormatAppend });

    // Report query
    if (initialData.timePeriodTypeID !== undefined) {
      setReportQuery(prev => ({
        ...prev,
        timePeriodTypeID: initialData.timePeriodTypeID || "",
      }));
    }
  }, [initialData]);

  const updateConfig = (field, value) => {
    if (field === 'exportFormat') {
      let ext = '';
      switch (value) {
        case 'xls': ext = 'XLS'; break;
        case 'csv': ext = 'CSV'; break;
        case 'pdf': ext = 'PDF'; break;
        default: ext = '';
      }
      setConfig(prev => ({ ...prev, exportFormat: value, fileExtension: ext }));
    } else {
      setConfig(prev => ({ ...prev, [field]: value }));
    }
  };

  const [errors, setErrors] = useState({});
  const [showAccordion, setShowAccordion] = useState(false);
  const [showAccordionHeader, setShowAccordionHeader] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleBrowseFolder = async () => {
    const input = document.getElementById('folderInput');
    if (input) input.click();
  };

  const handleFolderInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
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

// Helper to ensure datetime is in yyyy-MM-ddTHH:mm:ss
const formatDateTime = (dt) => {
  if (!dt) return null;
  // If already has seconds, return as is
  if (dt.length === 19) return dt;
  // If missing seconds, add :00
  if (dt.length === 16) return dt + ':00';
  return dt;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      JobName: formData.taskName,
      JobDescription: formData.description,
      IsActive: formData.enabled,
      RetryLimit: parseInt(formData.numberOfRetries, 10) || 0,
      RetryDelayMinutes: formData.intervalBetweenRetries && formData.intervalBetweenRetriesUnit
        ? `${formData.intervalBetweenRetries}-${formData.intervalBetweenRetriesUnit}`
        : '',
      EffectiveStartDateTime: formatDateTime(formData.startTime),
      ExecutionIntervalMinutes: formData.repeatInterval && formData.intervalUnit ? `${formData.repeatInterval}-${formData.intervalUnit}` : '',
      ExecuteOnSunday: formData.daysToRun.sunday,
      ExecuteOnMonday: formData.daysToRun.monday,
      ExecuteOnTuesday: formData.daysToRun.tuesday,
      ExecuteOnWednesday: formData.daysToRun.wednesday,
      ExecuteOnThursday: formData.daysToRun.thursday,
      ExecuteOnFriday: formData.daysToRun.friday,
      ExecuteOnSaturday: formData.daysToRun.saturday,
      DailyExecutionStartTime: formData.timeFrom,
      DailyExecutionEndTime: formData.timeTo,
      ...(config.reportQuery || {}),
      TimePeriodTypeID: config.reportQuery?.TimePeriodTypeID ?? null,
      LookbackInterval: config.reportQuery?.LookbackInterval ?? null,
      ParametersID: config.reportQuery?.ParametersID ?? '',
      AverageInterval: config.reportQuery?.AverageInterval ?? '',
      ShowFlag: config.reportQuery?.ShowFlag ?? null,
      ShowNullCodes: config.reportQuery?.ShowNullCodes ?? null,
      ShowInvalidValues: config.reportQuery?.ShowInvalidValues ?? null,
      LocalFileDownload: config.enableLocalSave,
      LocalFileDownloadPath: config.destinationFolder,
      DownloadedFileName: config.baseFilename,
      IsDateFormatAppend: config.includeTimestamp,
      DateFormatAppend: "yyyyMMddHHmm",
      FileDownloadFormat: config.exportFormat,
      FtpFileDownload: config.enableRemoteUpload,
      FtpConfigID: config.uploadProtocol ?? null,
      ReportTypeId: config?.reportType ?? null,
      CreatedBy:currentUser.id,
    };

    // Determine if this is an update or create
    const isEdit = initialData && (initialData.jobID);
    let url = CommonFunctions.getWebApiUrl() + "api/ScheduleTask";
    let method = 'POST';
    if (isEdit) {
      // For update, add jobID or id to payload and use PUT
      if (initialData.jobID) payload.JobID = initialData.jobID;
      else if (initialData.id) payload.JobID = initialData.id;
      url = CommonFunctions.getWebApiUrl() + "api/ScheduleTask/" + `${initialData.jobID}`;
      method = 'PUT';
    }

    try {
      let authHeader = await CommonFunctions.getAuthHeader();
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
        },
        body: JSON.stringify(payload),
      });
      const responseJson = await response.text();
      if (responseJson == "Success" || responseJson == 1) {
        toast.success(isEdit ? "Job updated successfully" : "Job added successfully");
        fetchTaskSchedulerLookup();
        if (onSubmit) onSubmit();
      } else if (responseJson == "JobExists" || responseJson == 2) {
        toast.error(
          "Job already exists with the given name. Please try with another name."
        );
        return false;
      } else {
        toast.error(
          isEdit
            ? "Unable to update the Job. Please contact administrator"
            : "Unable to add the Job. Please contact administrator"
        );
        return false;
      }
    } catch (error) {
      toast.error(
        isEdit
          ? "Unable to update the task. Please contact administrator"
          : "Unable to schedule the task. Please contact administrator"
      );
    }
  };

  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
      <>
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
                  <option value="S">Seconds</option>
                  <option value="M">Minutes</option>
                  <option value="H">Hours</option>
                  <option value="D">Days</option>
                  <option value="W">Weeks</option>
                  <option value="M">Months</option>
                  <option value="Y">Years</option>

                </select>
              </div>
                {errors.repeatInterval && (
                <p id="repeatInterval-error" className="tsf-error-text"> {errors.repeatInterval}</p>
              )}
            </div>

            {/* Number of Retries and Interval Between Retries in one row */}
            <div className="tsf-row" style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              {/* Number of Retries */}
              <div style={{ flex: 1 }}>
                <label className="form-label">Number of Retries:</label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfRetries}
                  onChange={e => handleChange('numberOfRetries', e.target.value.replace(/[^0-9]/g, ''))}
                  className="tsf-input-repeat-number"
                  placeholder="0"
                />
              </div>
              {/* Interval Between Retries */}
                <label className="form-label">Interval Between Retries:</label>
              <div style={{ flex: 1 }}>
                <div className="tsf-input-repeat tsf-flex flex">
                  <div className="tsf-relative tsf-flex-1">
                    <input
                      type="number"
                      min="1"
                      value={formData.intervalBetweenRetries}
                      onChange={e => handleChange('intervalBetweenRetries', e.target.value.replace(/[^0-9]/g, ''))}
                      className="tsf-input-repeat-number"
                      placeholder="1"
                    />
                  </div>
                  <select
                    value={formData.intervalBetweenRetriesUnit}
                    onChange={e => handleChange('intervalBetweenRetriesUnit', e.target.value)}
                    className="tsf-select"
                  >
                    <option value="S">Seconds</option>
                    <option value="M">Minutes</option>
                    <option value="H">Hours</option>
                    <option value="D">Days</option>
                  </select>
                </div>
              </div>
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

          {/* ===== Report Data Section ===== */}
          <section className="tsf-section">
            <div className="tsf-section-header">
              <FontAwesomeIcon icon={faFileAlt} className="tsf-section-faicon" />
              <h4 className="tsf-section-title">Report Data</h4>
            </div>


            <div
              className="tsf-topbar-grid"
              aria-label="Report Data Source and Export Filters"
              style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '8px 0 16px' }}
            >
              <label className="form-label" htmlFor="dataSourceSelect" style={{ margin: 0, whiteSpace: 'nowrap' }}>
                Report:
              </label>
              <select
                id="dataSourceSelect"
                value={config.reportType}
                onChange={(e) => updateConfig('reportType', e.target.value)}
                className="tsf-select tsf-select-legacy"
                style={{ minWidth: '200px' }}
              >
                <option value="1">System Logs</option>
                <option value="2">Event History</option>
                <option value="3">Activity Records</option>
                <option value="4">Performance Metrics</option>
              </select>
              <button
                type="button"
                className="tsf-btn tsf-btn-legacy"
                aria-label="Configure Report Query"
                aria-expanded={showAccordion}
                aria-controls="report-query-collapse"
                onClick={() => {
                  setShowAccordionHeader(true);
                  setShowAccordion(true);
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                <FontAwesomeIcon icon={faCog} className="tsf-btn-icon" />
                Configure Report Query
              </button>
            </div>

            {/* ===== Accordion (Bootstrap flush style) ===== */}
            <div className="accordion accordion-flush" id="reportQueryAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header" id="reportQueryHeading">
                  {showAccordionHeader && (
                    <button
                      className={`accordion-header-button accordion-button ${showAccordion ? '' : 'collapsed'}`}
                      type="button"
                      aria-expanded={showAccordion}
                      aria-controls="report-query-collapse"
                      onClick={() => {
                        if (showAccordion) {
                          setShowAccordion(false);
                          setShowAccordionHeader(false);
                        } else {
                          setShowAccordion(true);
                        }
                      }}
                    >
                      Report Query Configuration
                    </button>
                  )}
                </h2>

                <div
                  id="report-query-collapse"
                  className={`accordion-collapse collapse ${showAccordion ? 'show' : ''}`}
                  aria-labelledby="reportQueryHeading"
                  data-bs-parent="#reportQueryAccordion"
                >
                  <div className="accordion-body p-0">
                    <ReportSelectionModal
                      initialValue={reportQuery}
                      onSave={(payload) => {
                        updateConfig('reportQuery', payload);
                        setShowAccordion(false);
                        setShowAccordionHeader(false);
                      }}
                      lookUpData={lookUpData}
                      onClose={() => {
                        setShowAccordion(false);
                        setShowAccordionHeader(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* Tabs and File Output Settings: Only show when accordion is closed */}
            {!showAccordion && (
              <>
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
                          {lookUpData?.listReportFormat?.map((format) => (
                            <option key={format.reportFormatID} value={format.fileExtensionType.toLowerCase()}>
                              {format.formatName} (.{format.fileExtensionType.toLowerCase()})
                            </option>
                          ))}
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
                            value={"yyyyMMddHHmm"}
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
                    <label className="form-checkbox-label" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
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
                      <label className="form-label" htmlFor="destinationFolder">Directory:</label>
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
                    <label className="form-checkbox-label" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
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
                      <label className="form-label" htmlFor="uploadProtocol">Protocol:</label>
                      <select
                        id="uploadProtocol"
                        value={config.uploadProtocol}
                        onChange={(e) => updateConfig('uploadProtocol', e.target.value)}
                        className="tsf-select"
                        style={{ minWidth: '180px' }}
                      >
                        <option value="">Select protocol...</option>
                        {lookUpData?.listFileTransferType?.map((type) => (
                          <option key={type.fileTransferTypeID} value={type.fileTransferTypeID}>
                            {type.fileTransferTypeName} ({type.fileTransferTypeDescription})
                          </option>
                        ))}
                      </select>
                    </>}
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
          </section>


          {/* Actions */}
          {!showAccordion && (
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
          )}
        </form>
       </div>
    </div>
    </>
  );
}
