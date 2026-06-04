import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TaskSchedulerForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faCheck,
  faTimes,
  faFileAlt,
  faCog,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { ReportSelectionModal } from "./ReportSelectionModal";
import CommonFunctions from "../../utils/CommonFunctions";
import { toast } from "react-toastify";

export function TaskSchedulerForm({
  initialData,
  onSubmit,
  onCancel,
  fetchTaskSchedulerLookup,
  lookUpData,
}) {
  const toBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      return normalized === "true" || normalized === "1" || normalized === "yes";
    }
    return false;
  };

  const [formData, setFormData] = useState({
    taskName: initialData?.jobName || "",
    description: initialData?.jobDescription || "",
    startTime: initialData?.effectiveStartDateTime || "",
    repeatInterval: initialData?.executionIntervalMinutes || "",
    intervalUnit: initialData?.intervalUnit || "",
    numberOfRetries: initialData?.retryLimit || "",
    intervalBetweenRetries: initialData?.retryDelayMinutes || "",
    intervalBetweenRetriesUnit: initialData?.intervalBetweenRetriesUnit || "",
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
      !initialData?.dailyExecutionStartTime &&
      !initialData?.dailyExecutionEndTime
        ? "unrestricted"
        : "between",
    timeFrom: initialData?.dailyExecutionStartTime || "",
    timeTo: initialData?.dailyExecutionEndTime || "",
  });
  const currentUser = JSON.parse(sessionStorage.getItem("UserData"));
  const [config, setConfig] = useState({});
  const [reportQuery, setReportQuery] = useState({});
  const [importConfig, setImportConfig] = useState({});
  const [errors, setErrors] = useState({});
  const [showAccordion, setShowAccordion] = useState(false);
  const [showAccordionHeader, setShowAccordionHeader] = useState(false);
  const [deliveryLocations, setDeliveryLocations] = useState([
    {
      directory: "",
      storageConnectionId: ""
    }
  ]);

  const [exceedanceList, setExceedanceList] = useState([]);
  // Track if we need to assign exceedanceInterval after list loads
  const [pendingExceedanceInterval, setPendingExceedanceInterval] = useState(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.reportType === "Import" && initialData.configJson) {
        const config = JSON.parse(initialData.configJson);
    
        setImportConfig({
          stationId: config.StationId ?? "",
          importType: config.ImportType ?? "",
          apiConfig: {
          apiUrl: config.Url ?? "",
          method: config.Method ?? "GET",

          Authentication: {
            Type: importConfig.Authentication?.Type ?? "none",
          
            ...(importConfig.Authentication?.TokenType === "fixed" && {
              TokenType: "fixed",
              FixedToken: importConfig.Authentication?.FixedToken ?? ""
            }),
          
            ...(importConfig.Authentication?.TokenType === "dynamic" && {
              TokenType: "dynamic",
              DynamicAuth: {
                UserId: importConfig.Authentication?.DynamicAuth?.UserId ?? "",
                Password: importConfig.Authentication?.DynamicAuth?.Password ?? "",
                AuthUrl: importConfig.Authentication?.DynamicAuth?.AuthUrl ?? "",
                TokenPath: importConfig.Authentication?.DynamicAuth?.TokenPath ?? ""
              }
            })
          },
    
          // authenticationType: config.Authentication?.Type ?? "none",
          // tokenType: config.Authentication?.TokenType ?? "",
    
          // fixedToken: config.Authentication?.FixedToken ?? "",
    
          // userId: config.Authentication?.DynamicAuth?.UserId ?? "",
          // password: config.Authentication?.DynamicAuth?.Password ?? "",
          // authUrl: config.Authentication?.DynamicAuth?.AuthUrl ?? "",
          // tokenPath: config.Authentication?.DynamicAuth?.TokenPath ?? "",
    
          queryParameters:
            config.QueryParameters?.map(x => ({
              key: x.Key,
              value: x.Value
            })) ?? [],
    
          headers:
            config.Headers?.map(x => ({
              key: x.Key,
              value: x.Value
            })) ?? [],
    
          body:
            config.Body?.map(x => ({
              key: x.Key,
              value: x.Value
            })) ?? [],
    
          apiReadTemplate:
            typeof config.ApiReadTemplate === "string"
              ? config.ApiReadTemplate
              : JSON.stringify(config.ApiReadTemplate, null, 2)
          }
        });
      }else if (initialData.reportType==="Export"){ 
        setReportQuery({
          parametersID: initialData.parametersID || "",
          timePeriodTypeID: initialData.timePeriodTypeID || "",
          averageInterval: initialData.averageInterval || "",
          showFlag: initialData.showFlag || false,
          showNullCodes: initialData.showNullCodes || false,
          showInvalidValues: initialData.showInvalidValues || false,
          lookbackValue: initialData.lookbackInterval || "",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          isForward: toBoolean(initialData.isForward ?? initialData.IsForward),
        });
      } else if (initialData.reportType === "Exceedance") {
        // Bind exceedance fields on edit
        setConfig((prev) => ({
          ...prev,
          isForward: toBoolean(initialData.isForward ?? initialData.IsForward)
        }));
        // Defer setting exceedanceInterval until list is loaded
        setPendingExceedanceInterval(
          initialData.exceedanceInterval !== undefined && initialData.exceedanceInterval !== null
            ? String(initialData.exceedanceInterval)
            : ""
        );
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) return;

    // Helper to update formData fields
    const updateForm = (fields) =>
      setFormData((prev) => ({ ...prev, ...fields }));
    // Helper to update config fields
    const updateCfg = (fields) => setConfig((prev) => ({ ...prev, ...fields }));

    // Split interval/unit fields
    if (initialData.retryDelayMinutes) {
      const [retryinterval, retryunit] = initialData.retryDelayMinutes.split("-");
      updateForm({ intervalBetweenRetries: retryinterval, intervalBetweenRetriesUnit: retryunit });
    }
    if (initialData.executionIntervalMinutes) {
      const [executioninterval, executionunit] = initialData.executionIntervalMinutes.split("-");
      updateForm({
        repeatInterval: executioninterval,
        intervalUnit: executionunit,
      });
    }

    if (initialData.retryLimit !== undefined)
      updateForm({ numberOfRetries: initialData.retryLimit });

    // Days to run
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    if (
      days.some(
        (day) =>
          initialData[
            `executeOn${day.charAt(0).toUpperCase() + day.slice(1)}`
          ] !== undefined,
      )
    ) {
      updateForm({
        daysToRun: Object.fromEntries(
          days.map((day) => [
            day,
            initialData[
              `executeOn${day.charAt(0).toUpperCase() + day.slice(1)}`
            ] ?? true,
          ]),
        ),
      });
    }

    // Time restriction
    updateForm(
      !initialData.dailyExecutionStartTime && !initialData.dailyExecutionEndTime
        ? { timeRestriction: "unrestricted" }
        : {
            timeRestriction: "between",
            timeFrom: initialData.dailyExecutionStartTime || "",
            timeTo: initialData.dailyExecutionEndTime || "",
          },
    );


    // =============================
