import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import InputField from "../../../../componets/ui-elements/InputField";
import PrimaryButton from "../../../../componets/ui-elements/PrimaryButton";
import ImageUpload from "../../../../componets/ui-elements/ImageUpload";
import Alert from "../../../../componets/ui-elements/Alert";
import { makeApiCall } from "../../../../api/Post";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { filterByProperty, handleNumberValidate } from "../../../../utils/CommonFunctions";
import { dashBordData } from "../../../../utils/dashBordData";
import PhoneNumberInput from "../../../../componets/ui-elements/PhoneNumberInput";
import { withStyles } from "@mui/material";

const NewJudge = () => {

  const [judgeName, setJudgeName] = useState();
  const [gender, setGender] = useState();
  const [bloodGroup, setBloodGroup] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [profilePic, setProfilePic] = useState();
  const [DisplayProfilePic, setDisplayProfilePic] = useState();

  const navigate = useNavigate();

  const [status, setStatus] = useState("start");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [isAlert, setIsAlert] = useState(false);

  const animatedComponents = makeAnimated();

  const maxFileSize = 9 * 1024 * 1024; // 9mb
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    setProfilePic(file);
    if (file && file.size < maxFileSize) {
      const reader = new FileReader();
      setFileSizeExceeded(false);
      reader.onloadend = () => {
        const base64String = reader.result;
        setDisplayProfilePic(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFileSizeExceeded(true);
    }
  };

  const handleConfirm = async () => {
    setStatus("loading");
    try {
      console.log("judge", judgeName)
      const data = {
        judge_name: judgeName,
        judge_blood_group: bloodGroup,
        judge_phone_number: phoneNo,
        judge_photo: profilePic,
        judge_gender: gender
      };

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log("fromdata", formData)
      const response = await makeApiCall(
        "post",
        "judge/createjudge",
        formData,
        "formdata"
      );
      console.log(response);
      if (response.data.status === 1) {
        setStatus("complete");
        setSuccessMsg(response.data.message);
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
    if (judgeName && phoneNo && gender && bloodGroup) {
      setIsAlert(true);
      setStatus("start");
    } else {
      setIsAlert(true);
      setErrorMsg("Please fill all field");
      setStatus("error");
    }
  };

  const handleCancel = () => {
    setIsAlert(false);
    setStatus("start");
  };

  const handleComplete = () => {
    navigate("/role/superadmin/judgedashboard/judge");
  };

  const genderData = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const bloodGroupData = [
    { value: "A+", label: "A Positive (A+)" },
    { value: "A-", label: "A Negative (A-)" },
    { value: "B+", label: "B Positive (B+)" },
    { value: "B-", label: "B Negative (B-)" },
    { value: "O+", label: "O Positive (O+)" },
    { value: "O-", label: "O Negative (O-)" },
    { value: "AB+", label: "AB Positive (AB+)" },
    { value: "AB-", label: "AB Negative (AB-)" },
  ];

  const handleNumberChange = async (e) => {
    const inputValue = e.target.value;

    // Remove non-numeric characters
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Limit the number to 10 digits
    if (numericValue.length <= 10) {
      setPhoneNo(numericValue)
      const isExist = await handleNumberValidate(numericValue);
      if (isExist && isExist.data.status == 1) {
        // switch (isExist.data.data.roles) {
        //   case "superadmin":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "garbaclassowner":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "classowner":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "p-user":
        //     setIsAlert(true);
        //     setStatus("error");
        //     setErrorMsg(
        //       `User already exists as a ${isExist.data.data.roles}. Try with another number.`
        //     );
        //     break;
        //   case "n-user":
        //     console.log(e.target.value, "Contact number");
        //     setPhoneNo(e.target.value);
        //     break;
        //   default:
        //     setPhoneNo(e.target.value);
        //     break;
        // }
        if (isExist.data.data.roles === "n-user") {
          console.log(e.target.value, "Contact number");
          setPhoneNo(e.target.value);
        } else {
          setIsAlert(true);
          setStatus("error");
          setErrorMsg(
            `User already exists as a ${isExist.data.data.roles}. Try with another number.`
          );
        }
      } else {
        setPhoneNo(e.target.value);
      }
    }
  };

  return (
    <>
      {isAlert ? (
        <Alert
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
        />
      ) : null}
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[100px] justify-start md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <div className="flex flex-col gap-[25px] justify-start items-center">
          <div className="eventImage flex flex-col gap-3 justify-center items-center ">
            <div className="authorizedPersonAvtar">
              <ImageUpload
                id={"file"}
                handleChange={(e) => handleFileChange(e, "image")}
                source={DisplayProfilePic}
                heading={"Image"}
                height={"h-auto min-h-56"}
                label={DisplayProfilePic ? "Replace image" : "Upload image"}
              // handleDelete={()=>handleDelete("landscap")}
              />
              {fileSizeExceeded && (
                <p className="error text-red-500">
                  File size exceeded the limit of 9 mb
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <InputField
              type="text"
              placeholder={`Judge Name`}
              inputPlaceholder={"Enter Judge name"}
              value={judgeName}
              handleChange={(e) => setJudgeName(e.target.value)}
              disabled={false}
            />
          </div>

          <div className="w-full">
            <PhoneNumberInput value={phoneNo} handleChange={handleNumberChange} />
          </div>

          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Blood Group</p>
            <div className="authorizedNameInput w-full p-2 h-14 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={bloodGroupData}
                  components={animatedComponents}
                  placeholder="Select Blood Group"
                  name="bloodgroup"
                  onChange={(e) => {
                    setBloodGroup(e.value);
                  }}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>

          <div className="text w-full">
            <p className="text-[14px] font-semibold ms-1 mb-1">Gender</p>
            <div className="authorizedNameInput w-full p-2 h-14 border border-gray-300 rounded-lg">
              <div className="authorizedName flex items-center h-full">
                <Select
                  options={genderData}
                  components={animatedComponents}
                  placeholder="Select Gender"
                  name="gender"
                  onChange={(e) => {
                    setGender(e.value);
                  }}
                  className="basic-multi-select h-full flex item-center bg-transparent"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-24">
          <PrimaryButton
            background={"primary-button"}
            handleClick={handleClick}
            title={"Submit"}
          />
        </div>
      </div>
    </>
  );
};

export default NewJudge;
