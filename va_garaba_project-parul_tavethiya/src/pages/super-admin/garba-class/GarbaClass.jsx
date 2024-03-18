import React, { useRef } from "react";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import AddButton from "../../../componets/ui-elements/AddButton";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { useQuery } from "react-query";
import axios from "axios";
import { filterByProperty } from "../../../utils/CommonFunctions";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
import ImageModel from "../../../componets/ui-elements/ImageModel";
import black_user from "../../../assets/blank_user.svg";
import PrimaryButton from "../../../componets/ui-elements/PrimaryButton";
import Lottie from "lottie-react";
import logo from "../../../assets/newLogo.svg";
import CsvDownloadButton from "react-json-to-csv";
import completed from "../../../assets/lottie/completed.json";

import Select from "react-select";
import makeAnimated from "react-select/animated";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GarbaClass = () => {
  const navigate = useNavigate();
  const params = useParams();
  const classId = params.branchId;

  const [garbaClass, setGarbaClass] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef();
  const [isImageModel, setIsImageModel] = useState(false);
  const [selectdImage, setSelectedImage] = useState();
  const [garbaTable, setGarbaTable] = useState();
  const [garbaBranch, setGarbaBranch] = useState(false);
  const [branchDetail, setBranchDetail] = useState();
  const [csv, setCsv] = useState();
  const [csvFile, setCSVFile] = useState();
  const [branchId, setbranchId] = useState();
  const [branchList, setBranchList] = useState();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const [csvResponseData, setCsvResponseData] = useState();

  const animatedComponents = makeAnimated();

  const getAllGarbaClass = async () => {
    try {
      // Wait for the token to be retrieved from localStorage
      const response = await makeApiCall("get", "/garbaclass/all", null, "raw");
      if (response.data.status === 1) {
        const rawClass = response.data.data;
        if (rawClass != null) {
          const filterClass = filterByProperty(rawClass, "is_deleted", false);
          console.log(filterClass);
          setGarbaClass(filterClass);
          const tableGarbaClass = filterClass.map((garba) => ({
            _id: garba._id,
            garba_class_logo: garba.garba_class_logo,
            garba_classname: garba.garba_classname,
            ownerName: garba.owner.name,
            phone_number: garba.owner.phone_number,
            garbaArea: garba.garba_class_area,
            garbaAddress: garba.garba_class_address,
            garbaSince: garba.garba_class_since,
            garbaInstagramID: garba.instagram_id,
            garbaBranchList: garba.branch_list,
          }));
          console.log(tableGarbaClass);
          setGarbaTable(tableGarbaClass);
        } else {
          console.log("No garba class found");
        }
      }
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  // const { isLoading, error, data } = useQuery("classOwnerData", getAllGarbaClass);

  useEffect(() => {
    getAllGarbaClass();
  }, []);

  const sortedData = garbaClass
    ?.slice()
    .sort((a, b) => a.garba_classname.localeCompare(b.garba_classname));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter((item) =>
    item.garba_classname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      const data = {
        csv: csvFile,
        branch_id: branchId,
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await makeApiCall(
        "post",
        "user/importcsv",
        formData,
        "formdata"
      );
      // console.log(response.data);
      if (response.data.status === 1) {
        const {
          message,
          exists_data,
          mobileNumberNotFoundData,
          imported_data,
          changeNToPuserData,
        } = response.data;
        setStatus("complete");
        setSuccessMsg(
          <>
            <span>{message}</span>
            <br />
            <span>
              Fail Data: {[...exists_data, ...mobileNumberNotFoundData].length}
            </span>
            <br />
            <span>
              Successful Data:{" "}
              {[...imported_data, ...changeNToPuserData].length}
            </span>
          </>
        );
        setCsvResponseData(response.data);
      } else {
        setStatus("error");
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.warn(error);
      setStatus("error");
      setErrorMsg("Something went wrong");
    }
  };

  const handleClick = () => {
    if (csvFile && branchId) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all fields");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const columns = [
    {
      id: "user",
      header: "Garba Class",
      columns: [
        {
          accessorFn: (row) => `${row.garba_classname}`,
          id: "profile_pic",
          header: "User",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                alt="avatar"
                onClick={() => handleOpenModel(row.original.garba_class_logo)}
                height={30}
                src={row.original.garba_class_logo}
                loading="lazy"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                }}
              />

              <span>{renderedCellValue}</span>
            </Box>
          ),
        },
      ],
    },
    {
      accessorKey: "ownerName",
      header: "Owner name",
      size: 50,
    },
    {
      accessorKey: "phone_number",
      header: "Phone number",
      size: 50,
    },
    {
      accessorKey: "garbaArea",
      header: "Garba Class Area",
      size: 50,
    },
    {
      accessorKey: "garbaAddress",
      header: "Garba Class Address",
      size: 50,
    },
    {
      accessorKey: "garbaSince",
      header: "Since",
      size: 50,
    },
    {
      accessorKey: "garbaInstagramID",
      header: "Instagram ID",
      size: 50,
    },
    {
      id: "edit",
      columns: [
        {
          header: "Garba Branch List",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-rose-500 px-2 py-2 border border-rose-500 rounded-md"
              onClick={() => handleGarbaBranch(row.original._id)}
            >
              Garba Branch
            </button>
          ),
        },
      ],
    },
    {
      id: "CSV",
      columns: [
        {
          header: "CSV",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-blue-500 px-2 py-2 border border-blue-500 rounded-md"
              onClick={() => handleImportCSV(row.original._id)}
            >
              Import CSV
            </button>
          ),
        },
      ],
    },
    {
      id: "pending",
      columns: [
        {
          header: "Pending Student",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-orange-500 px-2 py-2 border border-orange-500 rounded-md"
              onClick={() => handlePendingStudent(row.original._id)}
            >
              Pending Student
            </button>
          ),
        },
      ],
    },
    {
      id: "active",
      columns: [
        {
          header: "Active Student",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-green-500 px-2 py-2 border border-green-500 rounded-md"
              onClick={() => handleActiveStudent(row.original._id)}
            >
              Active Student
            </button>
          ),
        },
      ],
    },
    {
      id: "garbaDetail",
      columns: [
        {
          header: "Garba Detail",
          size: 180,
          Cell: ({ renderedCellValue, row }) => (
            <button
              className="text-fuchsia-500 px-2 py-2 border border-fuchsia-500 rounded-md"
              onClick={() => handleGarbaDetail(row.original._id)}
            >
              Garba Detail
            </button>
          ),
        },
      ],
    },
  ];

  const handlePendingStudent = (id) => {
    navigate(`/role/superadmin/garba-class/student-list/${id}/pending`);
  };

  const handleActiveStudent = (id) => {
    navigate(`/role/superadmin/garba-class/student-list/${id}/active`);
  };

  const handleGarbaDetail = (id) => {
    navigate(`/role/superadmin/garba-class/${id}`);
  };

  const handleImportCSV = (id) => {
    const filterBranch = filterByProperty(garbaTable, "_id", id);
    const rawData = filterBranch[0]?.garbaBranchList?.map((branch) => ({
      label: branch.branch_name,
      value: branch._id,
    }));
    setBranchList(rawData);
    setCsv(true);
  };

  const handleGarbaBranch = (id) => {
    const filterBranch = filterByProperty(garbaTable, "_id", id);
    setBranchDetail(filterBranch[0]);
    setGarbaBranch(true);
  };

  const handleComplete = (download = false) => {
    if (!download) {
      // navigate(`/role/superadmin/garba-class/detail/${classId}`);
      setIsAlert(false);
      setCsv(false);
      console.log("Download");
      return;
    }
    const { exists_data, mobileNumberNotFoundData } = csvResponseData;
    const filterData = [...exists_data, ...mobileNumberNotFoundData].map(
      (student) => ({
        name: student.name ? student.name : "NULL",
        phone_number: student.phone_number ? student.phone_number : "NULL",
        birth_date: student.birth_date ? student.birth_date : "NULL",
        blood_group: student.blood_group ? student.blood_group : "NULL",
        gender: student.gender ? student.gender : "NULL",
        instagram_id: student.instagram_Id ? student.instagram_Id : "NULL",
        reason: student?.phone_number
          ? "Student already exists"
          : "Phone Number is missing",
      })
    );
    const keys = Object.keys(filterData[0]);
    const header = keys.join(",");

    const data = filterData
      .map((item) => {
        return Object.values(item).map((value) => (value ? `"${value}"` : ""));
      })
      .map((row) => row.join(","));

    const csv = [header, ...data].join("\n");
    if (csv) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const [fileName, fileType] = csvFile?.name?.split(".");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}-Error.${fileType}`;
      a.click();
      // navigate(`/role/superadmin/garba-class/detail/${classId}`);
      setIsAlert(false);
      setCsv(false);
    }
  };

  const handleOpenModel = (img) => {
    setSelectedImage(img);
    setIsImageModel(true);
  };

  return (
    <>
      {isAlert ? (
        <Model
          isOpen={isAlert}
          title="Are you sure?"
          text="You won't be able to revert this!"
          confirmButtonText="Submit"
          cancelButtonText="Cancel"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          status={status}
          confirmText={successMsg}
          errorText={errorMsg}
          onComplete={handleComplete}
          csvResponseData={csvResponseData}
          classId={classId}
        />
      ) : null}

      {isImageModel ? (
        <ImageModel
          src={selectdImage ? selectdImage : black_user}
          handleClose={() => setIsImageModel(false)}
        />
      ) : null}
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="w-full">
          <AddButton
            title={"Garba"}
            link={"/role/superadmin/garba-class/add-new"}
          />
        </div>
        <div className="md:hidden ">
          <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start gap-4">
            <BsSearch />
            <input
              type="text"
              placeholder="Search garba "
              className="h-full w-full outline-none bg-gray-200"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {searchData ? (
            searchData.length > 0 ? (
              searchData?.map((garba, i) => {
                return (
                  <Link
                    key={i}
                    to={`/role/superadmin/garba-class/detail/${garba._id}`}
                    className="w-full"
                  >
                    <div className="card bg-gray-100 flex items-start mt-4 gap-2 p-2 rounded-2xl ">
                      <div className="garbaClassLogo bg-white rounded-xl w-20 h-16 overflow-hidden">
                        <img
                          src={garba.garba_class_logo}
                          alt="logo"
                          className="h-full object-cover"
                        />
                      </div>
                      <div className="garbaInfo w-full flex flex-col justify-start  h-full">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {garba.garba_classname}
                        </h3>
                        <p className="text-gray-600">
                          Main owner : {garba.owner.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-xl text-center font-medium text-gray-400 mt-24 md:hidden">
                No Garba Class Found
              </p>
            )
          ) : (
            <>
              <div className="h-[80px] w-full bg-gray-200 animate-pulse rounded-2xl my-3"></div>
              <div className="h-[80px] w-full bg-gray-200 animate-pulse rounded-2xl my-3"></div>
              <div className="h-[80px] w-full bg-gray-200 animate-pulse rounded-2xl my-3"></div>
            </>
          )}
          <div className="h-16"></div>
        </div>

        <div ref={tableRef} className="hidden md:block">
          <MaterialReactTable
            style={{ margin: "20px" }}
            columns={columns}
            data={garbaTable || []}
            positionToolbarAlertBanner="bottom"
          />
        </div>
        <div className="h-14"></div>
      </div>

      {garbaBranch === true ? (
        <div className="bg-[#00000080] h-screen w-[87%] fixed top-0 z-50 flex items-center justify-center">
          <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">Garba Branch Details</p>
              <span onClick={() => setGarbaBranch(false)}> &times;</span>
            </div>
            <div>
              {branchDetail?.garbaBranchList?.map((branch, i) => {
                console.log(branch.branch_name);
                return (
                  <div className="garba border p-2 my-1 rounded-md " key={i}>
                    <div className=" flex items-start">
                      <p className="text-sm whitespace-nowrap text-gray-400 font-medium">
                        Branch Name :
                      </p>
                      <p className="mx-2">{branch.branch_name}</p>
                    </div>
                    <div className=" flex items-start">
                      <p className="text-sm whitespace-nowrap text-gray-400 font-medium">
                        Branch Area :
                      </p>
                      <p className="mx-2">{branch.branch_area}</p>
                    </div>
                    <div className=" flex items-start">
                      <p className="text-sm whitespace-nowrap text-gray-400 font-medium">
                        Branch Address :
                      </p>
                      <p className="mx-2">{branch.branch_address}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {csv === true ? (
        <div className="bg-[#00000080] h-screen w-[87%] fixed top-0 z-50 flex items-center justify-center">
          <div className="bg-[#f2f2f2] md:max-h-2/4 md:h-auto md:w-2/4 w-3/4 max-h-3/4 rounded-md p-5 overflow-y-auto pb-10">
            <div className="flex items-center justify-between  text-2xl cursor-pointer ">
              <p className="font-semibold">Import CSV</p>
              <span onClick={() => setCsv(false)}> &times;</span>
            </div>
            <div className="my-2 w-auto border border-gray-300 rounded-lg flex flex-col py-2 pl-2 h-full justify-center">
              <input
                type="file"
                className=" outline-none w-full placeholder:text-[14px] bg-transparent"
                placeholder={"Upload student data"}
                onChange={(e) => setCSVFile(e.target.files[0])}
                accept=".csv"
              />
            </div>
            <div className="w-full">
              <p className="text-[14px] font-semibold ms-1 mb-1">
                Select branch
              </p>
              <div className="authorizedNameInput h-full p-2 border border-gray-300 rounded-lg">
                <div className="authorizedName flex items-center h-full">
                  <Select
                    options={branchList}
                    components={animatedComponents}
                    name="branch"
                    placeholder="Select branch"
                    onChange={(e) => setbranchId(e.value)}
                    className="basic-multi-select h-full flex item-center bg-transparent"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-16 items-center justify-center w-full gap-3">
              <PrimaryButton
                background={"primary-button"}
                handleClick={handleClick}
                title={"Submit"}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default GarbaClass;

const Model = ({
  isOpen,
  title,
  text,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  onComplete,
  csvResponseData,
  status,
  confirmText,
  errorText,
}) => {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onConfirm && onConfirm();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <>
      <div className="fixed z-[99] top-0 left-0 h-screen w-full bg-[#000000ba] backdrop-blur-[4px] flex items-center justify-center transition duration-700 ease-in-out">
        <div
          className={`max-h-[300px] relative h-auto w-[330px] bg-white rounded-3xl flex flex-col items-center justify-center p-6 gap-5 ${
            isOpen ? "" : null
          } `}
        >
          <div
            className={` ${
              status === "loading" ? "hidden" : null
            } flex w-full items-center justify-end  text-2xl absolute top-2 right-5`}
            onClick={() => onComplete(false)}
          >
            &times;
          </div>
          <div className="absolute h-16 w-16 rounded-full text-3xl text-primary bg-white shadow-md top-[-32px] flex items-center justify-center overflow-hidden">
            {status === "loading" ? (
              <svg
                aria-hidden="true"
                className="inline w-12 h-12 text-primary animate-spin dark:text-primary fill-gray-400 dark:fill-gray-400"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : status === "complete" ? (
              <Lottie
                animationData={completed}
                loop={true}
                className="w-[50px]"
              />
            ) : status === "error" ? (
              <Lottie animationData={error} loop={true} className="w-[50px]" />
            ) : (
              // <BsFlower2 />
              <img src={logo} alt="logo" className="p-2" />
            )}
          </div>
          {status === "loading" ? (
            <p className="mt-5 font-semibold">Waiting ...</p>
          ) : status === "complete" ? (
            <>
              <div className="flex items-center w-full gap-3 justify-center mt-7">
                <p className="text-[20px] font-medium text-center">
                  {confirmText}
                </p>
              </div>
              <div className="flex  items-center justify-center w-full gap-3">
                {/* {([...[], ...[]].length) ? */}
                {[
                  // eslint-disable-next-line no-unsafe-optional-chaining, react/prop-types
                  ...csvResponseData?.exists_data,
                  // eslint-disable-next-line no-unsafe-optional-chaining, react/prop-types
                  ...csvResponseData?.mobileNumberNotFoundData,
                ].length ? (
                  <Button
                    handleClick={() => onComplete(true)}
                    title={"Download .CSV"}
                    background="bg-primary"
                    color="white"
                    border="border-transparent"
                  />
                ) : null}
                <Button
                  handleClick={() => onComplete(false)}
                  title={"Close"}
                  background="bg-white"
                  color="black"
                  border="border-primary"
                />
              </div>
            </>
          ) : status === "error" ? (
            <>
              {" "}
              <div className="flex items-center w-full gap-3 justify-center">
                <p className="text-[20px] font-medium mt-3 text-center">
                  {errorText}
                </p>
              </div>
              <div className="flex  items-center justify-center w-full gap-3">
                <Button
                  handleClick={handleCancel}
                  title={"Retry"}
                  background="bg-primary"
                  color="white"
                  border="border-transparent"
                />
              </div>
            </>
          ) : (
            <>
              {" "}
              <div className="flex items-center w-full gap-3 justify-center">
                <p className="text-[20px] font-medium mt-3 text-center">
                  {title}
                </p>
              </div>
              {text && (
                <div className="flex items-center w-full gap-3 justify-center">
                  <p className="text-[16px] mt-2">{text}</p>
                </div>
              )}
              <div className="flex items-center justify-center w-full gap-3">
                <Button
                  handleClick={handleConfirm}
                  title={confirmButtonText}
                  background="bg-primary"
                  color="white"
                  border="border-transparent"
                />
                <Button
                  handleClick={handleCancel}
                  title={cancelButtonText}
                  background="bg-white"
                  color="black"
                  border="border-primary"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export const Button = ({ handleClick, title, background, color, border }) => {
  return (
    <button
      onClick={handleClick}
      className={`flex justify-center ${background} border ${border} rounded-2xl px-10 py-4 w-full`}
    >
      <p className={`text-${color}`}>{title}</p>
    </button>
  );
};
