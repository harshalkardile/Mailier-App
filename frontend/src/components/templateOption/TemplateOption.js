import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../auth/auth";
import "./templateOption.css";

function TemplateOption({ handleTemplateOption }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const token = getToken();
    const config = {
      headers: { Authorization: token },
    };
    axios
      .get("http://localhost:3100/api/v1/user/viewtemplates", config)
      .then((res) => {
        setTemplates(res.data.templates);
      })
      .catch((err) => console.log(err));
  }, []);
 
  const stripHtmlTags = (htmlString) => {
    htmlString = htmlString.replace(/(\.[a-zA-Z0-9-_]+|{.*?})/g, "");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const words = textContent.split(/\s+/);
    return words.slice(0, 8).join(" ") + (words.length > 8 ? "..." : "");
  };

  return (
    <div>
      <div className="card-temp">
        <h2 className="card-temp-title">Select Template</h2>
        <div className="card-temp-image">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/006/685/711/small_2x/illustration-graphic-cartoon-character-of-email-services-free-vector.jpg"
            alt="Template option"
          />
        </div>
        <div className="card-temp-select">
          <label htmlFor="select-option">Select Option:</label>
          <select
            id="select-option"
            onChange={(event) => handleTemplateOption(event.target.value)}
          >
            <option value="none" title="No template selected">
              None
            </option>
            {templates.map((template) => (
              <option 
                key={template._id} 
                value={template._id} 
                title={template.name} // Display the name in the tooltip
              >
                {stripHtmlTags(template.name)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default TemplateOption;
