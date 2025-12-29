import { useState, useRef, useEffect } from 'react';
import { TaskSchedulerForm } from './TaskSchedulerForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function TaskScheduler() {
  const $ = window.jQuery;
  const gridRefjsgridftp = useRef();
  const [tasks, setTasks] = useState([
    {
      id: '1',
      taskName: 'Sample Task',
      description: 'This is a sample scheduled task.',
      executive: 'ISTHYDPC34',
      startTime: '2025-12-26T09:00:00',
      repeatInterval: '6',
      intervalUnit: 'Days',
      enabled: true,
      daysToRun: {
        sunday: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
      },
      timeRestriction: 'unrestricted',
      timeFrom: '',
      timeTo: '',
    },
  ]);

  const [currentView, setCurrentView] = useState('list'); // 'list' | 'form'
    // jsGrid initialization for FTP data (must be after state declarations)
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
              { name: 'taskName', title: 'Task Name', type: 'text', align: 'left' },
              { name: 'description', title: 'Description', type: 'text', align: 'left' },
              { name: 'executive', title: 'Executive', type: 'text', align: 'left' },
              { name: 'startTime', title: 'Start Time', type: 'text', align: 'left', itemTemplate: (value) => value ? new Date(value).toLocaleString() : '' },
              { name: 'repeatInterval', title: 'Repeat', type: 'text', align: 'center', itemTemplate: (value, item) => `${value} ${item.intervalUnit}` },
              { name: 'enabled', title: 'Status', align: 'center', itemTemplate: (value) => value ? 'Enabled' : 'Disabled' },
              { name: 'daysToRun', title: 'Days', align: 'center', itemTemplate: (value) => Object.entries(value).filter(([k, v]) => v).map(([k]) => k.substring(0, 3)).join(', ') },
              { name: 'timeRestriction', title: 'Time Restriction', align: 'center', itemTemplate: (value, item) => value === 'between' ? `${item.timeFrom} - ${item.timeTo}` : 'Unrestricted' },
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
                    .click((e) => { handleDelete(item.id); e.stopPropagation(); });
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCreate = (data) => {
    const newTask = {
      ...data,
      id: Date.now().toString(),
    };
    setTasks([...tasks, newTask]);
    setCurrentView('list');
  };

  const handleUpdate = (id, data) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...data, id } : t
      )
    );
    setEditingTask(null);
    setCurrentView('list');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
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
                onSubmit={(data) => {
                  if (editingTask) {
                    handleUpdate(editingTask.id, data);
                  } else {
                    handleCreate(data);
                  }
                }}
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
