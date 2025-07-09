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
    <div>{JSON.stringify(listings)}</div>
  )
}

export default index