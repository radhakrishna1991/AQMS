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
          data: transfers,
          fields: [
            {
              name: "ftpName",
              title: "Configuration Name",
              type: "text",
              align: "left",
            },
            {
              name: "transferMethod",
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
              name: "enabled",
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
    await fetch(CommonFunctions.getWebApiUrl() + "api/FTPConfigurarion", {
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
          "Unable to get the FTP Configuration list. Please contact adminstrator"
        );
      });
  };

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
          setLookupData(data.listFileTransferType);
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
      CommonFunctions.getWebApiUrl() + "api/FTPConfigurarion",
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
      toast.success("FTP configuration added successfully");
      fetchFtpConfigurations();
      setCurrentView("list");
    } else if (responseJson == "AlreadyExist") {
      toast.error(
        "FTP configuration already exists with the given name. Please try with another name."
      );
      return false;
    } else {
      toast.error(
        "Unable to add the FTP configuration. Please contact administrator"
      );
      return false;
    }
  };

  // Update FTP configuration API
  const handleUpdate = async (id, data) => {
    let authHeader = await CommonFunctions.getAuthHeader();
    const response = await fetch(
      CommonFunctions.getWebApiUrl() + "api/FTPConfigurarion/" + id,
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
      toast.success("FTP configuration updated successfully");
      fetchFtpConfigurations();
      setCurrentView("list");
    } else if (responseJson == 2) {
      toast.error(
        "FTP configuration already exist with given Name. Please try with another Ftp Name."
      );
    } else {
      toast.error(
        "Unable to update the FTP configuration. Please contact administrator"
      );
      return false;
    }
  };

  const handleDelete = function (item) {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this Parameter Alarm !",
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
          CommonFunctions.getWebApiUrl() + "api/FTPConfigurarion/" + id,
          {
            method: "DELETE",
            headers: authHeader,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("FTP configuration deleted successfully");
              const updated = fetchFtpConfigurations();
              setTransfers(Array.isArray(updated) ? updated : []);
            } else {
              toast.error(
                "Unable to delete FTP configuration. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error(
              "Unable to delete FTP configuration. Please contact adminstrator"
            )
          );
      }
    });
  };

  const handleEdit = (transfer) => {
    setEditingTransfer(transfer);
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
              <h1>Add FTP Configuration</h1>
            )}
            {currentView === "form" && editingTransfer && (
              <h1>Update FTP Configuration</h1>
            )}
            {currentView === "list" && <h1>FTP Configuration List</h1>}
          </div>
          <div className="col text-end">
            {currentView === "list" ? (
              <span
                className="operation_class mx-2"
                onClick={handleNewTransfer}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-plus-circle-fill"></i>{" "}
                <span>Create New FTP Configuration</span>
              </span>
            ) : (
              <span
                className="operation_class mx-2"
                onClick={() => setCurrentView("list")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-card-list"></i>{" "}
                <span>View FTP Configurations</span>
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
                    handleUpdate(editingTransfer.id, data);
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
