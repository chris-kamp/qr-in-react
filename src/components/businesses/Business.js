import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Business = () => {
  const [business, setBusiness] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then(response => {
        setBusiness(response.data);
      });
  }, []);

  return (
    <div>
      <h1>Business</h1>
      { business &&
        <>
          <h2>{business.name}</h2>
          <p>{business.description}</p>

          <h3>Address</h3>
          <p>
            street: {business.address.street}
            <br />
            suburb: {business.address.suburb.name}
            <br />
            postcode: {business.address.postcode.code}
            <br />
            state: {business.address.state.name}
            <br />
          </p>

          <button>Check in</button>
        </>
      }
    </div>
  )
}

export default Business