// IMPORT CONFIG ASSIGNMENT
// =============================
if (
  initialData.reportType === "Import" &&
  initialData.configJson
) {
  let importConfig = null;

  try {
    importConfig = JSON.parse(initialData.configJson);
  } catch (err) {
    console.error("Invalid ConfigJson", err);
  }

  if (importConfig) {
    updateCfg({
      stationId: importConfig.StationId ?? "",
      importType: importConfig.ImportType ?? "",
      apiUrl: importConfig?.ApiConfig?.Url ?? "",
      method: importConfig?.ApiConfig?.Method ?? "GET",

        // Authentication
      Authentication: importConfig?.ApiConfig?.Authentication
  ? {
      Type: importConfig?.ApiConfig?.Authentication?.Type ?? "none",

      ...(importConfig?.ApiConfig?.Authentication?.TokenType === "fixed" && {
        TokenType: "fixed",
        FixedToken: importConfig?.ApiConfig?.Authentication?.FixedToken ?? ""
      }),

      ...(importConfig?.ApiConfig?.Authentication?.TokenType === "dynamic" && {
        TokenType: "dynamic",
        DynamicAuth: {
          UserId:
            importConfig?.ApiConfig?.Authentication?.DynamicAuth?.UserId ?? "",
          Password:
            importConfig?.ApiConfig?.Authentication?.DynamicAuth?.Password ?? "",
          AuthUrl:
            importConfig?.ApiConfig?.Authentication?.DynamicAuth?.AuthUrl ?? "",
          TokenPath:
            importConfig?.ApiConfig?.Authentication?.DynamicAuth?.TokenPath ?? ""
        }
      })
    }
  : { Type: "none" },

        QueryParameters:
        importConfig?.ApiConfig?.QueryParameters?.length > 0
          ? importConfig?.ApiConfig?.QueryParameters.map((x) => ({
              key: x.Key,
              value: x.Value,
            }))
          : [{ key: "", value: "" }],
      
      // Headers
      Headers:
        importConfig?.ApiConfig?.Headers?.length > 0
          ? importConfig?.ApiConfig?.Headers.map((x) => ({
              key: x.Key,
              value: x.Value,
            }))
          : [{ key: "", value: "" }],
      
      // Body
      Body:
        importConfig?.ApiConfig?.Body?.length > 0
          ? importConfig?.ApiConfig?.Body.map((x) => ({
              key: x.Key,
              value: x.Value,
            }))
          : [{ key: "", value: "" }],

      // Template
      ApiReadTemplate:
        typeof importConfig?.ApiConfig?.ApiReadTemplate === "string"
          ? importConfig?.ApiConfig?.ApiReadTemplate
          : JSON.stringify(importConfig?.ApiConfig?.ApiReadTemplate, null, 2),
    });
  }
}

    // Config assignments
    if (initialData.downloadedFileName)
      updateCfg({ baseFilename: initialData.downloadedFileName });
    if (initialData.localFileDownloadPath)
      updateCfg({ destinationFolder: initialData.localFileDownloadPath });
    if (initialData.localFileDownload !== undefined)
      updateCfg({ enableLocalSave: !!initialData.localFileDownload });
    if (initialData.ftpFileDownload !== undefined)
      updateCfg({ enableRemoteUpload: !!initialData.ftpFileDownload });
    if (initialData.ftpConfigID)
      updateCfg({ uploadProtocol: initialData.ftpConfigID });

    if (initialData.fileDownloadFormat !== undefined) {
      const extMap = { xls: "XLS", csv: "CSV", pdf: "PDF" };
      updateCfg({
        exportFormat: initialData.fileDownloadFormat,
        fileExtension:
          extMap[(initialData.fileDownloadFormat || "").toLowerCase()] || "",
      });
    }
    if (initialData.isDateFormatAppend !== undefined)
      updateCfg({ includeTimestamp: initialData.isDateFormatAppend });

    // Report query (ensure config.reportQuery is set with correct keys for validation)
    if (
      initialData.timePeriodTypeID !== undefined ||
      initialData.parametersID !== undefined ||
      initialData.averageInterval !== undefined ||
      initialData.isForward !== undefined ||
      initialData.IsForward !== undefined
    ) {
      const reportQueryObj = {
        TimePeriodTypeID: initialData.timePeriodTypeID || "",
        ParametersID: initialData.parametersID || "",
        AverageInterval: initialData.averageInterval || "",
        LookbackInterval: initialData.lookbackInterval || "",
        ShowFlag: initialData.showFlag || false,
        ShowNullCodes: initialData.showNullCodes || false,
        ShowInvalidValues: initialData.showInvalidValues || false,
        StartDate: initialData.startDate || "",
        EndDate: initialData.endDate || "",
        IsForward: toBoolean(initialData.isForward ?? initialData.IsForward),
      };
      updateCfg({ reportQuery: reportQueryObj });
      setReportQuery({
        parametersID: reportQueryObj.ParametersID,
        timePeriodTypeID: reportQueryObj.TimePeriodTypeID,
        averageInterval: reportQueryObj.AverageInterval,
        showFlag: reportQueryObj.ShowFlag,
        showNullCodes: reportQueryObj.ShowNullCodes,
        showInvalidValues: reportQueryObj.ShowInvalidValues,
        lookbackValue: reportQueryObj.LookbackInterval,
        startDate: reportQueryObj.StartDate,
        endDate: reportQueryObj.EndDate,
        isForward: reportQueryObj.IsForward,
        IsForward: reportQueryObj.IsForward,
      });
    }
    if (initialData.reportTypeId !== undefined) {
      updateCfg({ reportType: initialData.reportTypeId });
    }
    
  }, [initialData]);

  const getExceedanceData = async (value) => {
    let isExceedance = (lookUpData.listReportTypes?.find(
      (x) => x.id === Number(value)
    )?.reportTypeName)?.toLowerCase() === "exceedance";
    if (!isExceedance) return;
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/GetParameterExceedanceValues", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setExceedanceList(data);
        }
      })
      .catch(() => {
        toast.error(
          "Unable to get the exceedance list. Please contact adminstrator"
        );
      });
  };

  // When exceedanceList changes and we have a pending interval, set it
  useEffect(() => {
    if (
      pendingExceedanceInterval !== null &&
      Array.isArray(exceedanceList) &&
      exceedanceList.length > 0 &&
      exceedanceList.some((x) => String(x.interval) === pendingExceedanceInterval)
    ) {
      setConfig((prev) => ({
        ...prev,
        exceedanceInterval: pendingExceedanceInterval
      }));
      setPendingExceedanceInterval(null);
    }
  }, [exceedanceList, pendingExceedanceInterval]);

  useEffect(() => {
    if (!initialData || !config.reportType) return;
    getExceedanceData(config.reportType);
  }, [initialData, config.reportType]);

