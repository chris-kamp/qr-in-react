import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BusinessCard from './BusinessCard';
import { Heading, Columns } from 'react-bulma-components';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses`)
      .then(response => {
        setBusinesses(response.data);
      });
  }, []);

  return (
    <React.Fragment>
      <Heading className="has-text-centered">Browse Businesses</Heading>
      <Columns>
        {businesses.map(business => (
          <Columns.Column
            desktop={{
              size: 'half'
            }}
            tablet={{
              size: 'full'
            }}
            key={business.id}
          >
            <BusinessCard key={business.id} business={business}></BusinessCard>
          </Columns.Column>
        ))}
      </Columns>
    </React.Fragment>
  )
}

export default Businesses
