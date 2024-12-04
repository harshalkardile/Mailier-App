import React, { useState } from "react";
import "./mailList.css";

function MailList({ data }) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const truncateMessage = (message, maxLength = 50) => {
    return message.length > maxLength 
      ? message.substring(0, maxLength) + "..." 
      : message;
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="fl-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Group</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item._id || index}>
                <td>{index + 1}</td>
                <td>{item.groupId.name}</td>
                <td>{item.subject}</td>
                <td>
                  {truncateMessage(item.message)}
                  {item.message.length > 50 && (
                    <button 
                      onClick={() => openMessageModal(item.message)}
                      className="read-more-btn"
                    >
                      Read More
                    </button>
                  )}
                </td>
                <td>{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <div className="message-modal-overlay">
          <div className="message-modal">
            <div className="message-modal-content">
              <h2>Full Message</h2>
              <p>{selectedMessage}</p>
              <button 
                onClick={closeMessageModal} 
                className="close-modal-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MailList;
