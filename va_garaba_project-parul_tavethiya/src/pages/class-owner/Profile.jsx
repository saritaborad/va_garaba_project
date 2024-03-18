import React, { useEffect, useState } from "react";
import {
  BsChevronLeft,
  BsFillGeoAltFill,
  BsClockHistory,
  BsImages,
  BsHeadset,
} from "react-icons/bs";
import { BiLogIn } from "react-icons/bi";
import { AiOutlineFileDone } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { SlLocationPin } from "react-icons/sl";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlinePrivacyTip,
  MdOutlineDelete,
} from "react-icons/md";
import black_user from "../../assets/blank_user.svg";
import { useQuery } from "react-query";
import { makeApiCall } from "../../api/Post";

const Profile = () => {
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    const response = await makeApiCall(
      "get",
      "user/info/",
      null,
      "raw"
    );
    return response;
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  useEffect(() => {
    if (isLoading === false) {
      console.log(data.data.data);
      setUserDetails(data.data.data);
    }
  }, [isLoading]);
  // localStorage.clear();

  const handleLogOut = async () => {
    try {
      const respone = await window.flutter_inappwebview.callHandler(
        "userLogout",
        "User Logout."
      );
      var isAppReady = false;
      window.addEventListener(
        "flutterInAppWebViewPlatformReady",
        function (event) {
          isAppReady = true;
        }
      );
      localStorage.clear();
    } catch (error) {
      alert(error);
    }
  };

  // const message = { action: 'buttonClicked' };
  // window.parent.postMessage(message, '*'); 

  return (
    <>
      <div className="ticketConfirmationPage">
        <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[40px]">
          <div className="userDetails border border-gray-400 rounded-2xl p-2 flex items-center">
            <div className="userImage h-16 w-20 rounded-full flex justify-center items-center overflow-hidden">
              <img
                src={
                  userDetails?.profile_pic
                    ? userDetails.profile_pic
                    : black_user
                }
                alt="image"
                className="h-full w-full object-cover"
              />
            </div>
            <Link to="/role/superadmin/edit-profile" className="w-full">
              <div className="userInfo flex">
                <div className="name ms-3">
                  <h3 className="text-xl font-medium">{userDetails?.name}</h3>
                  <p className="text-sm text-gray-400">
                    {userDetails?.phone_number}
                  </p>
                </div>

                <div className="rightArrow flex items-center ms-auto">
                  <MdOutlineKeyboardArrowRight className="text-2xl" />
                </div>
              </div>
            </Link>
          </div>

          <div className="userDetails border border-gray-400 rounded-2xl p-4 ">
            {/* <div className="location flex">
              <div className=" bg-[#20CA64] p-2 rounded-xl">
                <BsFillGeoAltFill className="text-xl text-white" />
              </div>
              <div className="text flex items-center w-full">
                <p className="ms-3 text-lg font-semibold">Vanue Map</p>
                <MdOutlineKeyboardArrowRight className="text-2xl ms-auto" />
              </div>
            </div> */}

            {/* <div className="gallery flex mt-5">
              <div className=" bg-[#FE385C] p-2 rounded-xl">
                <BsImages className="text-xl text-white" />
              </div>
              <div className="text flex items-center w-full">
                <p className="ms-3 text-lg font-semibold">Gallery</p>
                <MdOutlineKeyboardArrowRight className="text-2xl ms-auto" />
              </div>
            </div> */}

            <div className="transaction flex mt-5">
              <div className=" bg-[#3B9BF3] p-2 rounded-xl">
                <BsClockHistory className="text-xl text-white" />
              </div>
              <div className="text flex items-center w-full">
                <p className="ms-3 text-lg font-semibold">
                  Transaction History
                </p>
                <MdOutlineKeyboardArrowRight className="text-2xl ms-auto" />
              </div>
            </div>

            {/* <div className="support flex mt-5">
              <div className=" bg-[#FDBF21] p-2 rounded-xl">
                <BsHeadset className="text-xl text-white" />
              </div>
              <div className="text flex items-center w-full">
                <p className="ms-3 text-lg font-semibold">Support</p>
                <MdOutlineKeyboardArrowRight className="text-2xl ms-auto" />
              </div>
            </div> */}

            <Link to={"/role/classowner/terms-conditions"}>
              <div className="support flex mt-5">
                <div className=" bg-[#01C9DB] p-2 rounded-xl">
                  <AiOutlineFileDone className="text-xl text-white" />
                </div>
                <div className="text flex items-center w-full">
                  <p className="ms-3 text-lg font-semibold">
                    Terms & Conditions
                  </p>
                  <MdOutlineKeyboardArrowRight className="text-2xl ms-auto" />
                </div>
              </div>
            </Link>

            <Link to={"/role/classowner/privacy-plicy"}>
              <div className="support flex mt-5">
                <div className=" bg-[#BB2121] p-2 rounded-xl">
                  <MdOutlinePrivacyTip className="text-xl text-white" />
                </div>
                <div className="text flex items-center w-full">
                  <p className="ms-3 text-lg font-semibold">Privacy Policy </p>
                  <MdOutlineKeyboardArrowRight className="text-2xl ms-auto" />
                </div>
              </div>
            </Link>

          </div>

          <div className="logout flex justify-center items-center mb-24">
            <button
              className="text-white text-xl flex items-center bg-[#FE385C] w-full justify-center p-4 rounded-2xl"
              onClick={() => handleLogOut()}
            >
              Logout <BiLogIn className="text-white text-2xl ms-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
