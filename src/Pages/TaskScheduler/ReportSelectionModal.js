import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faCalendar,
  faClock,
  faTable,
  faPlus,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./ReportSelection.css";
import Select from "react-select";

export function ReportSelectionModal({ isOpen, onClose }) {
  const modalRef = useRef();

  // Date Range Selector State
  const [selectedOption, setSelectedOption] = useState("current-day");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lookbackValue, setLookbackValue] = useState("");

  // Parameter Grid State
  const [parameters, setParameters] = useState([
    {
      id: "1",
      siteName: "North Plant",
      parameterName: "Temperature Sensor 1",
      templateName: "Industrial Temp Sensor",
      description: "Main production floor ambient temperature",
    },
    {
      id: "2",
      siteName: "North Plant",
      parameterName: "Humidity Monitor",
      templateName: "Digital Humidity Sensor",
      description: "Relative humidity percentage in storage area",
    },
    {
      id: "3",
      siteName: "South Facility",
      parameterName: "Pressure Gauge A1",
      templateName: "High-Precision Pressure",
      description: "Atmospheric pressure in clean room environment",
    },
    {
      id: "4",
      siteName: "South Facility",
      parameterName: "Flow Meter 3",
      templateName: "Liquid Flow Sensor",
      description: "Water flow rate in cooling system",
    },
    {
      id: "5",
      siteName: "East Warehouse",
      parameterName: "Temperature Sensor 2",
      templateName: "Cold Storage Temp Monitor",
      description: "Temperature monitoring for refrigerated goods",
    },
    {
      id: "6",
      siteName: "East Warehouse",
      parameterName: "Motion Detector",
      templateName: "PIR Motion Sensor",
      description: "Security motion detection system",
    },
    {
      id: "7",
      siteName: "West Laboratory",
      parameterName: "pH Level Sensor",
      templateName: "Chemical pH Monitor",
      description: "pH level monitoring in testing tanks",
    },
    {
      id: "8",
      siteName: "West Laboratory",
      parameterName: "Light Intensity",
      templateName: "Lux Meter",
      description: "Ambient light measurement for experiments",
    },
  ]);

  const dateOptions = [
    {
      label: "Current Period",
      options: [
        { value: "current-day", label: "🌞 Current Day" },
        { value: "yesterday", label: "🕒 Yesterday" },
        { value: "current-week", label: "📅 Current Week" },
        { value: "current-month", label: "🗓️ Current Month" },
        { value: "current-quarter", label: "📊 Current Quarter" },
        { value: "current-year", label: "📆 Current Year" },
      ],
    },
    {
      label: "Previous Period",
      options: [
        { value: "last-week", label: "Last Week" },
        { value: "last-month", label: "Last Month" },
        { value: "last-quarter", label: "Last Quarter" },
        { value: "last-year", label: "Last Year" },
      ],
    },
    {
      label: "Custom",
      options: [{ value: "fixed-range", label: "🛠️ Fixed Date Range" }],
    },
    {
      label: "Lookback",
      options: [
        { value: "lookback-days", label: "🔁 Lookback Days" },
        { value: "lookback-hours", label: "⏰ Lookback Hours" },
        { value: "lookback-minutes", label: "⏳ Lookback Minutes" },
      ],
    },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      minHeight: 48, // Increase this value for more height
      display: "flex",
      alignItems: "center",
      fontSize: "16px", // Optional: larger text
      padding: "12px 16px", // Optional: more padding
    }),
    control: (provided) => ({
      ...provided,
      minHeight: 48,
      fontSize: "16px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      minHeight: 48,
      display: "flex",
      alignItems: "center",
    }),
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ...existing code...

  useEffect(() => {
    let modalInstance;
    const node = modalRef.current;
    if (window.bootstrap && node) {
      modalInstance = window.bootstrap.Modal.getOrCreateInstance(node, {
        backdrop: "static",
        keyboard: false,
      });
      if (isOpen) {
        modalInstance.show();
        document.body.classList.add("modal-blur-bg");
      } else {
        modalInstance.hide();
        document.body.classList.remove("modal-blur-bg");
      }
      // Listen for modal close (from user clicking backdrop or X)
      const handleHidden = () => {
        onClose && onClose();
        document.body.classList.remove("modal-blur-bg");
      };
      node.addEventListener("hidden.bs.modal", handleHidden);
      return () => {
        node.removeEventListener("hidden.bs.modal", handleHidden);
        modalInstance.hide();
        document.body.classList.remove("modal-blur-bg");
      };
    }
  }, [isOpen, onClose]);

  // ...existing code...

  const isLookbackOption = selectedOption.startsWith("lookback-");
  const showDateInputs = selectedOption === "fixed-range";

  // Parameter Functions
  const addParameter = () => {
    const newParam = {
      id: Date.now().toString(),
      siteName: "",
      parameterName: "",
      templateName: "",
      description: "",
    };
    setParameters([newParam, ...parameters]); // Add at the top
  };

  const deleteParameter = (id) => {
    setParameters(parameters.filter((p) => p.id !== id));
  };

  const updateParameter = (id, field, value) => {
    setParameters(
      parameters.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const filteredParameters = parameters.filter((p) =>
    Object.values(p).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredParameters.length / itemsPerPage);
  const paginatedParameters = filteredParameters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, parameters.length]);

  // Bootstrap modal close handler
  const handleModalClose = () => {
    onClose();
  };

  return (
    <div
      className="modal fade"
      ref={modalRef}
      aria-hidden={true}
      aria-labelledby="reportSelectionModalLabel"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2 className="modal-title" id="reportSelectionModalLabel">
                Data Selection Configuration
              </h2>
              <p className="modal-subtitle">
                Configure your date range and parameter settings
              </p>
            </div>
            <button
              type="button"
              className="custom-close-btn"
              aria-label="Close"
              onClick={handleModalClose}
            >
              <FontAwesomeIcon icon={faTimes} className="custom-close-icon" />
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            <div className="content-grid">
              {/* Date Range Selection - Left Side (30%) */}
              <div className="date-section">
                <div className="date-range-container">
                  {/* Date Range Header */}
                  <div className="date-range-header">
                    <div className="header-content">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        className="header-icon"
                      />
                      <div>
                        <h3 className="header-title">Date Range Selection</h3>
                        <p className="header-subtitle">
                          Choose your time period
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="date-range-body">
                    {/* Dropdown Options */}
                    <div className="dropdown-container">
                      <label className="input-label">Select Date Range</label>
                      <Select
                        options={dateOptions}
                        value={dateOptions
                          .flatMap((group) => group.options)
                          .find((option) => option.value === selectedOption)}
                        onChange={(option) => setSelectedOption(option.value)}
                        classNamePrefix="date-range"
                        isSearchable={false}
                        styles={customStyles}
                      />
                    </div>

                    {/* Date Inputs for Fixed Range */}
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

                    {/* Lookback Interval Input */}
                    {isLookbackOption && (
                      <div className="lookback-input-container">
                        <label className="input-label">
                          Lookback Intervals
                        </label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={lookbackValue}
                            onChange={(e) => setLookbackValue(e.target.value)}
                            placeholder="Enter value"
                            className="form-control"
                            min="1"
                          />
                          <FontAwesomeIcon
                            icon={faClock}
                            className="input-icon"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Parameter Selection - Right Side (70%) */}
              <div className="parameter-section">
                <div className="parameter-grid-container">
                  {/* Parameter Grid Header */}
                  <div className="parameter-grid-header">
                    <div className="header-row">
                      <div className="header-left">
                        <FontAwesomeIcon
                          icon={faTable}
                          className="table-icon"
                        />
                        <div>
                          <h3 className="parameter-title">
                            Parameter Configuration
                          </h3>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm add-button"
                        onClick={addParameter}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="button-icon"
                        />
                        Add Row
                      </button>
                    </div>

                    {/* Search */}
                    <div className="search-wrapper">
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="search-icon"
                      />
                      <input
                        type="text"
                        placeholder="Search parameters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control search-input"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-wrapper p-3 bg-white rounded shadow-sm">
                    <table
                      className="table align-middle mb-0"
                      style={{ background: "#f9f9f9" }}
                    >
                      <thead>
                        <tr style={{ background: "#f1f3f4" }}>
                          <th
                            className="fw-bold text-center"
                            style={{ minWidth: 120 }}
                          >
                            Site Name
                          </th>
                          <th
                            className="fw-bold text-center"
                            style={{ minWidth: 150 }}
                          >
                            Parameter Name
                          </th>
                          <th
                            className="fw-bold text-center"
                            style={{ minWidth: 150 }}
                          >
                            Template Name
                          </th>
                          <th
                            className="fw-bold text-center"
                            style={{ minWidth: 200 }}
                          >
                            Description
                          </th>
                          <th
                            className="fw-bold text-center"
                            style={{ width: 60 }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedParameters.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              {searchTerm
                                ? "No parameters match your search"
                                : "No parameters added yet"}
                            </td>
                          </tr>
                        ) : (
                          paginatedParameters.map((param) => (
                            <tr key={param.id}>
                              <td className="text-center align-middle">
                                <input
                                  type="text"
                                  value={param.siteName}
                                  onChange={(e) =>
                                    updateParameter(
                                      param.id,
                                      "siteName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Site name"
                                  className="form-control"
                                />
                              </td>
                              <td className="text-center align-middle">
                                <input
                                  type="text"
                                  value={param.parameterName}
                                  onChange={(e) =>
                                    updateParameter(
                                      param.id,
                                      "parameterName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Parameter"
                                  className="form-control"
                                />
                              </td>
                              <td className="text-center align-middle">
                                <input
                                  type="text"
                                  value={param.templateName}
                                  onChange={(e) =>
                                    updateParameter(
                                      param.id,
                                      "templateName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Template"
                                  className="form-control"
                                />
                              </td>
                              <td className="text-center align-middle">
                                <input
                                  type="text"
                                  value={param.description}
                                  onChange={(e) =>
                                    updateParameter(
                                      param.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Description"
                                  className="form-control"
                                />
                              </td>
                              <td className="text-center align-middle">
                                <button
                                  onClick={() => deleteParameter(param.id)}
                                  className="btn delete-icon-btn"
                                  title="Delete"
                                  style={{
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    style={{ color: "#dc2626" }}
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav>
                        <ul className="pagination justify-content-center mt-3 mb-0">
                          <li
                            className={`page-item${
                              currentPage === 1 ? " disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              aria-label="Previous"
                            >
                              <span aria-hidden="true">&laquo;</span>
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <li
                              key={i + 1}
                              className={`page-item${
                                currentPage === i + 1 ? " active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item${
                              currentPage === totalPages ? " disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              aria-label="Next"
                            >
                              <span aria-hidden="true">&raquo;</span>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleModalClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleModalClose();
              }}
            >
              <FontAwesomeIcon icon={faCheck} className="icon-small" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
