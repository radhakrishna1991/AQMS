import { useState, useRef, useEffect } from 'react';
import { FtpTransferForm } from './FtpTransferForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function FtpData() {
  const $ = window.jQuery;
  const gridRefjsgridftp = useRef();
  const [transfers, setTransfers] = useState([
    {
      id: '1',
      programName: 'FTP-Test',
      transferMethod: 'FTP',
      ftpHost: '192.168.1.101',
      directory: '',
      userName: 'test',
      enable: true,
      port: '21',
      useKeyFile: false,
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
            data: transfers,
            fields: [
              { name: 'programName', title: 'Configuration Name', type: 'text', align: 'left' },
              { name: 'transferMethod', title: 'Method', type: 'text', align: 'left' },
              { name: 'ftpHost', title: 'FTP Host', type: 'text', align: 'left' },
              { name: 'userName', title: 'User Name', type: 'text', align: 'left' },
              { name: 'port', title: 'Port', type: 'text', align: 'left' },
              { name: 'enable', title: 'Status', align: 'center', itemTemplate: (value) => value ? 'Enabled' : 'Disabled' },
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
    }, [currentView, transfers]);
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleCreate = (data) => {
    const newTransfer = {
      ...data,
      id: Date.now().toString(),
    };
    setTransfers([...transfers, newTransfer]);
    setCurrentView('list');
  };

  const handleUpdate = (id, data) => {
    setTransfers(
      transfers.map((t) =>
        t.id === id ? { ...data, id } : t
      )
    );
    setEditingTransfer(null);
    setCurrentView('list');
  };

  const handleDelete = (id) => {
    setTransfers(transfers.filter((t) => t.id !== id));
  };

  const handleEdit = (transfer) => {
    setEditingTransfer(transfer);
    setCurrentView('form');
  };

  const handleNewTransfer = () => {
    setEditingTransfer(null);
    setCurrentView('form');
  };

  const handleCancel = () => {
    setEditingTransfer(null);
    setCurrentView('list');
  };

  return (
    <main id="main" className="main">
      <div className="container">
        <div className="row my-2">
          <div className="pagetitle col">
            {currentView === 'form' && !editingTransfer && <h1>Add FTP Configuration</h1>}
            {currentView === 'form' && editingTransfer && <h1>Update FTP Configuration</h1>}
            {currentView === 'list' && <h1>FTP Configuration List</h1>}
          </div>
          <div className="col text-end">
            {currentView === 'list' ? (
              <span
                className="operation_class mx-2"
                onClick={handleNewTransfer}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-plus-circle-fill"></i>{' '}
                <span>Create New FTP Configuration</span>
              </span>
            ) : (
              <span
                className="operation_class mx-2"
                onClick={() => setCurrentView('list')}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-card-list"></i>{' '}
                <span>View FTP Configurations</span>
              </span>
            )}
          </div>
        </div>
        <section className="section">
          <div>
            {currentView === 'form' ? (
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