const getIntervalLabel = (typeId) => {
  switch (typeId) {
    case 1:
      return "1 Minute";

    case 60:
      return "1 Hour";

    case 43200:
      return "1 Month";

    case 129600:
      return "1 Quarter";

    case 525600:
      return "1 Year";

    default:
      // Dynamic handling
      if (typeId < 60) {
        return `${typeId} Minute${typeId > 1 ? "s" : ""}`;
      }

      if (typeId < 43200) {
        const hours = typeId / 60;
        return `${hours} Hour${hours > 1 ? "s" : ""}`;
      }

      if (typeId === 129600) {
        return "1 Quarter";
      }

      return `${typeId}`;
  }
};
  // const updateConfig = (field, value) => {
  //   if (field === "exportFormat") {
  //     let ext = "";
  //     switch (value) {
  //       case "xls":
  //         ext = "XLS";
  //         break;
  //       case "csv":
  //         ext = "CSV";
  //         break;
  //       case "pdf":
  //         ext = "PDF";
  //         break;
  //       default:
  //         ext = "";
  //     }
  //     setConfig((prev) => ({
  //       ...prev,
  //       exportFormat: value,
  //       fileExtension: ext,
  //     }));
  //     if (errors.exportFormat) setErrors((prev) => ({ ...prev, exportFormat: "" }));
  //   } else {
  //     setConfig((prev) => ({ ...prev, [field]: value }));
  //     if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  //   }
  // };

  const updateConfig = (field, value, options = {}) => {
    const { nested = false, parent = null } = options;
  
    setConfig((prev) => {
      let updatedConfig = { ...prev };
  
      // Handle special logic
      if (field === "exportFormat") {
        let ext = "";
        switch (value) {
          case "xls":
            ext = "XLS";
            break;
          case "csv":
            ext = "CSV";
            break;
          case "pdf":
            ext = "PDF";
            break;
          default:
            ext = "";
        }
  
        updatedConfig.exportFormat = value;
        updatedConfig.fileExtension = ext;
      }
      // Handle nested update
      else if (nested && parent) {
        updatedConfig[parent] = {
          ...prev[parent],
          [field]: value,
        };
      }
      // Normal field update
      else {
        updatedConfig[field] = value;
      }
  
      return updatedConfig;
    });
  
    // Clear error automatically
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleReportTypeChange = (value) => {
    setShowAccordion(false);
    setShowAccordionHeader(false);
    setReportQuery({});
    setExceedanceList([]);
    setPendingExceedanceInterval(null);
    setDeliveryLocations([
      {
        directory: "",
        storageConnectionId: ""
      }
    ]);

    setConfig((prev) => ({
      ...prev,
      reportType: value,
      reportQuery: { IsForward: false },

      // Export-specific fields
      exportFormat: "",
      fileExtension: "",
      baseFilename: "",
      includeTimestamp: false,
      enableLocalSave: false,
      enableRemoteUpload: false,
      uploadProtocol: "",

      // Import-specific fields
      stationId: "",
      importType: "",
      apiUrl: "",
      method: "GET",
      Authentication: { Type: "none" },
      QueryParameters: [{ key: "", value: "" }],
      Headers: [{ key: "", value: "" }],
      Body: [{ key: "", value: "" }],
      ApiReadTemplate: "",

      // Exceedance-specific fields
      exceedanceInterval: "",
      isForward: false,
    }));

    setErrors({});
    getExceedanceData(value);
  };

  const handleChange = (field, value) => {
    if (field === "timeRestriction" && value === "unrestricted") {
      setFormData((prev) => ({ ...prev, timeRestriction: value, timeFrom: "", timeTo: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBrowseFolder = async () => {
    const input = document.getElementById("folderInput");
    if (input) input.click();
  };

  const handleFolderInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const path = files[0].webkitRelativePath || files[0].name;
      const folderName = path.split("/")[0];
      updateConfig("destinationFolder", folderName);
    }
  };

  const handleDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysToRun: { ...prev.daysToRun, [day]: !prev.daysToRun[day] },
    }));
    if (errors.daysToRun) setErrors((prev) => ({ ...prev, daysToRun: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taskName.trim()) newErrors.taskName = "Task name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.startTime.trim())
      newErrors.startTime = "Start time is required";
    if (!formData.repeatInterval.trim()) {
      newErrors.repeatInterval = "Repeat interval is required";
    } else {
      const interval = parseInt(formData.repeatInterval, 10);
      if (isNaN(interval) || interval < 1)
        newErrors.repeatInterval = "Must be a positive number";
    }

    if (
      formData.numberOfRetries === "" ||
      formData.numberOfRetries === undefined
    ) {
      newErrors.numberOfRetries = "Number of retries is required";
    } else {
      const retries = parseInt(formData.numberOfRetries, 10);
      if (isNaN(retries) || retries < 0)
        newErrors.numberOfRetries = "Must be 0 or greater";
    }

    if (
      formData.intervalBetweenRetries === "" ||
      formData.intervalBetweenRetries === undefined
    ) {
      newErrors.intervalBetweenRetries = "Interval between retries is required";
    } else {
      const interval = parseInt(formData.intervalBetweenRetries, 10);
      if (isNaN(interval) || interval < 1)
        newErrors.intervalBetweenRetries = "Must be a positive number";
    }

    const hasSelectedDay = Object.values(formData.daysToRun).some(Boolean);
    if (!hasSelectedDay)
      newErrors.daysToRun = "At least one day must be selected";

    if (formData.timeRestriction === "between") {
      if (!formData.timeFrom) {
        newErrors.timeFrom = "Start time is required";
      }
      if (!formData.timeTo) {
        newErrors.timeTo = "End time is required";
      }
    }
    // Report Type validation
    if (!config.reportType || config.reportType === "") {
      newErrors.reportType = "Report type is required";
    }
    // ==============================
// IMPORT VALIDATION
// ==============================
let ReportTypeName =  lookUpData.listReportTypes?.find(
  (x) => x.id === Number(config?.reportType)
)?.reportTypeName;

if (ReportTypeName === "Import") {
  // StationId
  if (!config.stationId) {
    newErrors.stationId = "Station is required";
  }

  // Import Type
  if (!config.importType || config.importType.trim() === "") {
    newErrors.importType = "Import type is required";
  }

  // API URL
  if (!config.apiUrl || config.apiUrl.trim() === "") {
    newErrors.apiUrl = "API URL is required";
  }

  // Method
  if (!config.method || config.method.trim() === "") {
    newErrors.method = "HTTP Method is required";
  }

  // Authentication Type
  
  if (
    config.Authentication?.Type === "bearerToken" &&
    config.Authentication?.TokenType === "fixed"
  ) {
    if (!config.Authentication?.FixedToken?.trim()) {
      newErrors.fixedToken = "Fixed token is required";
    }
  }
  
  if (
    config.Authentication?.Type === "bearerToken" &&
    config.Authentication?.TokenType === "dynamic"
  ) {
    const dynamic = config.Authentication?.DynamicAuth;
  
    if (!dynamic?.UserId?.trim()) {
      newErrors.userId = "User ID is required";
    }
  
    if (!dynamic?.Password?.trim()) {
      newErrors.password = "Password is required";
    }
  
    if (!dynamic?.AuthUrl?.trim()) {
      newErrors.authUrl = "Auth URL is required";
    }
  
    if (!dynamic?.TokenPath?.trim()) {
      newErrors.tokenPath = "Token path is required";
    }
  }

 // Query Parameters validation (optional but at least one if GET)
 if (config.method === "GET") {
  if (!config.QueryParameters || config.QueryParameters.length === 0) {
    newErrors.queryParameters =
      "At least one query parameter is required for GET";
  } else {
    config.QueryParameters.forEach((param, index) => {
      if (!param.key || param.key.trim() === "") {
        newErrors[`queryKey_${index}`] = "Key is required";
      }
      if (!param.value || param.value.trim() === "") {
        newErrors[`queryValue_${index}`] = "Value is required";
      }
    });
  }
}
  // Headers validation (optional but validate if present)
  if (config.Headers && config.Headers.length > 0) {
    config.Headers.forEach((header, index) => {
      if (!header.key || header.key.trim() === "") {
        newErrors[`headerKey_${index}`] = "Header key is required";
      }
      if (!header.value || header.value.trim() === "") {
        newErrors[`headerValue_${index}`] = "Header value is required";
      }
    });
  }

  // Body validation (only for POST/PUT)
  if (config.method === "POST" || config.method === "PUT") {
    if (config.Body && config.Body.length > 0) {
      config.Body.forEach((item, index) => {
        if (!item.key || item.key.trim() === "") {
          newErrors[`bodyKey_${index}`] = "Body key is required";
        }
        if (!item.value || item.value.trim() === "") {
          newErrors[`bodyValue_${index}`] = "Body value is required";
        }
      });
    }
  }

  // ApiReadTemplate required
  if (!config.ApiReadTemplate) {
    newErrors.apiReadTemplate = "API Read Template is required";
  }
}else if(ReportTypeName === "Export"){
// Export Format validation
if (!config.exportFormat || config.exportFormat === "") {
  newErrors.exportFormat = "Export format is required";
}
// Base Filename validation
if (!config.baseFilename || config.baseFilename.trim() === "") {
  newErrors.baseFilename = "Base filename is required";
}

if (config.enableLocalSave && deliveryLocations.length > 0) {
  deliveryLocations.forEach((item, index) => {
    if (!item.directory || item.directory.trim() === "") {
      newErrors[`directory_${index}`] =
        "Directory is required";
    }

    if (!item.storageConnectionId || item.storageConnectionId === "") {
      newErrors[`storageConnectionId_${index}`] =
        "Storage connection is required";
    }
  });
}

// Report Query Modal validation (require at least one key field)
const rq = config.reportQuery || {};
if (!rq.TimePeriodTypeID || !rq.ParametersID || !rq.AverageInterval ) {
  newErrors.reportQueryModal = "Please enter data in Configure Report Query.";
}

}else if(ReportTypeName === "Exceedance"){
  if (!config.exceedanceInterval || config.exceedanceInterval === "") {
    newErrors.exceedanceInterval = "Exceedance interval is required";
  }
}
    
    // Local Save validation
    // if (config.enableLocalSave) {
    //   if (!config.destinationFolder || config.destinationFolder.trim() === "") {
    //     newErrors.destinationFolder =
    //       "Destination folder is required when local save is enabled";
    //   }
    // }
  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to ensure datetime is in yyyy-MM-ddTHH:mm:ss
  const formatDateTime = (dt) => {
    if (!dt) return null;
    // If already has seconds, return as is
    if (dt.length === 19) return dt;
    // If missing seconds, add :00
    if (dt.length === 16) return dt + ":00";
    return dt;
  };

  useEffect(() => {
    if (initialData) {
      setDeliveryLocations(
        initialData.jobDeliveries?.length > 0
          ? initialData.jobDeliveries.map(d => ({
              directory: d.directory || "",
              storageConnectionId: d.storageConnectionId || ""
            }))
          : [
              {
                directory: "",
                storageConnectionId: ""
              }
            ]
      );
    }
  }, [initialData]);

  // useEffect(() => {
  //   if (!config.QueryParameters || config.QueryParameters.length === 0) {
  //     updateConfig("QueryParameters", [{ key: "", value: "" }]);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!config.Body || config.Body.length === 0) {
  //     updateConfig("Body", [{ key: "", value: "" }]);
  //   }
  // }, []);

  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      QueryParameters: prev.QueryParameters?.length
        ? prev.QueryParameters
        : [{ key: "", value: "" }],
      Headers: prev.Headers?.length
        ? prev.Headers
        : [{ key: "", value: "" }],
      Body: prev.Body?.length
        ? prev.Body
        : [{ key: "", value: "" }]
    }));
  }, []);

  // Convert Query Parameters array to object
const queryParamsObject = {};
(config.QueryParameters || []).forEach((p) => {
  if (p.key) {
    queryParamsObject[p.key] = p.value;
  }
});

// Convert Headers array to object (if array)
let headersObject = {};
if (Array.isArray(config.Headers)) {
  config.Headers.forEach((h) => {
    if (h.key) {
      headersObject[h.key] = h.value;
    }
  });
} else if (config.Headers?.key) {
  headersObject[config.Headers.key] = config.Headers.value;
}

// Convert Body array to object
const bodyObject = {};
(config.Body || []).forEach((p) => {
  if (p.key) {
    bodyObject[p.key] = p.value;
  }
});

let authPayload = {
  AuthenticationType: "none",
  FixedToken: null,
  UserId: null,
  Password: null,
  AuthUrl: null,
  TokenPath: null
};

