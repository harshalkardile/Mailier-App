import React, { useState } from "react";
import Papa from "papaparse";
import validator from "validator";
import axios from "axios";
import { Circles } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { getToken } from "../../auth/auth";
import "react-toastify/dist/ReactToastify.css";
import "./modal.css";

const GroupModal = ({ handleModal }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [validEmails, setValidEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalMails, setTotalMails] = useState("");

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    
    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // Set total number of rows
        setTotalMails(results.data.length);
        
        // Filter and process valid emails
        const processedEmails = results.data.reduce((validList, row) => {
          // Assuming CSV has columns 'Email Address' and 'Name'
          const email = row["Email Address"];
          const recipientName = row["Name"] || "";
          
          // Validate email
          if (validator.isEmail(email)) {
            validList.push({
              email: email,
              name: recipientName
            });
          }
          
          return validList;
        }, []);
        
        setValidEmails(processedEmails);
      },
    });
  };

  const handleSubmit = () => {
    const token = getToken();
    const config = {
      headers: { Authorization: token },
    };
    
    setIsLoading(true);
    axios
      .post(
        `http://localhost:3100/api/v1/user/addgroup`,
        {
          name: name,
          emails: validEmails, // Now sends array of {email, name} objects
        },
        config
      )
      .then((res) => {
        setFile(null);
        setName("");
        setIsLoading(false);
        handleModal(false);
        toast.success("Successfully added group", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        toast.error("Failed to add group", {
          position: "bottom-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <div className='modal-container'>
      <div className='modal-content'>
        <h2>Add Group</h2>
        <form>
          <div className='form-group'>
            <div className='text-box'>
              <label
                htmlFor='name'
                className='labels'
                style={{
                  marginTop: "-25px",
                }}
              >
                Group Name
              </label>
              <input
                type='text'
                id='name'
                placeholder='Enter your text here...'
                onChange={(e) => setName(e.target.value)}
                className='group-name'
              />
              <label
                className='labels-name'
                style={{ color: "#7d7d7d", fontSize: "13px" }}
              >
                This will be your new group name, Ex Newsletter.
              </label>
            </div>
            <label
              htmlFor='name'
              className='labels'
              style={{
                marginTop: "-25px",
              }}
            >
              Select File
            </label>
            <label htmlFor='file-upload' className='file-upload-label'>
              {file ? file.name : "Choose file"}
            </label>
            <label
              className='labels-name'
              style={{ color: "#7d7d7d", fontSize: "13px" }}
            >
              Select the CSV file that includes email addresses and names.
            </label>
            <input
              type='file'
              id='file-upload'
              accept='.csv'
              onChange={handleFileUpload}
              className='file-upload'
            />
          </div>

          {file ? (
            <div className='label-container'>
              <div className='label-grp'>
                <label className='lbl-count-valid'>{validEmails.length}</label>
                <label className='lbl-title'>Valid</label>
              </div>
              <div className='label-grp'>
                <label className='lbl-count-invalid'>
                  {totalMails - validEmails.length}
                </label>
                <label className='lbl-title'>Invalid</label>
              </div>
            </div>
          ) : (
            ""
          )}
          <div style={{ textAlign: "center" }}>
            <button
              type='button'
              className='cancel-button'
              onClick={() => handleModal(false)}
            >
              Cancel
            </button>
            <button
              type='button'
              className='submit-button'
              onClick={handleSubmit}
              disabled={!file || !name || isLoading}
            >
              {isLoading ? (
                <div className='submit-loading'>
                  <Circles
                    height='14'
                    width='14'
                    color='#fff'
                    ariaLabel='circles-loading'
                    wrapperStyle={{}}
                    wrapperClass=''
                    visible={true}
                  />
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer
        position='bottom-right'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
};

export default GroupModal;