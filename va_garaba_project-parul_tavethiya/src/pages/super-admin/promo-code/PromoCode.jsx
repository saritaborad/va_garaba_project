import { BsTag, BsSearch } from "react-icons/bs";
import AddButton from "../../../componets/ui-elements/AddButton";
import InfoButton from "../../../componets/ui-elements/InfoButton";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { makeApiCall } from "../../../api/Post";

const PromoCode = () => {
  const [promoCode, setPromoCode] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const getAllPromoCode = async () => {
    try {
      const response = await makeApiCall(
        "get",
        "/promocode/all",
        null,
        "raw"
      );
      console.log(response);
      setPromoCode(response.data.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPromoCode();
  }, []);

  const SortedData = promoCode
    ?.slice()
    .sort((a, b) => a.promo_code.localeCompare(b.promo_code));
  const handleSearchChangeUnUsed = (event) => {
    setSearchQuery(event.target.value);
  };
  const SearchData = SortedData?.filter((item) =>
    item.promo_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="h-[92vh] m-[2px] p-[25px] bg-white rounded-[30px] mt-4 flex flex-col gap-[20px] md:h-screen md:overflow-y-auto md:rounded-none md:m-0">
        <AddButton
          title={"PromoCode"}
          link={"/role/superadmin/promocode/add-new"}
        />

        <div className="w-full p-4 rounded-xl bg-gray-200 flex items-center justify-start mb-3">
          <BsSearch />
          <input
            type="text"
            placeholder="Search promocode"
            className="h-full w-full ms-3 outline-none bg-gray-200"
            value={searchQuery}
            onChange={handleSearchChangeUnUsed}
          />
        </div>

        <div className="w-full h-auto flex flex-col gap-2 items-center">
          {SearchData ? (
            SearchData.length > 0 ? (
              SearchData?.map((promocode) => {
                return (
                  <Link
                    to={`/role/superadmin/promocode/${promocode._id}`}
                    className="w-full"
                    key={promoCode._id}
                  >
                    <InfoButton
                      icon={<BsTag className="text-xl" />}
                      title={promocode.promo_code}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-xl font-medium text-gray-400 mt-24">
                No Promocode Found
              </p>
            )
          ) : (
            <>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="h-[60px] w-full bg-gray-200 animate-pulse rounded-2xl"></div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PromoCode;
