import { BsDoorClosed, BsSearch } from "react-icons/bs";
import { GiSofa } from "react-icons/gi";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";
import { filterByProperty } from "../../../utils/CommonFunctions";
import black_user from "../../../assets/blank_user.svg";
import UserCard from "../../../componets/ui-elements/UserCard";

const Couch = () => {
  const [couch, setCouch] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllCouch = async () => {
    try {
      const response = await makeApiCall("get", "sofa/allmember", null, "raw");
      console.log(response.data.data);
      const filterdCouch = filterByProperty(
        response.data.data,
        "is_deleted",
        false
      );
      console.log(filterdCouch);
      setCouch(filterdCouch);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCouch();
  }, []);

  const sortedData = couch
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchData = sortedData?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone_number.includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-auto m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0 ">
        <AddButton
          title={"Privilege Couch"}
          link={"/role/superadmin/couch/add-new"}
        />
        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start">
          <BsSearch />
          <input
            type="text"
            placeholder="Search privilege couch by name or phone"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full h-auto flex flex-col gap-2 items-center mb-24">
          <div className="w-full h-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 items-center mb-24">
            {searchData?.map((couch, i) => {
              return (
                <Link
                  // to={`/role/superadmin/couch/couch-info/${couch._id}`}
                  to={`/role/superadmin/couch/sofadetails/${couch._id}`}
                  className="w-full"
                  key={i}
                >
                  <UserCard
                    image={couch.profile_pic}
                    name={couch.name}
                    phoneNumber={couch.phone_number}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Couch;
