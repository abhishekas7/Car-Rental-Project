import SideModalForm from "@/components/SideModalForm";
import React, { useEffect, useState } from "react";
import { BiSolidCheckCircle } from "react-icons/bi";
import { MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";

function Index({ carlistings, pagination }) {
  const router = useRouter();
  const page = parseInt(router.query.page || pagination.page || 1);
  const [listings, setListings] = useState(carlistings);
  const [totalPages, setTotalPages] = useState(pagination.totalPages);

  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  
  useEffect(() => {
    setListings(carlistings);
    setTotalPages(pagination.totalPages);
  }, [carlistings, pagination.totalPages]);

  const onHandleChangeStatus = async (itemid, itemstatus) => {
    try {
      const res = await fetch("/api/listing/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemid, status: itemstatus }),
      });

      const data = await res.json();

      if (data.success) {
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === itemid ? { ...listing, status: itemstatus } : listing
          )
        );
      } else {
        console.error("Update failed:", data.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const EditCarDetails = (id) => {
    const selected = listings.find((item) => item.id === id);
    setSelectedListing(selected);
    setShowModal(true);
  };

  const onHandleEditCarDetails = async (updatedData) => {
    await fetch(`/api/listing/${selectedListing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    setShowModal(false);
    setSelectedListing(null);
    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === selectedListing.id
          ? { ...listing, ...updatedData }
          : listing
      )
    );
  };

  const goToPage = (newPage) => {
    router.push(`/listing?page=${newPage}`);
  };

  return (
    <>
      <div className="w-[1400px] mx-auto">
        <h3 className="text-2xl font-bold mt-4 mb-4">Cars Listings</h3>

        <div className="grid grid-cols-2 gap-4">
          {listings.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 hover:border-amber-400 rounded-lg p-4 mb-4"
            >
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <img
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Car"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
                <div className="col-span-10">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-4">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-md">{item.description}</p>
                      <p className="text-gray-600">Location: {item.location}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {item.status === "rejected" ? (
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
                      <p className="text-gray-400 text-xs">Created: {item.created_at}</p>
                    </div>
                    <div className="col-span-2 grid-cols-4">
                      <div className="flex justify-around mt-[25px]">
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
                        <MdOutlineEdit
                          size={24}
                          color="grey"
                          onClick={() => EditCarDetails(item.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => goToPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="absolute w-3xl">
          <SideModalForm
            listing={selectedListing}
            onSubmit={(formData) => onHandleEditCarDetails(formData)}
          />
        </div>
      )}
    </>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const { page = 1 } = context.query;
  const limit = 5;

  const res = await fetch(`http://localhost:3001/api/listing/listing?page=${page}&limit=${limit}`);
  const data = await res.json();

  return {
    props: {
      carlistings: data.success ? data.data : [],
      pagination: data.pagination || { page: 1, totalPages: 1 },
    },
  };
}
