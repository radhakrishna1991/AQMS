import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCalendar,
  faClock,
  faTable,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

export function ReportSelectionModal({ initialValue, onSave, onClose, lookUpData }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState(initialValue?.startDate || "");
  const [endDate, setEndDate] = useState(initialValue?.endDate || "");
  const [lookbackValue, setLookbackValue] = useState(initialValue?.lookbackValue || "");
  const [parameters, setParameters] = useState(lookUpData?.listParameters || []);
  const [averageInterval, setAverageInterval] = useState(null);
  const [showOptions, setShowOptions] = useState([]);
  const [errors, setErrors] = useState({});
  
    // Error clearing handlers
    const handleDateRangeChange = (option) => {
      setSelectedOption(option.value);
      setErrors(errors => ({ ...errors, dateRange: undefined }));
    };
    const handleStartDateChange = (e) => {
      setStartDate(e.target.value);
      setErrors(errors => ({ ...errors, startDate: undefined, endDate: undefined }));
    };
    const handleEndDateChange = (e) => {
      setEndDate(e.target.value);
      setErrors(errors => ({ ...errors, endDate: undefined, startDate: undefined }));
    };
    const handleLookbackValueChange = (e) => {
      setLookbackValue(e.target.value);
      setErrors(errors => ({ ...errors, lookbackValue: undefined }));
    };
    const handleAverageIntervalChange = (option) => {
      setAverageInterval(option.value);
      setErrors(errors => ({ ...errors, averageInterval: undefined }));
    };
    const handleShowOptionsChange = (opts) => {
      setShowOptions((opts || []).map(o => o.value));
      setErrors(errors => ({ ...errors, showOptions: undefined }));
    };
    const handleSelectRowWithErrorClear = (id) => {
      setSelectedRows((prev) =>
        prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
      );
      setErrors(errors => ({ ...errors, parameters: undefined }));
    };

useEffect(() => {
  if (initialValue?.parametersID) {
    setSelectedRows(
      initialValue.parametersID
        .split(',')
        .map(id => isNaN(Number(id)) ? id : Number(id))
    );
  }
  if (initialValue?.averageInterval) {
    setAverageInterval(initialValue.averageInterval);
  }
  if (initialValue?.timePeriodTypeID) {
    setSelectedOption(initialValue.timePeriodTypeID);
  }
  if (initialValue?.lookbackValue) {
    setLookbackValue(initialValue.lookbackValue);
  }
  // Show options
  const opts = [];
  if (initialValue.showFlag) opts.push('showFlags');
  if (initialValue.showNullCodes) opts.push('showNullCodes');
  if (initialValue.showInvalidValues) opts.push('showInvalidValues');
  setShowOptions(opts);
}, [initialValue]);

const groupTimePeriodOptions = (listTimePeriodType = []) => {
  const groupMap = {
    "Current Period": [
      "CurrentDay", "Yesterday", "CurrentWeek", "CurrentMonth", "CurrentQuarter", "CurrentYear"
    ],
    "Previous Period": [
      "LastWeek", "LastMonth", "LastQuarter", "LastYear"
    ],
    "Custom": [
      "FixedRange"
    ],
    "Lookback": [
      "LookbackDays", "LookbackHours", "LookbackMinutes"
    ]
  };

  // Emoji map for labels
  const emojiMap = {
    "CurrentDay": "🌞",
    "Yesterday": "🕒",
    "CurrentWeek": "📅",
    "CurrentMonth": "🗓️",
    "CurrentQuarter": "📊",
    "CurrentYear": "📆",
    "FixedRange": "🛠️",
    "LookbackDays": "🔁",
    "LookbackHours": "⏰",
    "LookbackMinutes": "⏳"
  };
  // Build grouped options
  return Object.entries(groupMap).map(([groupLabel, codes]) => ({
    label: groupLabel,
    options: listTimePeriodType
      .filter(opt => codes.includes(opt.timePeriodCode))
      .map(opt => ({
        value: opt.timePeriodTypeID,
        label: `${emojiMap[opt.timePeriodCode] || ""} ${opt.timePeriodName}`.trim()
      }))
  })).filter(group => group.options.length > 0);
};
const dateOptions = groupTimePeriodOptions(lookUpData?.listTimePeriodType);

  const customStyles = {
    option: (provided) => ({
      ...provided,
      minHeight: 48, display: "flex", alignItems: "center", fontSize: "16px", padding: "12px 16px",
    }),
    control: (provided) => ({ ...provided, minHeight: 48, fontSize: "16px" }),
    valueContainer: (provided) => ({ ...provided, minHeight: 48, display: "flex", alignItems: "center" }),
  };

  const [searchTerm, setSearchTerm] = useState("");
  const averageIntervalOptions = [
    { value: "1min", label: "1min average" },
    { value: "15min", label: "15min average" },
    { value: "1hr", label: "1hr average" },
    { value: "1day", label: "1day average" },
  ];
  const showOptionsList = [
    { value: 'showFlags', label: 'Show Flags' },
    { value: 'showNullCodes', label: 'Show Null Codes' },
    { value: 'showInvalidValues', label: 'Show Invalid Values' },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isLookbackOption = [1, 2, 13].includes(selectedOption);
  const showDateInputs = selectedOption === 9; // Fixed Range

 // const filteredParameters = parameters.filter(x => x.parameterName.toLowerCase().includes(searchTerm.toLowerCase()));
 const term = searchTerm.toLowerCase();

const filteredParameters = parameters.filter(p =>
  p.parameterName.toLowerCase().includes(term) ||
  p.siteName.toLowerCase().includes(term)
);
  // const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
  // const paginatedParameters = filteredParameters.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, parameters.length]);

  const handleSave = () => {
    const newErrors = {};
    // Date range (time period) validation
    if (!selectedOption) {
      newErrors.dateRange = 'Date range selection is required';
    }
    // If FixedRange, require start and end date
    if (selectedOption === 9) {
      if (!startDate) newErrors.startDate = 'Start date is required';
      if (!endDate) newErrors.endDate = 'End date is required';
      if (startDate && endDate && startDate > endDate) newErrors.endDate = 'End date must be after start date';
    }
    // If lookback, require lookback value
    if ([1, 2, 13].includes(selectedOption)) {
      if (!lookbackValue || isNaN(Number(lookbackValue)) || Number(lookbackValue) < 1) {
        newErrors.lookbackValue = 'Lookback interval must be a positive number';
      }
    }
    // Average interval validation
    if (!averageInterval) {
      newErrors.averageInterval = 'Average interval is required';
    }
    // Show options validation (at least one must be selected)
    if (!showOptions || showOptions.length === 0) {
      newErrors.showOptions = 'At least one show option must be selected';
    }
    // Parameter selection validation
    if (!selectedRows || selectedRows.length === 0) {
      newErrors.parameters = 'At least one parameter must be selected';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Map showOptions to booleans
    const ShowFlag = showOptions.includes('showFlags');
    const ShowNullCodes = showOptions.includes('showNullCodes');
    const ShowInvalidValues = showOptions.includes('showInvalidValues');

    const payload = {
      TimePeriodTypeID: selectedOption || null,
      LookbackInterval: lookbackValue || null,
      ParametersID: selectedRows.join(','),
      AverageInterval: averageInterval || '',
      ShowFlag,
      ShowNullCodes,
      ShowInvalidValues,
    };
    onSave?.(payload);   // parent will collapse
  };

  // 🔧 CHANGE: remove internal header & local open state; keep only body + footer
  return (
    <div className="rq-accordion-panel">
      {/* Body (unchanged layout) */}
      <div className="rq-panel-body">
        <div className="content-grid">
          {/* Date Range Selection - Left Side (30%) */}
          <div className="date-section">
            <div className="date-range-container">
              <div className="date-range-header">
                <div className="header-content">
                  <FontAwesomeIcon icon={faCalendar} className="header-icon" />
                  <div>
                    <h3 className="header-title">Date Range Selection</h3>
                    <p className="header-subtitle">Choose your time period</p>
                  </div>
                </div>
              </div>

              <div className="date-range-body">
                <div className="dropdown-container">
                  <label className="input-label">Select Date Range</label>
                  <Select
                    options={dateOptions}
                    value={dateOptions.flatMap(g => g.options).find(opt => opt.value === selectedOption)}
                    onChange={handleDateRangeChange}
                    classNamePrefix="date-range"
                    isSearchable={false}
                    styles={customStyles}
                  />
                  {errors.dateRange && (
                    <p className="tsf-error-text">{errors.dateRange}</p>
                  )}
                </div>

                {showDateInputs && (
                  <div className="date-inputs">
                    <div className="input-group">
                      <label className="input-label">Start Time</label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="form-control date-input"
                      />
                      {errors.startDate && (
                        <p className="tsf-error-text">{errors.startDate}</p>
                      )}
                    </div>
                    <div className="input-group">
                      <label className="input-label">End Time</label>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="form-control date-input"
                      />
                      {errors.endDate && (
                        <p className="tsf-error-text">{errors.endDate}</p>
                      )}
                    </div>
                  </div>
                )}

                {isLookbackOption && (
                  <div className="lookback-input-container">
                    <label className="input-label">Lookback Intervals</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        value={lookbackValue}
                        onChange={handleLookbackValueChange}
                        placeholder="Enter value"
                        className="form-control"
                        min="1"
                      />
                      <FontAwesomeIcon icon={faClock} className="input-icon" />
                    </div>
                    {errors.lookbackValue && (
                      <p className="tsf-error-text">{errors.lookbackValue}</p>
                    )}
                  </div>
                )}
                <div className="dropdown-container" style={{ marginTop: 16 }}>
                  <label className="input-label">Average Interval</label>
                  <Select
                    options={averageIntervalOptions}
                    value={averageIntervalOptions.find(opt => opt.value === averageInterval)}
                    onChange={handleAverageIntervalChange}
                    classNamePrefix="average-interval"
                    isSearchable={false}
                    styles={customStyles}
                    placeholder="Select average interval"
                  />
                  {errors.averageInterval && (
                    <p className="tsf-error-text">{errors.averageInterval}</p>
                  )}
                </div>
                {/* Multi-select for flags/null/invalid */}
                <div className="dropdown-container" style={{ marginTop: 16 }}>
                  <label className="input-label">Show Options</label>
                  <Select
                    options={showOptionsList}
                    value={showOptionsList.filter(opt => showOptions.includes(opt.value))}
                    onChange={handleShowOptionsChange}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    classNamePrefix="show-options"
                    styles={customStyles}
                    placeholder="Select options..."
                    isSearchable={false}
                    components={{
                      Option: (props) => {
                        return (
                          <div
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              props.innerProps.onClick(e);
                            }}
                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '8px 12px' }}
                          >
                            <input
                              type="checkbox"
                              checked={props.isSelected}
                              readOnly
                              style={{ marginRight: 8 }}
                            />
                            <span>{props.label}</span>
                          </div>
                        );
                      }
                    }}
                  />
                  {errors.showOptions && (
                    <p className="tsf-error-text">{errors.showOptions}</p>
                  )}
                </div>
              </div>          
            </div>
          </div>

          {/* Parameter Selection - Right Side (70%) */}
          <div className="parameter-section">
            <div className="parameter-grid-container">
              <div className="parameter-grid-header">
                <div className="header-row">
                  <div className="header-left">
                    <FontAwesomeIcon icon={faTable} className="table-icon" />
                    <div>
                      <h3 className="parameter-title">Parameter Configuration</h3>
                    </div>
                  </div>
                </div>

                <div className="search-wrapper">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search site/parameters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control search-input"
                  />
                </div>
              </div>

              <div className="modern-table-wrapper">
              <table>
                <thead className="modern-table-header">
                  <tr>
                    <th className="modern-table-checkbox">#</th>
                    <th className="modern-table-th">Monitoring Type</th>
                    <th className="modern-table-th">Site Name</th>
                    <th className="modern-table-th">Parameter Name</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredParameters.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="modern-table-empty">
                        {searchTerm
                          ? "No site/parameters match your search"
                          : "No parameters available"}
                      </td>
                    </tr>
                  ) : (
                    filteredParameters.map((param, idx) => (
                      <tr
                        key={param.id}
                        className={
                          idx % 2 === 0
                            ? "modern-table-row-even"
                            : "modern-table-row-odd"
                        }
                      >
                        <td className="modern-table-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(param.id)}
                            onChange={() =>
                              handleSelectRowWithErrorClear(param.id)
                            }
                            className="modern-checkbox"
                          />
                        </td>

                        <td className="modern-table-td">{param.monitoringTypeName}</td>
                        <td className="modern-table-td">{param.siteName}</td>
                        <td className="modern-table-td">{param.parameterName}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

          {errors.parameters && (
            <p className="tsf-error-text">{errors.parameters}</p>
          )}
        </div>
              {/* <div className="modern-table-wrapper">
                <table>
                  <thead className="modern-table-header">
                    <tr>
                      <th className="modern-table-checkbox">#</th>
                      <th className="modern-table-th">Site Name</th>
                      <th className="modern-table-th">Parameter Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedParameters.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="modern-table-empty">
                          {searchTerm ? "No parameters match your search" : "No parameters available"}
                        </td>
                      </tr>
                    ) : (
                      paginatedParameters.map((param, idx) => (
                        <tr
                          key={param.id}
                          className={idx % 2 === 0 ? "modern-table-row-even" : "modern-table-row-odd"}
                        >
                          <td className="modern-table-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(param.id)}
                              onChange={() => handleSelectRowWithErrorClear(param.id)}
                              aria-label="Select row"
                              className="modern-checkbox"
                            />
                          </td>
                          <td className="modern-table-td">{param.siteName}</td>
                          <td className="modern-table-td">{param.parameterName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>

                  {totalPages > 1 && (
                    <nav>
                      <ul className="pagination justify-content-end mt-3 mb-0">
                        <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={e => { e.preventDefault(); setCurrentPage(currentPage - 1); }}
                            disabled={currentPage === 1}
                            aria-label="Previous"
                            type="button"
                          >
                            <span aria-hidden="true">&laquo;</span>
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <li
                            key={i + 1}
                            className={`page-item${currentPage === i + 1 ? " active" : ""}`}
                          >
                            <button
                              className="page-link"
                              type="button"
                              onClick={e => { e.preventDefault(); setCurrentPage(i + 1); }}
                            >
                              {i + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={e => { e.preventDefault(); setCurrentPage(currentPage + 1); }}
                            disabled={currentPage === totalPages}
                            aria-label="Next"
                            type="button"
                          >
                            <span aria-hidden="true">&raquo;</span>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </table>
                {errors.parameters && (
                  <p className="tsf-error-text">{errors.parameters}</p>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rq-panel-footer mb-3 me-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <FontAwesomeIcon icon={faCheck} className="icon-small" />
          Save
        </button>
      </div>
    </div>
  );
}
