import React, { useEffect, useState } from "react";
import { BiSolidCheckCircle } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";

function index() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("/api/listing/listing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setListings(data.data);
      });
  }, []);

  const onHandleChangeStatus = async (itemid, itemstatus) => {
    try {
      const res = await fetch('/api/listing/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemid, status: itemstatus }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === itemid
              ? { ...listing, status: itemstatus }
              : listing
          )
        );
      } else {
        console.error('Update failed:', data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const EditCarDetails = () =>{
    
  }
  

  return (
    // <div>{JSON.stringify(listings)}</div>
    <>
      <div className="w-[1400px] mx-auto">
        <h3 className="text-2xl font-bold mt-4 mb-4">Listings</h3>

        <div className="grid grid-cols-2 gap-4">
          {listings.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Car"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>

                <div className="col-span-10">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4">
                      <div>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-gray-600">
                          Location: {item.location}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                         {item.status ===  "rejected" ? (
                            <span className="text-red-500">
                              <BiSolidCheckCircle className="inline-block mr-1" />
                              {item.status}
                            </span>
                          ) : (
                            <span className="text-green-500">
                              <BiSolidCheckCircle className="inline-block mr-1" />
                              {item.status}
                            </span>
                          )}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Created: {item.created_at}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 grid-cols-4">
<div className="flex justify-around">
<div className="mt-[25px]">
<button
  onClick={() =>
    onHandleChangeStatus(
      item.id,
      item.status === "rejected" ? "approved" : "rejected"
    )
  }
  className={
    item.status === "rejected"
      ? "bg-green-500 text-white px-4 py-2 rounded w-[100px]"
      : "bg-red-500 text-white px-4 py-2 rounded w-[100px]"
  }
>
  {item.status === "rejected" ? "Approve" : "Reject"}
</button>
</div>
<div>
<MdOutlineEdit size={24} color="grey" onClick={()=>{EditCarDetails()}}/>
  </div>
  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default index;
