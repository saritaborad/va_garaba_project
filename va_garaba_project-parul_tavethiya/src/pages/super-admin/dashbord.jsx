import React, { useEffect, useState } from "react";
import { dashBordData } from "../../utils/dashBordData";
import { Link, useNavigate, useParams } from "react-router-dom";
import { makeApiCall } from "../../api/Post";
import { useQuery } from "react-query";
import { BsBellFill, BsSearch } from "react-icons/bs";
import blank_user from "../../assets/blank_user.svg";
import BotttmNavbar from "../../componets/BotttmNavbar";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { MdCurrencyRupee, MdEmojiEvents } from "react-icons/md";
// import {FaMoneyBill1Wave} from "react-icons/fa"
import { BsFillPersonFill, BsFillCreditCardFill } from "react-icons/bs";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const superAdmin = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventStatus, setSelectedEventStatus] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [userschartData, setUsersChartData] = useState(null);
  // const [PlayerPasschartData, setPlayerPassChartData] = useState({
  //   labels: [],
  //   datasets: [],
  // });
  const [PlayerPasschartData, setPlayerPassChartData] = useState();
  const [eventData, setEventData] = useState([]);
  const [eventStatus, setEventStatus] = useState([]);
  const [event, setEvent] = useState([]);
  const [totalUser, setTotalUser] = useState();
  const [totalGarba, setTotalGarba] = useState();

  const dummyData = [
    {
      id: 1,
      title: "Total tickets",
      price: "$ 65,254",
      icon: <MdCurrencyRupee />,
      time: "Jan - Apr, 2023",
    },
    {
      id: 2,
      title: "Number Of Transection",
      price: "4,523",
      icon: <BsFillCreditCardFill />,
      time: "Mar - Apr, 2023",
    },
    {
      id: 3,
      title: "Total User",
      price: totalUser,
      icon: <BsFillPersonFill />,
      time: "Feb - Apr, 2023",
    },
    {
      id: 4,
      title: "Total Garba Class",
      price: totalGarba,
      icon: <MdEmojiEvents />,
      time: "Jan - Apr, 2023",
    },
  ];

  const handleNavigate = (path) => {
    navigate("/role/superadmin" + path);
  };

  const fetchData = async () => {
    const userDataString = localStorage.getItem("user");
    const response = await makeApiCall("get", "user/info/", null, "raw");
    return response;
  };

  const garbaclassinfo = async (classID) => {
    const response = await makeApiCall(
      "get",
      "garbaclass/info/" + classID,
      null,
      "raw"
    );

    const male = response.data.data.branch_list[0].student_list.filter(
      (item) => item.gender == "male"
    ).length;
    const female = response.data.data.branch_list[0].student_list.filter(
      (item) => item.gender == "female"
    ).length;
    const activeStudentCounts =
      response.data.data.branch_list[0].student_list.filter(
        (item) => item.pass_list.is_completed === true
      ).length;

    return {
      male: male,
      female: female,
      activeStudentCounts: activeStudentCounts,
    };
  };

  const allstatus = async () => {
    const ticketsresponse = await makeApiCall(
      "get",
      "ticketcategory/statics",
      null,
      "raw"
    );
    setEvent(ticketsresponse.data.data);
    setEventStatus(Object.keys(ticketsresponse.data.data));

    const allUsersResponse = await makeApiCall(
      "get",
      "user/allusers",
      null,
      "raw"
    );

    console.log(allUsersResponse.data.data);
    setTotalUser(allUsersResponse.data.data.length);

    // Create an object to store unique roles and their counts
    const uniqueRolesCount = {};

    // Iterate through the dataset and count unique roles
    allUsersResponse.data.data.forEach((user) => {
      const roles = user.roles; // Replace 'roles' with the actual field name
      if (roles) {
        if (!uniqueRolesCount[roles]) {
          uniqueRolesCount[roles] = 1;
        } else {
          uniqueRolesCount[roles]++;
        }
      }
    });

    // Extract unique user labels and their counts
    const labels = Object.keys(uniqueRolesCount);
    const data = Object.values(uniqueRolesCount);

    // Function to generate a random color
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16
      )}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`;
    }

    // Generate random colors for the chart
    const backgroundColor = labels.map(() => getRandomColor());

    // Create the chart data
    const chartData = {
      labels,
      datasets: [
        {
          label: "User Counts",
          data,
          backgroundColor,
          borderColor: backgroundColor.map((color) =>
            color.replace("0.2", "1")
          ),
          borderWidth: 1,
        },
      ],
    };

    setUsersChartData(chartData);

    const allGarbaGarbaResponse = await makeApiCall(
      "get",
      "/garbaclass/all",
      null,
      "raw"
    );

    const garba_classes = allGarbaGarbaResponse.data.data;
    setTotalGarba(allGarbaGarbaResponse.data.data.length);

    if (garba_classes) {
      const studentCounts = garba_classes.map(
        (garba) => garba.branch_list[0].student_list.length
      );

      const students = await Promise.all(
        garba_classes.map(async (garba) => await garbaclassinfo(garba._id))
      );

      const PasschartData = {
        labels: garba_classes.map((garba) => garba.garba_classname),
        datasets: [
          {
            label: "Total Student",
            data: studentCounts,
            borderColor: "rgb(255,0,255)",
            backgroundColor: "rgb(255,0,255, 0.5)",
          },
          {
            label: "Active Student",
            data: students.map((student) => student.activeStudentCounts),
            borderColor: "rgb(50,205,50)",
            backgroundColor: "rgb(50,205,50,0.5)",
          },
          {
            label: "Male Student",
            data: students.map((student) => student.male),
            borderColor: "rgb(0,191,255)",
            backgroundColor: "rgb(0,191,255,0.5)",
          },
          {
            label: "Female Student",
            data: students.map((student) => student.female),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };

      setPlayerPassChartData(PasschartData);
    }
  };

  const { isLoading, error, data } = useQuery("classOwnerData", fetchData);

  // Function to get the data for the selected event
  const getEventDataForEvent = (event_id) => {
    const selectedEventData = eventData.find(
      (item) => item.eventDetails._id === event_id
    );

    if (selectedEventData) {
      // Create chart data for the selected event
      const chartData = {
        labels: selectedEventData.ticketDetails.map(
          (ticket) => ticket.ticket_name
        ),
        datasets: [
          {
            label:
              selectedEventData.eventDetails.event_name +
              " - DAY" +
              selectedEventData.eventDetails.event_day,
            data: selectedEventData.ticketDetails.map(
              (ticket) => ticket.total_qty
            ),
            backgroundColor: selectedEventData.ticketDetails.map(
              (ticket) =>
                `rgb(${parseInt(ticket.color_code) & 0xff},${
                  (parseInt(ticket.color_code) & 0xff00) >> 8
                },${(parseInt(ticket.color_code) & 0xff0000) >> 16})`
            ),
          },
        ],
      };
      return chartData;
    }
    return null;
  };

  useEffect(() => {
    if (isLoading === false) {
      setUserDetails(data.data.data);
    }
    allstatus();
  }, [isLoading]);

  // When the selected event changes, update the chart data
  useEffect(() => {
    if (selectedEventStatus) {
      setEventData(event[selectedEventStatus]);
      setChartData(null);
    }

    if (selectedEventStatus && selectedEvent) {
      const chartData = getEventDataForEvent(selectedEvent);
      setChartData(chartData);
    }
  }, [selectedEvent, selectedEventStatus]);

  const sortedData = dashBordData
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="adminPanel h-auto w-full md:h-screen md:overflow-y-auto md:m-0 ">
        <div className="shadow-md bg-white px-6 py-4 h-auto items-center flex justify-between w-full md:my-4 md:rounded-lg">
          <div className="flex items-center gap-4 w-full">
            <div className="avtar flex items-center justify-center overflow-hidden h-14 w-14 rounded-full ">
              <img
                src={
                  userDetails?.profile_pic
                    ? userDetails.profile_pic
                    : blank_user
                }
                alt="image"
                className={` ${
                  userDetails?.profile_pic ? null : "animate-pulse"
                }`}
              />
            </div>
            <div>
              {userDetails ? (
                <h1 className="text-lg text-black font-semibold ">
                  {userDetails.name}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
              {userDetails ? (
                <h1 className="text-sm text-gray-500 font-light capitalize">
                  {userDetails.roles}
                </h1>
              ) : (
                <div className="h-[28px] bg-gray-200 rounded-sm w-full animate-pulse"></div>
              )}
            </div>
          </div>

          <Link to="/role/superadmin/notification-page">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-full shadow-sm relative">
              <BsBellFill className="text-white text-xl" />
              {userDetails?.notifications.length > 0 ? (
                <div className="bg-primary absolute h-4 w-4 rounded-full top-[-5px] right-0 flex items-center justify-center text-[10px] text-white">
                  {userDetails?.notifications.length}
                </div>
              ) : null}
            </div>
          </Link>
        </div>

        <div className="bg-menu md:hidden">
          <div className="adminData mx-3 py-5">
            <div className="w-full p-4 rounded-xl bg-white flex items-center justify-start gap-4">
              <BsSearch />
              <input
                type="text"
                placeholder="Search item"
                className="h-full w-full outline-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="dashboardText pt-5 ms-2">
              <h1 className="text-2xl font-semibold">Dashboard</h1>
            </div>
            <div className="grid grid-cols-2 mb-24 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {searchData?.map((data, i) => {
                return (
                  <div
                    className="bg-white p-4 rounded-2xl mt-5 mx-2 h-40"
                    style={{ boxShadow: "0px 0px 20px #0000001b" }}
                    key={i}
                    onClick={() => handleNavigate(data.path)}
                  >
                    <div className="garbaImage bg-gray-200 rounded-2xl w-[70px] h-14 flex justify-center items-center p-3">
                      {/* <img src={data.image} alt="image" />*/}
                      {<data.image className="text-3xl text-primary" />}
                    </div>
                    <div className="garbaText mt-3">
                      <h1 className="text-lg font-semibold">{data.title}</h1>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* start from here */}
        <div className="hidden md:inline-block w-full py-5">
          <div className="grid grid-cols-4 gap-2 px-2">
            {dummyData.map((data) => {
              return (
                <Card
                  title={data.title}
                  icon={data.icon}
                  price={data.price}
                  time={data.time}
                />
              );
            })}
          </div>

          <div className="select m-3">
            <h1 className="text-2xl font-semibold">Event Ticket Sales</h1>
            <select
              className="selectEvent bg-[#343c49] text-white rounded-lg p-3 my-3 outline-none cursor-pointer"
              onChange={(e) => {
                setSelectedEventStatus(e.target.value);
                setSelectedEvent(null);
              }}
            >
              <option value="">Select an Event Status</option>
              {eventStatus &&
                eventStatus.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
            </select>

            {selectedEventStatus && (
              <select
                className="selectEvent bg-[#343c49] text-white rounded-lg p-3 my-3 mx-3 outline-none cursor-pointer"
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <option value="">Select an Event</option>
                {eventData &&
                  eventData.map((event) => (
                    <option
                      key={event.eventDetails._id}
                      value={event.eventDetails._id}
                    >
                      {event.eventDetails.event_name +
                        " - DAY" +
                        event.eventDetails.event_day}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div className="w-full grid grid-cols-3 gap-4 px-3">
            {chartData ? (
              <div
                className="h-full w-full p-2 rounded-lg"
                style={{ boxShadow: "0px 0px 20px #0000002b" }}
              >
                {chartData && (
                  <>
                    <h1 className="text-lg font-semibold">Event Ticket Data</h1>
                    <div className="h-auto w-full overflow-y-auto">
                      <div className="h-auto w-full bg-white p-4 rounded-md">
                        <Bar data={chartData} className="chart" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-[440px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
            )}

            {PlayerPasschartData ? (
              <div
                className="h-full w-full p-2 rounded-lg"
                style={{ boxShadow: "0px 0px 20px #0000002b" }}
              >
                {PlayerPasschartData && (
                  <>
                    <h1 className="text-lg font-semibold">
                      All Pass Users Data
                    </h1>
                    <div className="h-auto w-full overflow-y-auto">
                      <div className="h-auto w-full bg-white p-4 rounded-md">
                        <Line data={PlayerPasschartData} className="chart" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-[440px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
            )}

            {userschartData ? (
              <div
                className="h-full w-full p-2 rounded-lg"
                style={{ boxShadow: "0px 0px 20px #0000002b" }}
              >
                {userschartData && (
                  <>
                    <h1 className="text-lg font-semibold">Total User</h1>
                    <Doughnut data={userschartData} className="chart" />
                  </>
                )}
              </div>
            ) : (
              <div className="h-[440px] w-full bg-gray-200 animate-pulse rounded-lg"></div>
            )}
          </div>
        </div>
      </div>
      <BotttmNavbar />
    </>
  );
};

export default superAdmin;

const Card = ({ title, price, time, icon }) => {
  return (
    <div
      className="w-full flex p-4 items-center justify-between max-h-40 h-auto bg-white rounded-md"
      style={{ boxShadow: "0px 0px 20px #0000001b" }}
    >
      <div className="h-20 w-20 rounded-full bg-black flex items-center justify-center text-white text-4xl">
        {icon}
      </div>
      <div className="flex flex-col items-end justify-center">
        <p className="text-[16px] capitalize">{title}</p>
        <p className="text-[28px] font-semibold">{price}</p>
        <p className="text-[15px] capitalize">{time}</p>
      </div>
    </div>
  );
};
