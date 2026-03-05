import { useState, useRef, useEffect } from "react";
import { FtpTransferForm } from "./FtpTransferForm";
import CommonFunctions from "../../utils/CommonFunctions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function FtpData() {
  const $ = window.jQuery;
  const gridRefjsgridftp = useRef();
  const [transfers, setTransfers] = useState([]);
  const [lookUpData, setLookupData] = useState([]);
  const [currentView, setCurrentView] = useState("list"); // 'list' | 'form'
  useEffect(() => {
    if (currentView === "list") {
      $(function () {
        $(gridRefjsgridftp.current).jsGrid({
          width: "100%",
          height: "auto",
          filtering: false,
          editing: false,
          inserting: false,
          sorting: true,
          autoload: true,
          paging: true,
          pageLoading: true,
          pageButtonCount: 5,
          pageSize: 100,
          data: formattedTransfers,
          fields: [
            {
              name: "name",
              title: "Configuration Name",
              type: "text",
              align: "left",
            },
            {
              name: "storageType",
              title: "Method",
              type: "text",
              align: "left",
            },
            { name: "ftpHost", title: "FTP Host", type: "text", align: "left" },
            {
              name: "userName",
              title: "User Name",
              type: "text",
              align: "left",
            },
            { name: "port", title: "Port", type: "text", align: "left" },
            {
              name: "isActive",
              title: "Status",
              align: "center",
              itemTemplate: (value) => (value ? "Enabled" : "Disabled"),
            },
            {
              type: "control",
              width: 100,
              editButton: false,
              deleteButton: false,
              itemTemplate: (value, item) => {
                const $editBtn = $("<button>")
                  .attr({
                    class:
                      "customGridEditbutton jsgrid-button jsgrid-edit-button",
                  })
                  .click((e) => {
                    handleEdit(item);
                    e.stopPropagation();
                  });
                const $deleteBtn = $("<button>")
                  .attr({
                    class:
                      "customGridDeletebutton jsgrid-button jsgrid-delete-button",
                  })
                  .click((e) => {
                    handleDelete(item.id);
                    e.stopPropagation();
                  });
                return $("<div>").append($editBtn).append($deleteBtn);
              },
            },
          ],
        });
      });
    }
    // Cleanup jsGrid on unmount or view change
    return () => {
      if (gridRefjsgridftp.current) {
        $(gridRefjsgridftp.current).jsGrid("destroy");
      }
    };
    // eslint-disable-next-line
  }, [currentView, transfers]);
  const [editingTransfer, setEditingTransfer] = useState(null);

  useEffect(() => {
    fetchFtpConfigurations();
  }, []);

  const fetchFtpConfigurations = async () => {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/StorageConnection", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setTransfers(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        toast.error(
          "Unable to get the StorageConnection list. Please contact adminstrator"
        );
      });
  };

  const formattedTransfers = transfers.map(item => {
    let parsed = {};
  
    try {
      const json = JSON.parse(item.connectionJson || "{}");
  
      // Normalize storage type
      const type = (item.storageType || "").toLowerCase();
  
      /* ======================
         FTP
      ====================== */
      if (type === "ftp") {
        const ftp = json.Ftp || json.ftp || {};
  
        parsed = {
          ftpHost: ftp.Host || ftp.host || "",
          userName: ftp.Username || ftp.username || "",
          port: ftp.Port || ftp.port || "",
          sslMode: ftp.SslMode || ftp.sslMode || "",
          useSsl: ftp.UseSsl ?? ftp.useSsl ?? "",
          passiveMode: ftp.PassiveMode ?? ftp.passiveMode ?? ""
        };
      }
  
      /* ======================
         NETWORK (UNC)
      ====================== */
      else if (type.includes("network (unc)")) {
        const network = json.network || json.Network || {};
  
        parsed = {
          userName: network.Username || network.username || "",
          networkPassword: network.Password || network.password || ""
        };
      }
  
      /* ======================
         ONEDRIVE
      ====================== */
      else if (type === "onedrive") {
        const oneDrive = json.oneDrive || json.OneDrive || {};
  
        parsed = {
          tenantId: oneDrive.TenantId || oneDrive.tenantId || "",
          clientId: oneDrive.ClientId || oneDrive.clientId || "",
          clientSecret: oneDrive.ClientSecret || oneDrive.clientSecret || "",
          driveId: oneDrive.DriveId || oneDrive.driveId || "",
          folderId: oneDrive.FolderId || oneDrive.folderId || ""
        };
      }
  
      /* ======================
         LOCAL
      ====================== */
      else if (type === "local") {
        const local = json.local || json.Local || {};
  
        parsed = {
          createDirectoryIfNotExists:
            local.CreateDirectoryIfNotExists ??
            local.createDirectoryIfNotExists ??
            ""
        };
      }
  
    } catch (e) {
      console.error("Invalid connectionJson", e);
    }
  
    return {
      ...item,
      ...parsed
    };
  });

      useEffect(() => {
    fetchTaskSchedulerLookup();
  }, []);

  const fetchTaskSchedulerLookup = async () => {
    let authHeader = await CommonFunctions.getAuthHeader();
    await fetch(CommonFunctions.getWebApiUrl() + "api/GetTaskSchedulerLookup", {
      method: "GET",
      headers: authHeader,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setLookupData(data);
        }
      })
      .catch(() => {
        toast.error(
          "Unable to get the Task Scheduler list. Please contact adminstrator"
        );
      });
  };


  const handleCreate = async (data) => {
    let authHeader = await CommonFunctions.getAuthHeader();
    const response = await fetch(
      CommonFunctions.getWebApiUrl() + "api/StorageConnection",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
        },
        body: JSON.stringify(data),
      }
    );
    const responseJson = await response.text();
    if (responseJson == "Success") {
      toast.success("Storage Connection added successfully");
      fetchFtpConfigurations();
      setCurrentView("list");
    } else if (responseJson == "AlreadyExist") {
      toast.error(
        "Storage Connection already exists with the given name. Please try with another name."
      );
      return false;
    } else {
      toast.error(
        "Unable to add the Storage Connection. Please contact administrator"
      );
      return false;
    }
  };

  // Update FTP configuration API
  const handleUpdate = async (id, data) => {
    let authHeader = await CommonFunctions.getAuthHeader();
    const response = await fetch(
      CommonFunctions.getWebApiUrl() + "api/StorageConnection/" + id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
        },
        body: JSON.stringify(data),
      }
    );
    const responseJson = await response.json();
    if (responseJson == 1) {
      toast.success("Storage Connection updated successfully");
      fetchFtpConfigurations();
      setCurrentView("list");
    } else if (responseJson == 2) {
      toast.error(
        "Storage Connection already exist with given Name. Please try with another Ftp Name."
      );
    } else {
      toast.error(
        "Unable to update the Storage Connection. Please contact administrator"
      );
      return false;
    }
  };

  const handleDelete = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Storage Connection !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      confirmButtonText: "Yes",
      closeOnConfirm: false,
    }).then(async function (isConfirm) {
      if (isConfirm.isConfirmed) {
        let id = item;
        let authHeader = await CommonFunctions.getAuthHeader();
        await fetch(
          CommonFunctions.getWebApiUrl() + "api/StorageConnection/" + id,
          {
            method: "DELETE",
            headers: authHeader,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("Storage Connection deleted successfully");
              const updated = fetchFtpConfigurations();
              setTransfers(Array.isArray(updated) ? updated : []);
            } else {
              toast.error(
                "Unable to delete Storage Connection. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error(
              "Unable to delete Storage Connection. Please contact adminstrator"
            )
          );
      }
    });
  };

  // const handleEdit = (transfer) => {
  //   setEditingTransfer(transfer);
  //   setCurrentView("form");
  // };

  const handleEdit = (transfer) => {
    let parsedJson = {};
  
    try {
      parsedJson = JSON.parse(transfer.connectionJson || "{}");
    } catch (e) {
      console.error("Invalid JSON", e);
    }
  
    const type = (transfer.storageType || "").toLowerCase();
  
    let formData = {
      Id: transfer.id,
      ConfigName: transfer.name,
      StorageType: transfer.storageType,
      Enabled: transfer.isActive
    };
  
    /* ================= FTP ================= */
    if (type === "ftp") {
      const ftp = parsedJson.Ftp || parsedJson.ftp || {};
  
      formData = {
        ...formData,
        Protocol: ftp.Protocol || ftp.protocol || "",
        FtpHost: ftp.Host || ftp.host || "",
        Port: ftp.Port || ftp.port || "",
        UserName: ftp.Username || ftp.username || "",
        UserPassword: ftp.Password || ftp.password || "",
        PrivateKeyPath: ftp.privateKeyPath || ftp.privateKeyPath || "",
        PrivateKeyPassphrase: ftp.privateKeyPassphrase || ftp.PrivateKeyPassphrase || "",
        SslMode: ftp.SslMode || ftp.sslMode || "",
        UseSsl: ftp.UseSsl ?? ftp.useSsl ?? false,
        PassiveMode: ftp.PassiveMode ?? ftp.passiveMode ?? false
      };
    }
  
    /* ================= NETWORK ================= */
    else if (type.includes("network (unc)")) {
      const network = parsedJson.network || parsedJson.Network || {};
  
      formData = {
        ...formData,
        NetworkUserName: network.UserName || network.username || "",
        NetworkPassword: network.Password || network.password || ""
      };
    }
  
    /* ================= ONEDRIVE ================= */
    else if (type === "onedrive") {
      const oneDrive = parsedJson.oneDrive || parsedJson.OneDrive || {};
  
      formData = {
        ...formData,
        TenantId: oneDrive.TenantId || oneDrive.tenantId || "",
        ClientId: oneDrive.ClientId || oneDrive.clientId || "",
        ClientSecret: oneDrive.ClientSecret || oneDrive.clientSecret || "",
        DriveId: oneDrive.DriveId || oneDrive.driveId || "",
        FolderId: oneDrive.FolderId || oneDrive.folderId || ""
      };
    }
  
    /* ================= LOCAL ================= */
    else if (type === "local") {
      const local = parsedJson.local || parsedJson.Local || {};
  
      formData = {
        ...formData,
        CreateDirectoryIfNotExists:
          local.CreateDirectoryIfNotExists ??
          local.createDirectoryIfNotExists ??
          false
      };
    }
  
    setEditingTransfer(formData);
    setCurrentView("form");
  };

  const handleNewTransfer = () => {
    setEditingTransfer(null);
    setCurrentView("form");
  };

  const handleCancel = () => {
    setEditingTransfer(null);
    setCurrentView("list");
  };

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row my-2">
          <div className="pagetitle col">
            {currentView === "form" && !editingTransfer && (
              <h1>Add Storage Connection</h1>
            )}
            {currentView === "form" && editingTransfer && (
              <h1>Update Storage Connection</h1>
            )}
            {currentView === "list" && <h1>Storage Connections List</h1>}
          </div>
          <div className="col text-end">
            {currentView === "list" ? (
              <span
                className="operation_class mx-2"
                onClick={handleNewTransfer}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-plus-circle-fill"></i>{" "}
                <span>Create New Storage Connection</span>
              </span>
            ) : (
              <span
                className="operation_class mx-2"
                onClick={() => setCurrentView("list")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-card-list"></i>{" "}
                <span>View Storage Connection</span>
              </span>
            )}
          </div>
        </div>
        <section className="section">
          <div>
            {currentView === "form" ? (
              <FtpTransferForm
                initialData={editingTransfer}
                onSubmit={(data) => {
                  if (editingTransfer) {
                    handleUpdate(editingTransfer.Id, data);
                  } else {
                    handleCreate(data);
                  }
                }}
                onCancel={handleCancel}
                lookUpData={lookUpData}
              />
            ) : (
              <div className="jsGrid" ref={gridRefjsgridftp} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
