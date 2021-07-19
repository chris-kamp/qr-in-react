import { Link } from 'react-router-dom';
import { Heading, Tag, Button } from 'react-bulma-components';
import 'bulma/css/bulma.min.css'
import React from 'react';


const BusinessCard = (props) => {
  const starRating = props.business.reviews.reduce((a, b) => a + parseFloat(b.rating), 0) / props.business.reviews.length
  return (
    <React.Fragment>
      <Heading size={5}>
        {props.business.name}
        {starRating > 0 && (
          <Tag rounded color={'link'}>
            { `${starRating} ★` }
          </Tag>
        )}
      </Heading>
      <h4>{props.business.category.name}</h4>
      <p>{`${props.business.description.substr(0, 120)}...`}</p>
      <img src="http://placekitten.com/200/200" alt={props.business.name} />
      <p>
        {props.business.address.street}
        , {props.business.address.suburb.name}
        , {props.business.address.postcode.code}
        , {props.business.address.state.name}
      </p>
      <Link to={`/business/${props.business.id}`}>
        <Button color={'primary'} outlined fullwidth>View</Button>
      </Link>
    </React.Fragment>
  )
}

export default BusinessCard
