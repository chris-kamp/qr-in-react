import { Link } from 'react-router-dom'
import { Card, Tag, Button } from 'react-bulma-components'
import React from 'react'
import CardListingImg from '../businesses/CardListingImg'

const PromotionCard = (props) => {
  // Calculate average rating based on business's reviews
  const starRating = (props.business?.reviews?.reduce((a, b) => a + parseFloat(b.rating), 0) / props.business.reviews.length).toFixed(1)
  return (
    <React.Fragment>
      <Card>
        <Card.Header.Title size={5}>
          {props.business.name}
          {starRating > 0 && (
            <Tag className="ml-auto" rounded color={'primary'}>
              {`${starRating} ★`}
            </Tag>
          )}
        </Card.Header.Title>
        <Card.Header.Title size={6}>{props.business?.category?.name}</Card.Header.Title>
        <Card.Content>{`${props.promotion.description.substr(0, 240)}...`}</Card.Content>
        <CardListingImg src={props.promotion.business.listing_img_src} />
        <Card.Content className="is-size-7 is-clearfix is-uppercase has-text-weight-semibold">
          {props.business.address?.street}
          , {props.business.address?.suburb.name}
          , {props.business.address?.postcode.code}
          , {props.business.address?.state.name}
          <Link to={`/businesses/${props.business.id}`}>
            <Button className="is-pulled-right" size={'small'} color={'link'}>View</Button>
          </Link>
        </Card.Content>
      </Card>
    </React.Fragment>
  )
}

export default PromotionCard
