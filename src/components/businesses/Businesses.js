import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BusinessCard from './BusinessCard';
import BusinessSearchFilter from './BusinessSearchFilter';
import { Container, Heading, Columns } from 'react-bulma-components';

const Businesses = () => {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses`)
      .then(response => {
        setBusinesses(response.data);
      });
  }, []);

  return (
    <Container>
      <Heading className="has-text-centered">Browse Businesses</Heading>
      <BusinessSearchFilter />
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
    </Container>
  )
}

export default Businesses
