import React, { useEffect, useState } from "react";
import { getToken } from "../auth/auth";
import axios from "axios";

import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/navbar/Navbar";
import OverViewCard from "../components/overviewCard/OverViewCard";

function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    const token = getToken();
    const config = {
      headers: { Authorization: token },
    };
    axios
      .get("http://localhost:3100/api/v1/user/dashboard", config)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className='container'>
        <Sidebar />
        <Navbar />
        <section className='home'>
          <div style={{ marginTop: "100px" }}>
            <div className='overview_container'>
              <OverViewCard
                icon={"fa-solid fa-object-group"}
                number={data.groups}
                subtitle='Total Groups'
              />
              <OverViewCard
                icon={"fa-solid  fa-check"}
                number={data.sents}
                subtitle='Mails Delivered'
              />
              <OverViewCard
                icon={"fa-sharp fa-solid fa fa-pencil"}
                number={data.templates}
                subtitle='Templates designed'
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
