import { useEffect, useState } from 'react';
import axios from 'axios';
import BusinessCard from './BusinessCard';
import BusinessSearchFilter from './BusinessSearchFilter';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses`)
      .then(response => {
        setBusinesses(response.data);
      });
  }, []);

  return (
    <div>
      <h1>Browse Businesses</h1>
      <BusinessSearchFilter />
      <br />
      { businesses.map(business => (
        <>
          <BusinessCard key={business.id} business={business} />
        </>
      )
      )}
    </div>
  )
}

export default Businesses
