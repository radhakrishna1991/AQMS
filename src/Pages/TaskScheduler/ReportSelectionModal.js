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
import "./ReportSelection.css";

export function ReportSelectionModal({ initialValue, onSave, onClose }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const [selectedOption, setSelectedOption] = useState(initialValue?.mode || "current-day");
  const [startDate, setStartDate] = useState(initialValue?.startDate || "");
  const [endDate, setEndDate] = useState(initialValue?.endDate || "");
  const [lookbackValue, setLookbackValue] = useState(initialValue?.lookbackValue || "");

  const [parameters, setParameters] = useState(
    initialValue?.parameters?.length
      ? initialValue.parameters
      : [
          { id: "1", siteName: "North Plant", parameterName: "Temperature Sensor 1", templateName: "Industrial Temp Sensor", description: "Main production floor ambient temperature" },
          { id: "2", siteName: "North Plant", parameterName: "Humidity Monitor", templateName: "Digital Humidity Sensor", description: "Relative humidity percentage in storage area" },
          { id: "3", siteName: "South Facility", parameterName: "Pressure Gauge A1", templateName: "High-Precision Pressure", description: "Atmospheric pressure in clean room environment" },
          { id: "4", siteName: "South Facility", parameterName: "Flow Meter 3", templateName: "Liquid Flow Sensor", description: "Water flow rate in cooling system" },
          { id: "5", siteName: "East Warehouse", parameterName: "Temperature Sensor 2", templateName: "Cold Storage Temp Monitor", description: "Temperature monitoring for refrigerated goods" },
          { id: "6", siteName: "East Warehouse", parameterName: "Motion Detector", templateName: "PIR Motion Sensor", description: "Security motion detection system" },
          { id: "7", siteName: "West Laboratory", parameterName: "pH Level Sensor", templateName: "Chemical pH Monitor", description: "pH level monitoring in testing tanks" },
          { id: "8", siteName: "West Laboratory", parameterName: "Light Intensity", templateName: "Lux Meter", description: "Ambient light measurement for experiments" },
        ]
  );

  const dateOptions = [
    { label: "Current Period", options: [
      { value: "current-day", label: "🌞 Current Day" },
      { value: "yesterday", label: "🕒 Yesterday" },
      { value: "current-week", label: "📅 Current Week" },
      { value: "current-month", label: "🗓️ Current Month" },
      { value: "current-quarter", label: "📊 Current Quarter" },
      { value: "current-year", label: "📆 Current Year" },
    ]},
    { label: "Previous Period", options: [
      { value: "last-week", label: "Last Week" },
      { value: "last-month", label: "Last Month" },
      { value: "last-quarter", label: "Last Quarter" },
      { value: "last-year", label: "Last Year" },
    ]},
    { label: "Custom", options: [{ value: "fixed-range", label: "🛠️ Fixed Date Range" }]},
    { label: "Lookback", options: [
      { value: "lookback-days", label: "🔁 Lookback Days" },
      { value: "lookback-hours", label: "⏰ Lookback Hours" },
      { value: "lookback-minutes", label: "⏳ Lookback Minutes" },
    ]},
  ];

  const customStyles = {
    option: (provided) => ({
      ...provided,
      minHeight: 48, display: "flex", alignItems: "center", fontSize: "16px", padding: "12px 16px",
    }),
    control: (provided) => ({ ...provided, minHeight: 48, fontSize: "16px" }),
    valueContainer: (provided) => ({ ...provided, minHeight: 48, display: "flex", alignItems: "center" }),
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isLookbackOption = selectedOption.startsWith("lookback-");
  const showDateInputs = selectedOption === "fixed-range";

  const filteredParameters = parameters.filter((p) =>
    Object.values(p).some((val) => (val || "").toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
  const paginatedParameters = filteredParameters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, parameters.length]);

  const handleSave = () => {
    const payload = { mode: selectedOption, startDate, endDate, lookbackValue, parameters };
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
                    onChange={(option) => setSelectedOption(option.value)}
                    classNamePrefix="date-range"
                    isSearchable={false}
                    styles={customStyles}
                  />
                </div>

                {showDateInputs && (
                  <div className="date-inputs">
                    <div className="input-group">
                      <label className="input-label">Start Time</label>
                      <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control date-input"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">End Time</label>
                      <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control date-input"
                      />
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
                        onChange={(e) => setLookbackValue(e.target.value)}
                        placeholder="Enter value"
                        className="form-control"
                        min="1"
                      />
                      <FontAwesomeIcon icon={faClock} className="input-icon" />
                    </div>
                  </div>
                )}
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
                    placeholder="Search parameters..."
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
                      <th className="modern-table-th">Site Name</th>
                      <th className="modern-table-th">Parameter Name</th>
                      <th className="modern-table-th">Template Name</th>
                      <th className="modern-table-th">Description</th>
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
                              onChange={() => handleSelectRow(param.id)}
                              aria-label="Select row"
                              className="modern-checkbox"
                            />
                          </td>
                          <td className="modern-table-td">{param.siteName}</td>
                          <td className="modern-table-td">{param.parameterName}</td>
                          <td className="modern-table-td">{param.templateName}</td>
                          <td className="modern-table-td description">{param.description}</td>
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
              </div>
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
