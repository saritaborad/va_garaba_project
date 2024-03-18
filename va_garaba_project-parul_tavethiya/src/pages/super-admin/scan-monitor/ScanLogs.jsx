import React, { useEffect, useState, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { makeApiCall } from "../../../api/Post";
import defaultImage from "../../../assets/blank_user.svg";
import android from "../../../assets/android.svg";
import apple from "../../../assets/mac-os-logo.svg";
import windows from "../../../assets/windows2.png";

// ==========================

import { MaterialReactTable } from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";

// ==============================
import Loader from "../../../componets/ui-elements/Loader";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import { filterByProperty } from "../../../utils/CommonFunctions";

// import { filterByProperty } from "../../../utils/CommonFunctions";

const ScanLogs = () => {
  const [scanLogs, setScanLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isImageModel, setIsImageModel] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [userDetail, setUserDetail] = useState([]);
  const [isUserPopup, setIsUserPopup] = useState(false);
  const tableRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeApiCall("get", "guard/scanlogs", null, "raw");

      console.log(response);
      if (response.data.status === 1) {
        const filterData = response.data.data.map((scan) => ({
          //   id: scan._id,
          guard_name: scan.guard?.guard_name,
          guard_contact: scan.guard?.phone_number,
          status: scan.status ? scan.status : "---",
          user_id: scan._id,
          user_details: scan.user ? scan.user : null,
          user_name: scan.user?.name ? scan.user.name : "---",
          location_name: scan.location_name ? scan.location_name : "---",
          type: scan.type,
          time: scan.time,
          guard_avatar: scan.guard?.profile_pic,
          user_avatar: scan.user?.profile_pic,
          user_login: scan.user_login ? scan.user_login : null,
        }));
        // console.log(filterData, "Filter data")
        setScanLogs(filterData);
        setLoading(false);
      }
      setTimeout(() => {
        let mainDiv = tableRef?.current?.childNodes[0];
        mainDiv.style.borderRadius = "30px";
        mainDiv.childNodes[0].style.borderRadius = "30px";
        mainDiv.childNodes[0].childNodes[1].style["flex-wrap"] = "wrap-reverse";
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // const { data, isLoading, error } = useQuery("data", fetchData);

  useEffect(
    () => {
      fetchData();
      // console.log(data?.data?.data)
      // if (data) {
      //   console.log(data.data.data);
      // } else {
      //   console.log("Something went wrong");
      // }
    },
    [
      /* data, isLoading */
    ]
  );

  const handleImageModelClose = () => {
    setIsImageModel(false);
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  const columns = [
    //   {
    //     accessorKey: "id",
    //     header: "ID",
    //     size: 50,
    //   },
    {
      id: "guard", //id used to define `group` column
      header: "Guard",
      columns: [
        {
          accessorFn: (row) => `${row.guard_name}`, //accessorFn used to join multiple data into a single cell
          id: "profile_pic", //id is still required when using accessorFn instead of accessorKey
          header: "Guard",
          size: 250,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                onClick={() => handleOpenModel(row.original.guard_avatar)}
                alt="avatar"
                height={30}
                src={row.original.guard_avatar}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />
              {/* <p>{row.original.roles}</p> */}
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "guard_contact",
      header: "Guard Contact",
      size: 50,
    },
    {
      accessorKey: "location_name",
      header: "Guard location",
      size: 50,
    },
    {
      accessorKey: "status",
      header: "Scan Status",
    },
    {
      accessorKey: "user_name",
      header: "User Name",
      enableClickToCopy: true,
    },
    // {
    //   accessorKey: "user_contact",
    //   header: "User Contact",
    //   enableClickToCopy: true,
    // },
    {
      id: "user_id", //id used to define `group` column
      header: "User details",
      columns: [
        {
          header: "User details",
          size: 250,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="bg-black px-2 py-1 text-white rounded-sm"
              onClick={() => handleUserDetails(row.original.user_id)}
            >
              User details
            </button>
          ),
        },
      ],
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "time",
      header: "Time of scan",
    },
  ];

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  const handleUserDetails = (id) => {
    setIsUserPopup(true);
    const singleUser = filterByProperty(scanLogs, "user_id", id);
    // setSecurityDetail(singleOrder[0]);
    console.log(scanLogs);
    setUserDetail(singleUser[0]);
  };

  console.log(userDetail);

  return (
    <>
      {loading ? <Loader /> : null}
      <>
        {isImageModel ? (
          <ImageModel handleClose={handleImageModelClose} src={selectedImage} />
        ) : null}

        {scanLogs?.length > 0 ? (
          <div
            ref={tableRef}
            className="h-auto md:h-screen md:overflow-y-auto md:rounded-none md:m-0"
          >
            <MaterialReactTable
              style={{ margin: "20px" }}
              columns={columns}
              data={scanLogs}
              // enableRowSelection
              positionToolbarAlertBanner="bottom"
              // renderTopToolbarCustomActions={({ table }) => (
              //   <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 ">
              //     <button
              //       onClick={handleExportData}
              //       className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
              //     >
              //       <p className="text-white">
              //         {" "}
              //         <FileDownloadIcon sx={{ mr: 1 }} />
              //         Export All Data
              //       </p>
              //     </button>
              //     <button
              //       disabled={
              //         table.getPrePaginationRowModel().rows.length === 0
              //       }
              //       onClick={() =>
              //         handleExportRows(table.getPrePaginationRowModel().rows)
              //       }
              //       className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
              //     >
              //       <p className="text-white">
              //         {" "}
              //         <FileDownloadIcon sx={{ mr: 1 }} />
              //         Export All Rows
              //       </p>
              //     </button>
              //     <button
              //       onClick={() => handleExportRows(table.getRowModel().rows)}
              //       className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
              //       disabled={table.getRowModel().rows.length === 0}
              //     >
              //       <p className="text-white">
              //         <FileDownloadIcon sx={{ mr: 1 }} />
              //         Export Page Rows
              //       </p>
              //     </button>

              //     <button
              //       onClick={() =>
              //         handleExportRows(table.getSelectedRowModel().rows)
              //       }
              //       className={`flex justify-center bg-primary rounded-full px-4 py-2 w-full`}
              //       disabled={
              //         !table.getIsSomeRowsSelected() &&
              //         !table.getIsAllRowsSelected()
              //       }
              //     >
              //       <p className="text-white">
              //         <FileDownloadIcon sx={{ mr: 1 }} />
              //         Export Selected Rows
              //       </p>
              //     </button>
              //   </div>
              // )}
            />
          </div>
        ) : null}

        {isUserPopup ? (
          <div className="bg-[#00000080] h-screen w-full md:w-[83%] absolute top-0 z-50 flex items-center justify-center">
            <div className="bg-[#f2f2f2] md:max-h-2/4 md:w-2/4 w-3/4 max-h-3/4 h-auto rounded-md p-5 overflow-y-auto flex flex-col gap-5 items-start justify-start">
              <div className="flex items-center justify-between  text-lg cursor-pointer w-full ">
                <p className="font-medium">User Details</p>
                <span
                  onClick={() => setIsUserPopup(false)}
                  className="text-2xl"
                >
                  {" "}
                  &times;
                </span>
              </div>
              {userDetail.user_details === null ? null : (
                <div className="flex items-center justify-start gap-4 w-full">
                  <img
                    onClick={() =>
                      handleOpenModel(userDetail.user_details.profile_pic)
                    }
                    alt="avatar"
                    height={30}
                    src={userDetail.user_details.profile_pic}
                    loading="lazy"
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-md font-medium">
                      {userDetail.user_details.name}
                    </p>
                    <p className="tetx-md text-gray-600">
                      {userDetail.user_details.phone_number}
                    </p>
                  </div>
                </div>
              )}

              {userDetail.user_login === null ? null : (
                <div className="data w-full">
                  <div
                    className="info flex items-center py-2 gap-2 border-black border-t "
                    // style={{ boxShadow: "0px 0px 20px #0000002b" }}
                  >
                    <div className="image   rounded-xl">
                      <img
                        src={
                          userDetail.user_login?.android_device === true
                            ? android
                            : userDetail.user_login?.ios_device === true
                            ? apple
                            : windows
                        }
                        alt="image"
                        className="h-6 w-8"
                      />
                    </div>
                    <div className="name w-full">
                      <div className="nameinfo flex items-center">
                        <h2 className="text-sm font-medium">
                          {userDetail.user_login?.android_device === true
                            ? "Android"
                            : userDetail.user_login?.ios_device === true
                            ? "Apple"
                            : "Windows"}
                        </h2>
                        <p className="text-sm text-gray-400 ml-2">
                          / model :{" "}
                          <span>{userDetail.user_login?.device_modal}</span>
                        </p>
                        <p className="text-sm ms-auto">
                          V. {userDetail.user_login?.app_version}
                        </p>
                      </div>
                      {/* <p className="text-sm text-gray-400">
                      IP : <span>{userDetail.user_login?.user_ip}</span>
                    </p> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </>
      <div className="h-14 my-16"></div>
    </>
  );
};

export default ScanLogs;
