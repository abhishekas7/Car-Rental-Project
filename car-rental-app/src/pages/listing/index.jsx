import React, { useEffect, useState } from 'react'

function index() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('/api/listing/listing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success)
          setListings(data.data);
      });
  }, []);

  return (
    // <div>{JSON.stringify(listings)}</div>
    <>
<div className="w-[1400px] mx-auto">  <h3 className='text-2xl font-bold mt-4 mb-4'>Listings</h3>
    <div>
      <div className=' border-2 '>
        ss
      </div>
    </div>
  </div>
    </>
  )
}

export default index