if (config.Authentication?.Type === "bearerToken") {
  authPayload.AuthenticationType = "bearerToken";

  if (config.Authentication?.TokenType === "fixed") {
    authPayload.FixedToken = config.Authentication.FixedToken;
  }

  if (config.Authentication?.TokenType === "dynamic") {
    authPayload.UserId = config.Authentication.DynamicAuth?.UserId;
    authPayload.Password = config.Authentication.DynamicAuth?.Password;
    authPayload.AuthUrl = config.Authentication.DynamicAuth?.AuthUrl;
    authPayload.TokenPath = config.Authentication.DynamicAuth?.TokenPath;
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const apiConfig = {
      StationId: Number(config.stationId) ?? null,
      ImportType: config.importType ?? null,
       ApiConfig: {
      Url: config.apiUrl ?? "",
      Method: config.method ?? "GET",
    
      Authentication: {
        Type: config.Authentication?.Type ?? "none",
        ...(config.Authentication?.TokenType === "fixed" && {
          TokenType: config.Authentication?.TokenType ?? "",
          FixedToken: config.Authentication.FixedToken ?? ""
        }),
        ...(config.Authentication?.TokenType === "dynamic" && {
          TokenType: config.Authentication?.TokenType ?? "",
          DynamicAuth: {
            UserId: config.Authentication?.DynamicAuth?.UserId ?? "",
            Password: config.Authentication?.DynamicAuth?.Password ?? "",
            AuthUrl: config.Authentication?.DynamicAuth?.AuthUrl ?? "",
            TokenPath: config.Authentication?.DynamicAuth?.TokenPath ?? ""
          }
        })
      },
    
      QueryParameters: (() => {
        const filtered = (config.QueryParameters ?? [])
          .filter(x => x.key?.trim())
          .map(x => ({ Key: x.key, Value: x.value ?? "" }));
      
        return filtered.length > 0 ? filtered : null;
      })(),
    
      Headers: (() => {
        const filtered = (config.Headers ?? [])
          .filter(x => x.key?.trim())
          .map(x => ({ Key: x.key, Value: x.value ?? "" }));
      
        return filtered.length > 0 ? filtered : null;
      })(),
    
        Body: (() => {
          const filtered = (config.Body ?? [])
            .filter(x => x.key?.trim())
            .map(x => ({ Key: x.key, Value: x.value ?? "" }));
        
          return filtered.length > 0 ? filtered : null;
        })(),
    
        ApiReadTemplate: config.ApiReadTemplate
        ? JSON.parse(config.ApiReadTemplate)
        : null
    }
  };

 const payload = {
      JobName: formData.taskName,
      JobDescription: formData.description,
      IsActive: formData.enabled,
      RetryLimit: parseInt(formData.numberOfRetries, 10) || 0,
      RetryDelayMinutes:
        formData.intervalBetweenRetries && formData.intervalBetweenRetriesUnit
          ? `${formData.intervalBetweenRetries}-${formData.intervalBetweenRetriesUnit}`
          : "",
      EffectiveStartDateTime: formatDateTime(formData.startTime),
      ExecutionIntervalMinutes:
        formData.repeatInterval && formData.intervalUnit
          ? `${formData.repeatInterval}-${formData.intervalUnit}`
          : "",
      ExecuteOnSunday: formData.daysToRun.sunday,
      ExecuteOnMonday: formData.daysToRun.monday,
      ExecuteOnTuesday: formData.daysToRun.tuesday,
      ExecuteOnWednesday: formData.daysToRun.wednesday,
      ExecuteOnThursday: formData.daysToRun.thursday,
      ExecuteOnFriday: formData.daysToRun.friday,
      ExecuteOnSaturday: formData.daysToRun.saturday,
      DailyExecutionStartTime: formData.timeFrom ?? null,
      DailyExecutionEndTime: formData.timeTo ?? null,
      ...(config.reportQuery || {}),
      TimePeriodTypeID: config.reportQuery?.TimePeriodTypeID ?? null,
      LookbackInterval: config.reportQuery?.LookbackInterval ?? null,
      ParametersID: config.reportQuery?.ParametersID ?? null,
      AverageInterval: config.reportQuery?.AverageInterval ?? null,
      ShowFlag: config.reportQuery?.ShowFlag ?? null,
      ShowNullCodes: config.reportQuery?.ShowNullCodes ?? null,
      ShowInvalidValues: config.reportQuery?.ShowInvalidValues ?? null,
      // LocalFileDownload: config.enableLocalSave ?? false,
      // LocalFileDownloadPath: config.enableLocalSave ? config.destinationFolder : null,
      DownloadedFileName: config.baseFilename ?? null,
      IsDateFormatAppend: config.includeTimestamp ?? false,
      DateFormatAppend: config.includeTimestamp ? "yyyyMMddHHmm" : null,
      FileDownloadFormat: config.exportFormat ?? "",
      FtpFileDownload: config.enableRemoteUpload ?? false,
      FtpConfigID: config.enableRemoteUpload ? config.uploadProtocol ?? null : null,
      ReportTypeID: Number(config.reportType) ?? null,
      CreatedBy: currentUser.id,
      exceedanceInterval: config.exceedanceInterval ?? null,
      IsForward:
        ((lookUpData.listReportTypes?.find(
          (x) => x.id === Number(config?.reportType)
        )?.reportTypeName)?.toLowerCase() === "export"
          ? toBoolean(config.reportQuery?.IsForward)
          : toBoolean(config.isForward)) ?? false,
        // NEW API FIELDS
  // StationId: Number(config.stationId) ?? null,
  // ImportType: config.importType ?? null,
  // ApiUrl: config.apiUrl ?? "",
  // Method: config.method ?? "GET",

  // QueryParameters: convertToDictionary(config.QueryParameters ?? []),
  // Headers: convertToDictionary(config.Headers ?? []),
  // Body: convertToDictionary(config.Body ?? []),
  // ApiReadTemplate: config.ApiReadTemplate ?? "",

  // // Authentication Fields
  // ...authPayload,
  // ✅ Store full API configuration as JSON string
  ConfigJson: JSON.stringify(apiConfig),

      ReportType: lookUpData.listReportTypes?.find(
        (x) => x.id === Number(config?.reportType)
      )?.reportTypeName || null ,
      JobDeliveries: deliveryLocations ?? null
    };

    // Determine if this is an update or create
    const isEdit = initialData && initialData.jobID;
    let url = CommonFunctions.getWebApiUrl() + "api/ScheduleTask";
    let method = "POST";
    if (isEdit) {
      // For update, add jobID or id to payload and use PUT
      if (initialData.jobID) payload.JobID = initialData.jobID;
      else if (initialData.id) payload.JobID = initialData.id;
      url =
        CommonFunctions.getWebApiUrl() +
        "api/ScheduleTask/" +
        `${initialData.jobID}`;
      method = "PUT";
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
        toast.success(
          isEdit ? "Job updated successfully" : "Job added successfully",
        );
        fetchTaskSchedulerLookup();
        if (onSubmit) onSubmit();
      } else if (responseJson == "JobExists" || responseJson == 2) {
        toast.error(
          "Job already exists with the given name. Please try with another name.",
        );
        return false;
      } else {
        toast.error(
          isEdit
            ? "Unable to update the Job. Please contact administrator"
            : "Unable to add the Job. Please contact administrator",
        );
        return false;
      }
    } catch (error) {
      toast.error(
        isEdit
          ? "Unable to update the task. Please contact administrator"
          : "Unable to schedule the task. Please contact administrator",
      );
    }
  };

  const dayKeys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const addDeliveryLocation = () => {
    setDeliveryLocations((prev) => [
      ...prev,
      {
        directory: "",
        storageConnectionId: ""
      }
    ]);
  };
  const removeDeliveryLocation = (index) => {
    setDeliveryLocations((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };
  const updateDeliveryLocation = (index, field, value) => {
    setDeliveryLocations((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const isImportReport =
  (lookUpData.listReportTypes?.find(
    (x) => x.id === Number(config?.reportType)
  )?.reportTypeName)?.toLowerCase() === "import";

 const isExportReport =
  (lookUpData.listReportTypes?.find(
    (x) => x.id === Number(config?.reportType)
  )?.reportTypeName)?.toLowerCase() === "export";

  useEffect(() => {
    if (!isExportReport) return;
    setDeliveryLocations((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) {
        return [{ directory: "", storageConnectionId: "" }];
      }
      return [prev[0]];
    });
  }, [isExportReport]);

   const isExceedanceReport =
  (lookUpData.listReportTypes?.find(
    (x) => x.id === Number(config?.reportType)
  )?.reportTypeName)?.toLowerCase() === "exceedance";

  const getAuthSelectValue = () => {
    if (!config.Authentication) return "";
  
    if (config.Authentication.Type === "none") return "none";
    if (config.Authentication.Type === "") return "";
  
    if (
      config.Authentication.Type === "bearerToken" &&
      config.Authentication?.TokenType === "fixed"
    )
      return "bearer-fixed";
  
    if (
      config.Authentication.Type === "bearerToken" &&
      config.Authentication?.TokenType === "dynamic"
    )
      return "bearer-dynamic";
  
    return "";
  };
  const addQueryParam = () => {
    const existing = config.QueryParameters ?? [];
    updateConfig("QueryParameters", [
      ...existing,
      { key: "", value: "" }
    ]);
  };
  
  const removeQueryParam = (index) => {
    const updated = config.QueryParameters.filter((_, i) => i !== index);
  
    // Always keep at least one row
    if (updated.length === 0) {
      updateConfig("QueryParameters", [{ key: "", value: "" }]);
    } else {
      updateConfig("QueryParameters", updated);
    }
  };
  
  const updateQueryParam = (index, field, value) => {
    const updated = [...config.QueryParameters];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
  
    updateConfig("QueryParameters", updated);
  };

  const addBodyParam = () => {
    const updated = [
      ...(config.Body || []),
      { key: "", value: "" }
    ];
  
    updateConfig("Body", updated);
  };
  
  const removeBodyParam = (index) => {
    const updated = config.Body.filter((_, i) => i !== index);
  
    if (updated.length === 0) {
      updateConfig("Body", [{ key: "", value: "" }]);
    } else {
      updateConfig("Body", updated);
    }
  };
  
  const updateBodyParam = (index, field, value) => {
    const updated = [...config.Body];
  
    updated[index] = {
      ...updated[index],
      [field]: value
    };
  
    updateConfig("Body", updated);
  };
  const addHeader = () => {
    const existing = config.Headers ?? [];
    updateConfig("Headers", [
      ...existing,
      { key: "", value: "" }
    ]);
  };
  
  const removeHeader = (index) => {
    const updated = config.Headers.filter((_, i) => i !== index);
  
    // Keep at least one row
    if (updated.length === 0) {
      updateConfig("Headers", [{ key: "", value: "" }]);
    } else {
      updateConfig("Headers", updated);
    }
  };
  
  const updateHeader = (index, field, value) => {
    const updated = [...config.Headers];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
  
    updateConfig("Headers", updated);
  };
  return (
    <>
      <div className="tsf-container">
        <div className="tsf-card">
          <div className="tsf-header">
            <div className="tsf-header-left">
              <div className="tsf-header-icon">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="tsf-header-faicon"
                />
              </div>
              <div>
                <h3 className="tsf-title">{!initialData?.jobID && !initialData?.id ? 'Create New Schedule' : 'Update Schedule'}</h3>
                <p className="tsf-subtitle">
                  Configure job scheduling parameters
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="tsf-form">
            {/* Task Information Section */}
            <section className="tsf-section">
              <div className="tsf-section-header">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="tsf-section-faicon"
                />
                <h4 className="tsf-section-title">Job Information</h4>
              </div>
              <div className="tsf-row">
                <label className="form-label">Job Name:</label>
                <div className="tsf-input-group">
                  <input
                    type="text"
                    value={formData.taskName}
                    onChange={(e) => handleChange("taskName", e.target.value)}
                    className={`tsf-input${errors.taskName ? " tsf-input-error" : ""}`}
                    placeholder="Enter job name"
                    aria-invalid={!!errors.taskName}
                    aria-describedby={
                      errors.taskName ? "taskName-error" : undefined
                    }
                  />
                  {errors.taskName && (
                    <p id="taskName-error" className="tsf-error-text">
                      {" "}
                      {errors.taskName}
                    </p>
                  )}
                </div>
              </div>
              <div className="tsf-row">
                <label className="form-label">Job Description:</label>
                <div className="tsf-input-group">
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={3}
                    className={`tsf-textarea${errors.description ? " tsf-input-error" : ""}`}
                    placeholder="Enter job description"
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description ? "description-error" : undefined
                    }
                  />
                  {errors.description && (
                    <p id="description-error" className="tsf-error-text">
                      {" "}
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="time-enable-row">
                <div className="tsf-row">
                  <label className="form-label">Start Time:</label>
                  <div className="tsf-input-group tsf-relative">
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <DatePicker
                          selected={
                            formData.startTime
                              ? new Date(formData.startTime)
                              : null
                          }
                          onChange={(date) => {
                            if (date) {
                              const pad = (n) => n.toString().padStart(2, "0");
                              const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
                              const timePart = formData.startTime
                                ? formData.startTime.split("T")[1]
                                : "00:00:00";
                              handleChange(
                                "startTime",
                                `${datePart}T${timePart}`,
                              );
                            } else {
                              handleChange("startTime", "");
                            }
                          }}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select date"
                          className={`tsf-input${errors.startTime ? " tsf-input-error" : ""}`}
                          popperClassName="tsf-calendar-popup"
                          showTimeSelect={false}
                        />
                        {formData.startTime &&
                        formData.startTime.split("T")[0] ? (
                          <input
                            type="time"
                            step="1"
                            value={
                              formData.startTime
                                ? formData.startTime.split("T")[1]
                                : ""
                            }
                            onChange={(e) => {
                              const datePart = formData.startTime
                                ? formData.startTime.split("T")[0]
                                : "";
                              handleChange(
                                "startTime",
                                `${datePart}T${e.target.value}`,
                              );
                            }}
                            className={`tsf-input tsf-time-input${errors.startTime ? " tsf-input-error" : ""}`}
                            style={{ width: "120px" }}
                            aria-invalid={!!errors.startTime}
                            aria-describedby={
                              errors.startTime ? "startTime-error" : undefined
                            }
                          />
                        ) : null}
                      </div>
                    </div>
                    {errors.startTime && (
                      <p id="startTime-error" className="tsf-error-text">
                        {" "}
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                </div>
                <div className="job-switch">
                  <label className="form-label">Job Enabled:</label>
                  <div className="form-check form-switch ms-2 d-inline-block">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="enabledSwitch"
                      checked={formData.enabled}
                      onChange={(e) =>
                        handleChange("enabled", e.target.checked)
                      }
                    />
                    <label className="form-check-label" htmlFor="enabledSwitch">
                      {formData.enabled ? "True" : "False"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="tsf-row">
                <label className="form-label">Repeat Interval:</label>
                <div>
                  <div className="tsf-input-repeat tsf-flex flex">
                    <input
                      type="number"
                      value={formData.repeatInterval}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        handleChange("repeatInterval", val);
                      }}
                      min="1"
                      className=" tsf-input-repeat-number"
                      // className={`tsf-input${errors.repeatInterval ? ' tsf-input-error' : ''}`}
                      placeholder="6"
                      aria-invalid={!!errors.repeatInterval}
                      aria-describedby={
                        errors.repeatInterval
                          ? "repeatInterval-error"
                          : undefined
                      }
                    />
                    <select
                      value={formData.intervalUnit}
                      onChange={(e) =>
                        handleChange("intervalUnit", e.target.value)
                      }
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
                    <p id="repeatInterval-error" className="tsf-error-text">
                      {" "}
                      {errors.repeatInterval}
                    </p>
                  )}
                </div>
              </div>

              {/* Number of Retries and Interval Between Retries in one row */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div className="tsf-row">
                  <label className="form-label">Number of Retries:</label>
                  <div>
                    <input
                      type="number"
                      min="0"
                      value={formData.numberOfRetries}
                      onChange={(e) =>
                        handleChange(
                          "numberOfRetries",
                          e.target.value.replace(/[^0-9]/g, ""),
                        )
                      }
                      className={`tsf-input-repeat-number${errors.numberOfRetries ? " tsf-input-error" : ""}`}
                      placeholder="0"
                      aria-invalid={!!errors.numberOfRetries}
                      aria-describedby={
                        errors.numberOfRetries
                          ? "numberOfRetries-error"
                          : undefined
                      }
                    />
                    {errors.numberOfRetries && (
                      <p id="numberOfRetries-error" className="tsf-error-text">
                        {errors.numberOfRetries}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interval Between Retries */}
                <label className="form-label">Interval Between Retries:</label>
                <div style={{ flex: 1 }}>
                  <div className="tsf-row">
                    <div>
                      <div className="tsf-relative tsf-flex-1">
                        <input
                          type="number"
                          min="1"
                          value={formData.intervalBetweenRetries}
                          onChange={(e) =>
                            handleChange(
                              "intervalBetweenRetries",
                              e.target.value.replace(/[^0-9]/g, ""),
                            )
                          }
                          className={`tsf-input-repeat-number${errors.intervalBetweenRetries ? " tsf-input-error" : ""}`}
                          placeholder="1"
                          aria-invalid={!!errors.intervalBetweenRetries}
                          aria-describedby={
                            errors.intervalBetweenRetries
                              ? "intervalBetweenRetries-error"
                              : undefined
                          }
                        />
                      </div>
                      {errors.intervalBetweenRetries && (
                        <p
                          id="intervalBetweenRetries-error"
                          className="tsf-error-text"
                        >
                          {errors.intervalBetweenRetries}
                        </p>
                      )}
                    </div>
                    <select
                      value={formData.intervalBetweenRetriesUnit}
                      onChange={(e) =>
                        handleChange(
                          "intervalBetweenRetriesUnit",
                          e.target.value,
                        )
                      }
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
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="tsf-section-faicon"
                />
                <h4 className="tsf-section-title">Days to Run</h4>
              </div>
              <div className="tsf-days-row">
                {dayKeys.map((day, idx) => {
                  const selected = formData.daysToRun[day];
                  return (
                    <label
                      key={day}
                      className={`tsf-day-label${selected ? " tsf-day-selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleDayChange(day)}
                        className="tsf-day-checkbox"
                        aria-label={dayLabels[idx]}
                      />
                      <span className="tsf-day-label-text">
                        {dayLabels[idx]}
                      </span>
                      <span
                        className={`tsf-day-check${selected ? " tsf-day-check-selected" : ""}`}
                      >
                        <FontAwesomeIcon
                          icon={selected ? faCheck : faTimes}
                          size="lg"
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.daysToRun && (
                <p className="tsf-error-text tsf-error-days">
                  {" "}
                  {errors.daysToRun}
                </p>
              )}
            </section>
            {/* Time of Day Restriction Section */}
            <section className="tsf-section">
              <div className="tsf-section-header">
                <FontAwesomeIcon
                  icon={faClock}
                  className="tsf-section-faicon"
                />
                <h4 className="tsf-section-title">Time of Day Restriction</h4>
              </div>
              <div className="tsf-time-restriction-group">
                <label
                  className={`tsf-radio-label tsf-radio-full ${
                    formData.timeRestriction === "unrestricted"
                      ? "tsf-radio-selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="timeRestriction"
                    checked={formData.timeRestriction === "unrestricted"}
                    onChange={() =>
                      handleChange("timeRestriction", "unrestricted")
                    }
                    className="tsf-radio"
                  />
                  <span className="tsf-radio-text">Unrestricted</span>
                </label>
                <div
                  className={`tsf-radio-between${formData.timeRestriction === "between" ? " tsf-radio-selected" : ""}`}
                >
                  <label
                    className={`tsf-radio-label tsf-radio-full ${
                      formData.timeRestriction === "between"
                        ? "tsf-radio-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeRestriction"
                      checked={formData.timeRestriction === "between"}
                      onChange={() =>
                        handleChange("timeRestriction", "between")
                      }
                      className="tsf-radio"
                    />
                    <span
                      className={`tsf-radio-text${formData.timeRestriction === "between" ? " tsf-radio-text-selected" : ""}`}
                    >
                      Run only between:
                    </span>
                  </label>
                  {formData.timeRestriction === "between" && (
                    <div className="tsf-between-time-row">
                      <div className="w-full sm:flex-1">
                        <label className="tsf-between-label">
                          From Time (HH:MM:SS)
                        </label>
                        <input
                          type="time"
                          step="1"
                          value={formData.timeFrom}
                          onChange={(e) =>
                            handleChange("timeFrom", e.target.value)
                          }
                          className={`tsf-input${errors.timeFrom ? " tsf-input-error" : ""}`}
                          aria-invalid={!!errors.timeFrom}
                          aria-describedby={
                            errors.timeFrom ? "timeFrom-error" : undefined
                          }
                        />
                        {errors.timeFrom && (
                          <p id="timeFrom-error" className="tsf-error-text">
                            {" "}
                            {errors.timeFrom}
                          </p>
                        )}
                      </div>
                      <span className="tsf-between-and">and</span>
                      <div className="w-full sm:flex-1">
                        <label className="tsf-between-label">
                          To Time (HH:MM:SS)
                        </label>
                        <input
                          type="time"
                          step="1"
                          value={formData.timeTo}
                          onChange={(e) =>
                            handleChange("timeTo", e.target.value)
                          }
                          className={`tsf-input${errors.timeTo ? " tsf-input-error" : ""}`}
                          aria-invalid={!!errors.timeTo}
                          aria-describedby={
                            errors.timeTo ? "timeTo-error" : undefined
                          }
                        />
                        {errors.timeTo && (
                          <p id="timeTo-error" className="tsf-error-text">
                            {" "}
                            {errors.timeTo}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
               {errors.reportQueryModal && (
                    <div className="tsf-error-text text-center">
                      {errors.reportQueryModal}
                    </div>
                  )}
            {/* ===== Report Data Section ===== */}
            <section className="tsf-section">
              <div className="tsf-section-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px" }}>
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="tsf-section-faicon"
                />
                <h4 className="tsf-section-title">Report Data</h4>
                </div>
                {isExportReport && (
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
                  style={{ whiteSpace: "nowrap" }}
                >
                  <FontAwesomeIcon icon={faCog} className="tsf-btn-icon" />
                  Configure Report Query
                </button>
                )}
              </div>
              <div
                className="tsf-topbar-grid"
                aria-label="Report Data Source and Export Filters"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  margin: "8px 0 16px",
                }}
              >
                <label
                  className="form-label"
                  htmlFor="dataSourceSelect"
                  style={{ margin: 0, whiteSpace: "nowrap" }}
                >
                  Report Type:
                </label>
                <div className="tsf-div">
                  <select
                    id="dataSourceSelect"
                    value={config.reportType}
                    onChange={(e) => handleReportTypeChange(e.target.value)}
                    className={`tsf-select tsf-select-legacy${errors.reportType ? " tsf-input-error" : ""}`}
                    aria-invalid={!!errors.reportType}
                    aria-describedby={
                      errors.reportType ? "reportType-error" : undefined
                    }
                  >
                    <option value="">Select report...</option>
                    {/* <option value="1">System Logs</option>
                    <option value="2">Event History</option>
                    <option value="3">Activity Records</option>
                    <option value="4">Performance Metrics</option> */}
                     {lookUpData.listReportTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.reportTypeName}
              </option>
            ))}
                  </select>
                  {errors.reportType && (
                    <p  className="tsf-error-text">
                      {errors.reportType}
                    </p>
                  )}
                </div>
               
              </div>

              {/* ===== Accordion (Bootstrap flush style) ===== */}
              <div
                className="accordion accordion-flush"
                id="reportQueryAccordion"
              >
                <div className="accordion-item">
                  <h2 className="accordion-header" id="reportQueryHeading">
                    {(showAccordionHeader && isExportReport) && (
                      <button
                        className={`accordion-header-button accordion-button ${showAccordion ? "" : "collapsed"}`}
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
        {isExportReport && (
                  <div
                    id="report-query-collapse"
                    className={`accordion-collapse collapse ${showAccordion ? "show" : ""}`}
                    aria-labelledby="reportQueryHeading"
                    data-bs-parent="#reportQueryAccordion"
                  >
                    <div className="accordion-body p-0">
                      <ReportSelectionModal
                        initialValue={{
                          ...(config.reportQuery || {}),
                          ...(reportQuery || {}),
                        }}
                        onSave={(payload) => {
                          const nextReportQuery = {
                            ...(config.reportQuery || {}),
                            ...payload,
                          };
                          updateConfig("reportQuery", nextReportQuery);
                          setReportQuery(nextReportQuery);
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
          )}
                </div>
              </div>

              {/* Tabs and File Output Settings: Only show when accordion is closed */}
              {!showAccordion && isExportReport && (
                <>
                  <div
                    className="tsf-row tsf-row-tabs"
                    role="tablist"
                    aria-label="Report tabs"
                  >
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
                    <div
                      id="tab-file-output"
                      role="tabpanel"
                      className="tsf-file-output-settings"
                    >
                      {/* Export Format */}
                      <div className="tsf-row">
                        <label className="form-label" htmlFor="exportFormat">
                          Export Format:
                        </label>
                        <div className="tsf-input-group">
                          <select
                            id="exportFormat"
                            value={config.exportFormat}
                            onChange={(e) =>
                              updateConfig("exportFormat", e.target.value)
                            }
                            className={`tsf-select${errors.exportFormat ? " tsf-input-error" : ""}`}
                            aria-invalid={!!errors.exportFormat}
                            aria-describedby={
                              errors.exportFormat
                                ? "exportFormat-error"
                                : undefined
                            }
                          >
                            <option value="">Select format...</option>
                            {lookUpData?.listReportFormat?.map((format) => (
                              <option
                                key={format.reportFormatID}
                                value={format.fileExtensionType.toLowerCase()}
                              >
                                {format.formatName} (.
                                {format.fileExtensionType.toLowerCase()})
                              </option>
                            ))}
                          </select>
                          {errors.exportFormat && (
                            <p
                              id="exportFormat-error"
                              className="tsf-error-text"
                            >
                              {" "}
                              {errors.exportFormat}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* File Naming Settings */}
                      <div className="tsf-row-group">
                        <div className="tsf-row tsf-row-half">
                          <label className="form-label" htmlFor="baseFilename">
                            Base Filename:
                          </label>
                          <div className="tsf-input-group">
                            <input
                              id="baseFilename"
                              type="text"
                              value={config.baseFilename}
                              onChange={(e) =>
                                updateConfig("baseFilename", e.target.value)
                              }
                              className={`tsf-input${errors.baseFilename ? " tsf-input-error" : ""}`}
                              placeholder="Enter base filename"
                              aria-invalid={!!errors.baseFilename}
                              aria-describedby={
                                errors.baseFilename
                                  ? "baseFilename-error"
                                  : undefined
                              }
                            />
                            {errors.baseFilename && (
                              <p
                                id="baseFilename-error"
                                className="tsf-error-text"
                              >
                                {" "}
                                {errors.baseFilename}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="tsf-row tsf-row-half">
                          <label className="form-label" htmlFor="fileExtension">
                            File Extension:
                          </label>
                          <div className="tsf-input-group">
                            <input
                              id="fileExtension"
                              type="text"
                              value={config.fileExtension}
                              onChange={(e) =>
                                updateConfig("fileExtension", e.target.value)
                              }
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
                              onChange={(e) =>
                                updateConfig(
                                  "includeTimestamp",
                                  e.target.checked,
                                )
                              }
                              className="form-checkbox tsf-checkbox"
                            />
                            <label
                              className="form-label"
                              htmlFor="includeTimestamp"
                            >
                              Enable Timestamp :
                            </label>
                          </label>
                          {config.includeTimestamp && (
                            <div className="tsf-row tsf-row-timestamp">
                              <label
                                className="form-label"
                                htmlFor="timestampFormat"
                              >
                                <FontAwesomeIcon
                                  icon={faCalendar}
                                  className="tsf-row-timestamp-icon"
                                />
                                Timestamp Format in Filename:
                              </label>
                              <div className="tsf-input-group">
                                <input
                                  id="timestampFormat"
                                  type="text"
                                  value={"yyyyMMddHHmm"}
                                  onChange={(e) =>
                                    updateConfig(
                                      "timestampFormat",
                                      e.target.value,
                                    )
                                  }
                                  className="tsf-input"
                                  placeholder="yyyyMMddHHmm"
                                  disabled
                                />
                                <p className="tsf-help-text">
                                  Example: {config.baseFilename}_20231215143022.
                                  {(config.fileExtension || "").toLowerCase()}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                      <div className="tsf-row tsf-row-folder">

                      {/* Top Row (Checkbox Only) */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <label
                          className="form-checkbox-label"
                          style={{
                            whiteSpace: "nowrap",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={config.enableLocalSave}
                            onChange={(e) =>
                              updateConfig("enableLocalSave", e.target.checked)
                            }
                            className="form-checkbox tsf-checkbox"
                            style={{ marginRight: "8px" }}
                          />
                          <label className="form-label">
                            Job Delivery location
                          </label>
                        </label>
                      </div>

                      {/* Delivery Rows (Stacked Vertically) */}
                      {config.enableLocalSave && (
                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                          }}
                        >
                          {/* {deliveryLocations.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                              }}
                            >

                            <select
                                value={item.storageConnectionId}
                                onChange={(e) =>
                                  updateDeliveryLocation(
                                    index,
                                    "storageConnectionId",
                                    e.target.value
                                  )
                                }
                                className="tsf-input"
                                style={{ minWidth: "180px" }}
                              >
                                <option value="">Select Storage Connection</option>
                                {lookUpData.listStorageConnection.map((st) => ( <option key={st.id} value={st.id}> {st.name} - {st.storageType} </option> ))}
                              </select>

                              <label className="form-label">Directory:</label>

                              <div className="tsf-div">
                                <input
                                  type="text"
                                  value={item.directory}
                                  onChange={(e) =>
                                    updateDeliveryLocation(index, "directory", e.target.value)
                                  }
                                  className="tsf-input"
                                  placeholder="Select destination folder"
                                  style={{ marginBottom: 0 }}
                                />
                              </div>

                              <input
                                id={`folderInput-${index}`}
                                type="file"
                                webkitdirectory=""
                                directory=""
                                multiple
                                onChange={(e) => {
                                  if (e.target.files.length > 0) {
                                    const folderName =
                                      e.target.files[0].webkitRelativePath;

                                    updateDeliveryLocation(index, "directory", folderName);
                                  }
                                }}
                                className="hidden"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  document.getElementById(`folderInput-${index}`)?.click()
                                }
                                className="tsf-btn tsf-btn-secondary"
                              >
                                Browse
                              </button>

                              {deliveryLocations.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeDeliveryLocation(index)}
                                  className="tsf-btn tsf-btn-danger"
                                >
                                  -
                                </button>
                              )}

                              {index === deliveryLocations.length - 1 && (
                                <button
                                  type="button"
                                  onClick={addDeliveryLocation}
                                  className="tsf-btn tsf-btn-primary"
                                >
                                  +
                                </button>
                              )}
                            </div>
                          ))} */}
                          {deliveryLocations.map((item, index) => {
                        // Find selected storage for this row
                        const selectedStorage = lookUpData.listStorageConnection.find(
                          (st) => st.id.toString() === item.storageConnectionId?.toString()
                        );

                        const isLocal =
                          selectedStorage?.storageType?.toLowerCase() === "local";

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "16px",
                            }}
                          >
                           <div
                              className="tsf-div"
                              style={{ display: "flex", flexDirection: "column", minWidth: "220px" }}
                            >
                              <label className="form-label">Storage Connection</label>

                              <select
                                value={item.storageConnectionId}
                                onChange={(e) => {
                                  updateDeliveryLocation(index, "storageConnectionId", e.target.value);
                                  updateDeliveryLocation(index, "directory", "");
                                }}
                                className="tsf-input"
                              >
                                <option value="">Select Storage Connection</option>
                                {lookUpData.listStorageConnection.map((st) => (
                                  <option key={st.id} value={st.id}>
                                    {st.name} - {st.storageType}
                                  </option>
                                ))}
                              </select>

                              {errors[`storageConnectionId_${index}`] && (
                                <p className="tsf-error-text">
                                  {errors[`storageConnectionId_${index}`]}
                                </p>
                              )}
                            </div>

                            <div
                              className="tsf-div"
                              style={{ display: "flex", flexDirection: "column", minWidth: "250px" }}
                            >
                              <label className="form-label">Directory</label>

                              <input
                                type="text"
                                value={item.directory}
                                onChange={(e) =>
                                  updateDeliveryLocation(index, "directory", e.target.value)
                                }
                                className="tsf-input"
                                placeholder={
                                  isLocal
                                    ? "Select local destination folder"
                                    : "Enter remote path"
                                }
                              />

                              {errors[`directory_${index}`] && (
                                <p className="tsf-error-text">
                                  {errors[`directory_${index}`]}
                                </p>
                              )}
                            </div>

                            {/* Browse Button ONLY for Local */}
                            {isLocal && (
                              <>
                                <input
                                  id={`folderInput-${index}`}
                                  type="file"
                                  webkitdirectory=""
                                  directory=""
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      // Get only top-level folder name
                                      const fullPath = e.target.files[0].webkitRelativePath;
                                      const folderName = fullPath.split("/")[0];

                                      updateDeliveryLocation(index, "directory", folderName);
                                    }
                                  }}
                                  className="hidden"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    document
                                      .getElementById(`folderInput-${index}`)
                                      ?.click()
                                  }
                                  className="tsf-btn tsf-btn-secondary mt-225rem"
                                >
                                  Browse
                                </button>
                              </>
                            )}

                            {/* Export supports exactly one delivery location */}
                          </div>
                        );
                      })}
                        </div>
                      )}
                      </div>
                        {/* Remote Upload Option (moved here) */}
                        {/* <div
                          className="tsf-row tsf-row-upload"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <label
                            className="form-checkbox-label"
                            style={{
                              whiteSpace: "nowrap",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={config.enableRemoteUpload}
                              onChange={(e) =>
                                updateConfig(
                                  "enableRemoteUpload",
                                  e.target.checked,
                                )
                              }
                              className="form-checkbox tsf-checkbox"
                              style={{ marginRight: "8px" }}
                            />
                            <label
                              className="form-label"
                              htmlFor="enableRemoteUpload"
                            >
                              Enable Remote Upload
                            </label>
                          </label>
                          {config.enableRemoteUpload && (
                            <>
                              <label
                                className="form-label"
                                htmlFor="uploadProtocol"
                              >
                                Protocol:
                              </label>
                              <div className="tsf-div">
                                <select
                                  id="uploadProtocol"
                                  value={config.uploadProtocol}
                                  onChange={(e) =>
                                    updateConfig("uploadProtocol", e.target.value)
                                  }
                                  className={`tsf-select${errors.uploadProtocol ? " tsf-input-error" : ""}`}
                                  style={{ minWidth: "180px" }}
                                  aria-invalid={!!errors.uploadProtocol}
                                  aria-describedby={
                                    errors.uploadProtocol
                                      ? "uploadProtocol-error"
                                      : undefined
                                  }
                                >
                                  <option value="">Select protocol...</option>
                                  {lookUpData?.listFileTransferType?.map(
                                    (type) => (
                                      <option
                                        key={type.fileTransferTypeID}
                                        value={type.fileTransferTypeID}
                                      >
                                        {type.fileTransferTypeName} (
                                        {type.fileTransferTypeDescription})
                                      </option>
                                    ),
                                  )}
                                </select>
                                {errors.uploadProtocol && (
                                  <p
                                    className="tsf-error-text"
                                  >
                                    {errors.uploadProtocol}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isImportReport && (
                <>
                <div
                  className="tsf-row tsf-row-tabs"
                  role="tablist"
                  aria-label="Report tabs"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={true}
                    aria-controls="tab-file-output"
                    className="tsf-tab-btn tsf-tab-btn-active"
                    tabIndex={0}
                  >
                    File Import Settings
                  </button>
                </div>

                {/* ===== Tab Content ===== */}
                <div className="tsf-tab-content">
                  <div
                    id="tab-file-output"
                    role="tabpanel"
                    className="tsf-file-output-settings"
                  >
                 
                    <div className="tsf-row">
                    <label className="form-label">Station:</label>
                     <select
                        value={config.stationId}
                        onChange={(e) => updateConfig("stationId", e.target.value)}
                        className="tsf-select"
                      >
                        <option value="">Select Station...</option>
                        {lookUpData.listStation?.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.stationName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* File Naming Settings */}
                    <div className="tsf-row-group">
                    <div className="tsf-row">
                      <label className="form-label">Import Type:</label>
                      <select
                        value={config.importType}
                        onChange={(e) => updateConfig("importType", e.target.value)}
                        className="tsf-select"
                      >
                        <option value="">Select Import Type...</option>
                        <option value="API">API</option>
                        <option value="AirQuality">AirQuality</option>
                      </select>
                    </div>  
                    <div className="tsf-row">
                    <label className="form-label">API URL:</label>
                    <input
                      type="text"
                      value={config.apiUrl || ""}
                      onChange={(e) =>
                        updateConfig("apiUrl", e.target.value)
                      }
                      className="tsf-input"
                     // placeholder="https://example.com/api"
                    />
                  </div>

                  {/* Method */}
                  <div className="tsf-row">
                    <label className="form-label">Method:</label>
                    <select
                      value={config.method || ""}
                      onChange={(e) =>
                        updateConfig("method", e.target.value)
                      }
                      className="tsf-select"
                    >
                      <option value="">Select Method...</option>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  <div className="tsf-row">
                  <label className="form-label">Authentication Type:</label>
                  <select
                      value={getAuthSelectValue()}
                      onChange={(e) => {
                        const type = e.target.value;

                        if (type === "none") {
                          updateConfig("Authentication", { Type: "none" });
                        }

                        if (type === "bearer-fixed") {
                          updateConfig("Authentication", {
                            Type: "bearerToken",
                            TokenType: "fixed",
                            FixedToken: "",
                          });
                        }

                        if (type === "bearer-dynamic") {
                          updateConfig("Authentication", {
                            Type: "bearerToken",
                            TokenType: "dynamic",
                            DynamicAuth: {
                              UserId: "",
                              Password: "",
                              AuthUrl: "",
                              TokenPath: "",
                            },
                          });
                        }
                      }}
                      className="tsf-select"
                    >
                      <option value="none">None</option>
                      <option value="bearer-fixed">Bearer Token (Fixed)</option>
                      <option value="bearer-dynamic">Bearer Token (Dynamic)</option>
                    </select>
                  </div>   
                  {config.Authentication?.Type === "bearerToken" &&
 config.Authentication?.TokenType === "fixed" && (
  <div className="tsf-row">
    <label className="form-label">Fixed Token:</label>
    <input
      type="text"
      value={config.Authentication?.FixedToken || ""}
      onChange={(e) =>
        updateConfig("Authentication", {
          ...config.Authentication,
          FixedToken: e.target.value
        })
      }
      className="tsf-input"
    />
  </div>
)}     
{/* Dynamic Auth Inputs */}
{config.Authentication?.Type === "bearerToken" &&
 config.Authentication?.TokenType === "dynamic" && (
  <div className="space-y-3">

    <div className="tsf-row">
      <label className="form-label">User ID:</label>
      <input
        type="text"
        value={config.Authentication?.DynamicAuth?.UserId || ""}
        onChange={(e) =>
          updateConfig("Authentication", {
            ...config.Authentication,
            DynamicAuth: {
              ...config.Authentication.DynamicAuth,
              UserId: e.target.value
            }
          })
        }
        className="tsf-input"
      />
    </div>

    <div className="tsf-row">
      <label className="form-label">Password:</label>
      <input
        type="password"
        value={config.Authentication?.DynamicAuth?.Password || ""}
        onChange={(e) =>
          updateConfig("Authentication", {
            ...config.Authentication,
            DynamicAuth: {
              ...config.Authentication.DynamicAuth,
              Password: e.target.value
            }
          })
        }
        className="tsf-input"
      />
    </div>

    <div className="tsf-row">
      <label className="form-label">Auth URL:</label>
      <input
        type="text"
        value={config.Authentication?.DynamicAuth?.AuthUrl || ""}
        onChange={(e) =>
          updateConfig("Authentication", {
            ...config.Authentication,
            DynamicAuth: {
              ...config.Authentication.DynamicAuth,
              AuthUrl: e.target.value
            }
          })
        }
        className="tsf-input"
      />
    </div>

    <div className="tsf-row">
      <label className="form-label">Token Path:</label>
      <input
        type="text"
        value={config.Authentication?.DynamicAuth?.TokenPath || ""}
        onChange={(e) =>
          updateConfig("Authentication", {
            ...config.Authentication,
            DynamicAuth: {
              ...config.Authentication.DynamicAuth,
              TokenPath: e.target.value
            }
          })
        }
        className="tsf-input"
      />
    </div>

  </div>
)} 
   <div className="tsf-row">
  <label className="form-label">Query Parameters:</label>

  <div style={{ flex: 1 }}>
    {(config.QueryParameters ?? []).map((param, index, arr) => (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "8px",
          alignItems: "center",
          width: "100%"
        }}
      >
        <input
          type="text"
          placeholder="Key"
          value={param.key}
          onChange={(e) =>
            updateQueryParam(index, "key", e.target.value)
          }
          className="tsf-input"
          style={{ flex: 1 }}
        />

        <input
          type="text"
          placeholder="Value"
          value={param.value}
          onChange={(e) =>
            updateQueryParam(index, "value", e.target.value)
          }
          className="tsf-input"
          style={{ flex: 1 }}
        />

        <div style={{ display: "flex", gap: "6px" }}>
          {arr.length > 1 && (
            <button
              type="button"
              onClick={() => removeQueryParam(index)}
              className="tsf-btn tsf-btn-primary"
            >
              -
            </button>
          )}

          {index === arr.length - 1 && (
            <button
              type="button"
              onClick={addQueryParam}
              className="tsf-btn tsf-btn-primary"
            >
              +
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
<div className="tsf-row">
  <label className="form-label">Headers:</label>

  <div style={{ flex: 1 }}>
    {(config.Headers ?? []).map((header, index, arr) => (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "8px",
          alignItems: "center",
          width: "100%"
        }}
      >
        <input
          type="text"
          placeholder="Key"
          value={header.key}
          onChange={(e) =>
            updateHeader(index, "key", e.target.value)
          }
          className="tsf-input"
          style={{ flex: 1 }}
        />

        <input
          type="text"
          placeholder="Value"
          value={header.value}
          onChange={(e) =>
            updateHeader(index, "value", e.target.value)
          }
          className="tsf-input"
          style={{ flex: 1 }}
        />

        <div style={{ display: "flex", gap: "6px" }}>
          {arr.length > 1 && (
            <button
              type="button"
              onClick={() => removeHeader(index)}
              className="tsf-btn tsf-btn-primary"
            >
              -
            </button>
          )}

          {index === arr.length - 1 && (
            <button
              type="button"
              onClick={addHeader}
              className="tsf-btn tsf-btn-primary"
            >
              +
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
<div className="tsf-row">
  <label className="form-label">Body:</label>

  <div style={{ flex: 1 }}>
    {(config.Body || []).map((param, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "8px",
          alignItems: "center",
          width: "100%"
        }}
      >
        <input
          type="text"
          placeholder="Key"
          value={param.key}
          onChange={(e) =>
            updateBodyParam(index, "key", e.target.value)
          }
          className="tsf-input"
          style={{ flex: 1 }}
        />

        <input
          type="text"
          placeholder="Value"
          value={param.value}
          onChange={(e) =>
            updateBodyParam(index, "value", e.target.value)
          }
          className="tsf-input"
          style={{ flex: 1 }}
        />

        <div style={{ display: "flex", gap: "6px" }}>
          {config.Body.length > 1 && (
            <button
              type="button"
              onClick={() => removeBodyParam(index)}
              className="tsf-btn tsf-btn-primary"
            >
              -
            </button>
          )}

          {index === config.Body.length - 1 && (
            <button
              type="button"
              onClick={addBodyParam}
              className="tsf-btn tsf-btn-primary"
            >
              +
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
<div className="tsf-row">
  <label className="form-label">API Read Template:</label>

  <textarea
    className="tsf-textarea"
    rows="8"
    value={config.ApiReadTemplate}
    onChange={(e) =>
      updateConfig("ApiReadTemplate", e.target.value)
    }
  />

  {errors.ApiReadTemplate && (
    <p className="tsf-error-text">
      {errors.ApiReadTemplate}
    </p>
  )}
</div>
                    </div>
                  </div>
                </div>
              </>
              )}

               {isExceedanceReport && (
                <>
                <div
                  className="tsf-row tsf-row-tabs"
                  role="tablist"
                  aria-label="Report tabs"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={true}
                    aria-controls="tab-file-output"
                    className="tsf-tab-btn tsf-tab-btn-active"
                    tabIndex={0}
                  >
                    Exceedance Settings
                  </button>
                </div>

                {/* ===== Tab Content ===== */}
                <div className="tsf-tab-content">
                  <div
                    id="tab-exceedance-settings"
                    role="tabpanel"
                    className="tsf-exceedance-settings"
                  >
              <div className="tsf-inline-row">

                {/* Is Forward Checkbox */}
                <div className="tsf-checkbox-container">
                  <label className="form-label">IsForward Average:</label>

                  <input
                    type="checkbox"
                    checked={config.isForward || false}
                    onChange={(e) => updateConfig("isForward", e.target.checked)}
                    className="tsf-checkbox"
                  />
                </div>

                {/* Exceedance Interval Dropdown */}
                <div className="tsf-interval-container">
                  <label className="form-label">Exceedance Interval:</label>

                  <select
                    value={config.exceedanceInterval !== undefined && config.exceedanceInterval !== null ? String(config.exceedanceInterval) : ""}
                    onChange={(e) =>
                      updateConfig("exceedanceInterval", e.target.value)
                    }
                    className="tsf-select"
                  >
                    <option value="">Select Interval...</option>
                    {[...new Set(exceedanceList?.map((x) => x.interval))]?.map(
                        (interval) => (
                          <option key={interval} value={String(interval)}>
                            {getIntervalLabel(interval)}
                          </option>
                        )
                      )}
                  </select>
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
                <button type="submit" className="tsf-btn tsf-btn-submit">
                  {!initialData?.jobID && !initialData?.id ? "+ Create" : "✓ Update"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
