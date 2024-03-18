import React, { useState, useEffect, useRef } from "react";
import { makeApiCall } from "../../../api/Post";
import { MaterialReactTable } from "material-react-table";
import { formatDateToDDMMMYYYY } from "../../../utils/CommonFunctions";

const ServerLog = () => {
  const [serverLog, setServerLog] = useState();
  const tableRef = useRef();

  const timeFormat = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    let period = "AM";

    if (hours >= 12) {
      if (hours > 12) {
        hours -= 12;
      }
      period = "PM";
    }
    const formattedTime = ` ${hours}:${minutes}:${seconds} ${period}`;
    return formattedTime;
  };

  const serverLogData = async () => {
    try {
      const response = await makeApiCall("get", "user/serverlogs", null, "raw");
      console.log(response);
      if (response.data.status === 1) {
        const serverData = response.data.data;
        // setServerLog(response.data.data);
        const serverTable = serverData.map((log) => ({
          _id: log._id,
          date: formatDateToDDMMMYYYY(log.createdAt) + timeFormat(log.createdAt),
          message: log.message,
        }));
        setServerLog(serverTable);
      } else {
        console.log("No Data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    serverLogData();
  }, []);

  const columns = [
    {
      accessorKey: "date",
      header: "Date & Time",
      size: 30,
    },
    {
      accessorKey: "message",
      header: "Message",
      size: 50,
    },
  ];

  return (
    <div className="h-screen overflow-y-auto ">
      <div className="serverLog py-5 mx-4">
        <h3 className="text-xl font-semibold">Server Log</h3>
      </div>
      <div ref={tableRef}>
        <MaterialReactTable
          style={{ margin: "20px" }}
          columns={columns}
          data={serverLog || []}
          positionToolbarAlertBanner="bottom"
        />
      </div>
      <div className="h-14"></div>
    </div>
  );
};

export default ServerLog;
