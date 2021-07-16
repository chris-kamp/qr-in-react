import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      <code>Search Form</code>
      <br />
      { businesses.map(business => (
        <>
          <h2>{business.name}</h2>
          <h3>{business.category.name}</h3>
          <p>{`${business.description.substr(0, 60)}...`}</p>
          <img src="https://placekitten.com/200/200" />

          <p>
            {business.address.street}&nbsp;
            {business.address.suburb.name}&nbsp;
            {business.address.postcode.code}&nbsp;
            {business.address.state.name}
          </p>

          <Link to={`/business/${business.id}`}>Know more</Link>
        </>
      )
      )}
    </div>
  )
}

export default Businesses
