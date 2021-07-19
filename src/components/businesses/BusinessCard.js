import { Link } from 'react-router-dom';
import { Card, Heading, Tag, Button } from 'react-bulma-components';
import React from 'react';


const BusinessCard = (props) => {
  const starRating = props.business.reviews.reduce((a, b) => a + parseFloat(b.rating), 0) / props.business.reviews.length
  return (
    <React.Fragment>
      <Card>
        <Card.Header.Title size={5}>
          {props.business.name}
          {starRating > 0 && (
            <Tag className="ml-auto" rounded color={'primary'}>
              { `${starRating} ★` }
            </Tag>
          )}
        </Card.Header.Title>
        <Card.Header.Title size={6}>{props.business.category.name}</Card.Header.Title>
        <Card.Content>{`${props.business.description.substr(0, 120)}...`}</Card.Content>
        <Card.Image src="https://placekitten.com/444/444" size={'square'}></Card.Image>
        <Card.Content className="is-size-7 is-uppercase has-text-weight-semibold">
          {props.business.address.street}
          , {props.business.address.suburb.name}
          , {props.business.address.postcode.code}
          , {props.business.address.state.name}
          <Link to={`/business/${props.business.id}`}>
            <Button className="is-pulled-right" size={'small'} color={'link'}>View</Button>
          </Link>
        </Card.Content>
      </Card>
    </React.Fragment>
  )
}

export default BusinessCard
