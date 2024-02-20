import React, { useEffect, useState } from "react";
import moment from "moment";
import Load from "./Loading";

function Page() {
  const [isNew, setIsNew] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [unRead, setUnRead] = useState();

  useEffect(() => {
    pageLoad()
  }, []);

  function pageLoad() {
    getUnread();
    getData();
    
  }

  function getData() {
    fetch("https://caring-heron-35.hasura.app/api/rest/getData", {
      headers: {
        "x-hasura-admin-secret":
          "OBIuDNuPiEECmWkC3pUORTsAZcZVIeQTo3so8YgYsbKG09gES7mZwxkNxuAyW4Wd",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.todos);
        setIsLoading(false);
        // console.log(res.todos);
      })
      .catch((err) => {
        console.log(err);
        alert("An error occured");
      });
  }

  function getUnread() {
    fetch("https://caring-heron-35.hasura.app/api/rest/getUnread", {
      headers: {
        "x-hasura-admin-secret":
          "OBIuDNuPiEECmWkC3pUORTsAZcZVIeQTo3so8YgYsbKG09gES7mZwxkNxuAyW4Wd",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        var data = res.todos;
        var len = data.length;
        console.log(len);
        if (len > 0) {
          setUnRead(len);
          console.log("Unread found!");
          setIsNew(true);
        } else {
          console.log("You're up to date!");
          setIsNew(false);
        }
      });
  }

  function addTask() {
    setIsLoading(true);
    var user_id = "1";
    var title = document.getElementById("input").value;

    const dataSend = {
      title,
      user_id,
    };

    console.log("dataSend : ", dataSend);

    fetch("https://caring-heron-35.hasura.app/api/rest/insertdata", {
      headers: {
        "x-hasura-admin-secret":
          "OBIuDNuPiEECmWkC3pUORTsAZcZVIeQTo3so8YgYsbKG09gES7mZwxkNxuAyW4Wd",
      },
      method: "POST",
      body: JSON.stringify(dataSend),
    })
      .then((res) => res.json())
      .then(() => {
        clearInput();
        getUnread()
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      addTask();
    }
  }

  function markRead() {
    fetch("https://caring-heron-35.hasura.app/api/rest/updatedata", {
      headers: {
        "x-hasura-admin-secret":
          "OBIuDNuPiEECmWkC3pUORTsAZcZVIeQTo3so8YgYsbKG09gES7mZwxkNxuAyW4Wd",
      },
    });
    pageLoad()
  }

  function clearInput() {
    document.getElementById("input").value = "";
  }

  return (
    <>
      <div className="page">
        <div className="slot"></div>
        <div className="slot">
          <div className="content">
            <p>Public feed (Real time)</p>
            <div className="box">
              <div className="input-box">
                <a onClick={addTask}>{">"}</a>
                <input
                  placeholder="input somethings"
                  id="input"
                  onKeyDown={handleKeyPress}
                />
              </div>
              {isNew == true ? (
                <>
                  <p className="new-todo" onClick={markRead}>
                    New tasks have arrived! ({unRead})
                  </p>
                </>
              ) : (
                ""
              )}

              <div className="todo-list">
                {data.map((q) => (
                  <div className="lists">
                    <div className="items">
                      <p className="time">
                        {moment(q.created_at).format("DD/MM/YYYY HH:mm")}
                      </p>
                      <p className="text">{q.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* <p className="new-todo"> </p> */}
            </div>
          </div>
        </div>
        <div className="slot"></div>
      </div>

      {isLoading == true ? <Load /> : ""}
    </>
  );
}

export default Page;
