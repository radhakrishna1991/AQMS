import { useState, useRef, useEffect } from 'react';
import { TaskSchedulerForm } from './TaskSchedulerForm';
import CommonFunctions from "../../utils/CommonFunctions";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function TaskScheduler() {
  const $ = window.jQuery;
  const gridRefjsgridftp = useRef();
  const [tasks, setTasks] = useState([]);
  const [lookUpData, setLookupData] = useState([]);

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
          setTasks(data.listScheduleTasks || []);
        }
      })
      .catch(() => {
        toast.error(
          "Unable to get the Task Scheduler list. Please contact adminstrator"
        );
      });
  };

  const [currentView, setCurrentView] = useState('list'); // 'list' | 'form'
    useEffect(() => {
      if (currentView === 'list') {
        $(function () {
          $(gridRefjsgridftp.current).jsGrid({
            width: '100%',
            height: 'auto',
            filtering: false,
            editing: false,
            inserting: false,
            sorting: true,
            autoload: true,
            paging: true,
            pageLoading: true,
            pageButtonCount: 5,
            pageSize: 100,
            data: tasks,
            fields: [
              { name: 'jobName', title: 'Task Name', type: 'text', align: 'left' },
              { name: 'jobDescription', title: 'Description', type: 'text', align: 'left' },
              { name: 'effectiveStartDateTime', title: 'Start Time', type: 'text', align: 'left', itemTemplate: (value) => value ? new Date(value).toLocaleString() : '' },
              { name: 'executionIntervalMinutes', title: 'Repeat', type: 'text', align: 'center', itemTemplate: (value, item) => `${value}` },
              { name: 'isActive', title: 'Status', align: 'center', itemTemplate: (value) => value ? 'Enabled' : 'Disabled' },
              { name: 'days', title: 'Days', align: 'center'},
              { name: 'timeRestriction', title: 'Time Restriction', align: 'center', itemTemplate: (value, item) => value !== undefined ? value : 'Unrestricted' },
              {
                type: 'control',
                width: 100,
                editButton: false,
                deleteButton: false,
                itemTemplate: (value, item) => {
                  const $editBtn = $('<button>')
                    .attr({ class: 'customGridEditbutton jsgrid-button jsgrid-edit-button' })
                    .click((e) => { handleEdit(item); e.stopPropagation(); });
                  const $deleteBtn = $('<button>')
                    .attr({ class: 'customGridDeletebutton jsgrid-button jsgrid-delete-button' })
                    .click((e) => { handleDelete(item.jobID); e.stopPropagation(); });
                  return $('<div>').append($editBtn).append($deleteBtn);
                },
              },
            ],
          });
        });
      }
      // Cleanup jsGrid on unmount or view change
      return () => {
        if (gridRefjsgridftp.current) {
          $(gridRefjsgridftp.current).jsGrid('destroy');
        }
      };
      // eslint-disable-next-line
    }, [currentView, tasks]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (editingTask && editingTask?.jobID) {
    GetScheduledTaskById(editingTask?.jobID).then((data) => {
      setEditingTask(data[0]);
    });
  }
  }, [editingTask?.jobID]);


  const GetScheduledTaskById = async (id) => {
    let authHeader = await CommonFunctions.getAuthHeader();
    const response = await fetch(
      CommonFunctions.getWebApiUrl() + "api/GetScheduledTask/" + id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader.Authorization,
        },
      }
    );
    const responseJson = await response.json();
    return responseJson;
  }

  const handleDelete = (id) => {
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
        let authHeader = await CommonFunctions.getAuthHeader();
        await fetch(
          CommonFunctions.getWebApiUrl() + "api/ScheduleTask/" + id,
          {
            method: "DELETE",
            headers: authHeader,
          }
        )
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson == 1) {
              toast.success("Scheduled task deleted successfully");
              const updated = fetchTaskSchedulerLookup();
              setTasks(Array.isArray(updated) ? updated : []);
            } else {
              toast.error(
                "Unable to delete Scheduled task. Please contact adminstrator"
              );
            }
          })
          .catch((error) =>
            toast.error(
              "Unable to delete Scheduled task. Please contact adminstrator"
            )
          );
      }
    });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setCurrentView('form');
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setCurrentView('form');
  };

  const handleCancel = () => {
    setEditingTask(null);
    setCurrentView('list');
  };

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row my-2">
          <div className="pagetitle col">
            {currentView === 'form' && !editingTask && <h1>Add Scheduled Task</h1>}
            {currentView === 'form' && editingTask && <h1>Update Scheduled Task</h1>}
            {currentView === 'list' && <h1>Scheduled Task List</h1>}
          </div>
          <div className="col text-end">
            {currentView === 'list' ? (
              <span
                className="operation_class mx-2"
                onClick={handleNewTask}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-plus-circle-fill"></i>{' '}
                <span>Create New Scheduled Task</span>
              </span>
            ) : (
              <span
                className="operation_class mx-2"
                onClick={() => setCurrentView('list')}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-card-list"></i>{' '}
                <span>View Scheduled Tasks</span>
              </span>
            )}
          </div>
        </div>
        <section className="section">
          <div>
            {currentView === 'form' ? (
              <TaskSchedulerForm
                initialData={editingTask}
                lookUpData={lookUpData}
                onSubmit={() => {
                  setEditingTask(null);
                  setCurrentView('list');
                }}
                fetchTaskSchedulerLookup={fetchTaskSchedulerLookup}
                onCancel={handleCancel}
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
