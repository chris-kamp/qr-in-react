import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Container, Heading, Content, Columns, Image, Card, Table, Tag } from 'react-bulma-components';
import QRCode from 'qrcode.react'
import { Rating } from "@material-ui/lab"
import { Button } from 'react-bulma-components';
import { stateContext } from "../../stateReducer";

const Business = () => {
  const context = useContext(stateContext);
  const { dispatch } = useContext(stateContext)
  const [business, setBusiness] = useState(false);
  const { id } = useParams();
  const history = useHistory()
  const isOwnBusiness = business.user_id == context.session?.user.id

  const deleteBusiness = () => {
    axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then(() => {
        dispatch({
          type: 'pushAlert',
          alert: {
            message: 'Business deleted',
            type: 'notice'
          }
        })

        history.push('/businesses')
      })
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then(response => {
        setBusiness(response.data);
      });
  }, []);

  return (
    <Container>
      {business && (
        <React.Fragment>
          <Heading className="has-text-centered">{business.name}</Heading>
          <Columns>
            <Columns.Column>
              <Image src='https://placekitten.com/666/666'></Image>
            </Columns.Column>
            <Columns.Column>
              <Content>
                {business.reviews.length > 0 && (
                  <React.Fragment>
                    <Heading size={5}>
                      <Tag rounded color='primary'>
                        {(business.reviews.reduce((a, b) => a + parseFloat(b.rating), 0) / business.reviews.length).toFixed(1)} ★
                      </Tag>
                      <span className="ml-5">({business.reviews.length} reviews)</span>
                    </Heading>
                    <Heading size={6}>
                      {business.checkins.filter(checkin => {
                        // 604800000 milliseconds === 1 week
                        return (new Date(checkin.created_at) > new Date() - 604800000)
                      }).length} checkins this week
                    </Heading>
                  </React.Fragment>
                  )}
              </Content>
              <Content>{business.description}
                <Heading size={6}>Address</Heading>
                <p>
                  {business.address?.street}
                , {business.address?.suburb.name}
                , {business.address?.postcode.code}
                , {business.address?.state.name}
                </p>
                <Link to={`/businesses/${business.id}/checkin`}>
                  <Button color='primary'>Checkin</Button>
                </Link>
              </Content>
            </Columns.Column>
            {isOwnBusiness && (
              <Columns.Column size='full' className='has-text-centered'>
                <QRCode
                  value={`${process.env.REACT_APP_SITE_URL}/businesses/${id}/checkin`}
                  level={'L'}
                />
                <Link to={`/promotions/`}>
                  <Button className='mx-5' color='success'>New Promotion</Button>
                </Link>
                <Link to={`/businesses/${id}/edit`}>
                  <Button className='mx-5' color='warning'>Edit Listing</Button>
                </Link>
                <Button onClick={() => {
                  if (window.confirm('Are you sure you want to delete this business?')) {
                    deleteBusiness()
                  }
                }} className='mx-5' color='danger'>Delete Listing</Button>
              </Columns.Column>
            )}
          </Columns>
          {business.checkins.length > 0 ? (
            <Card>
              <Card.Header.Title>Recent Check-ins</Card.Header.Title>
              <Card.Content>
                <Table className="is-fullwidth">
                  {business.checkins.map(checkin => (
                    <tr>
                      <td>
                        <Image size={64} rounded src="https://placekitten.com/64/64"></Image>
                      </td>
                      <td>
                          <span className="has-text-grey">{new Date(checkin.created_at).toLocaleString()}</span>
                          {checkin.review?.rating && (
                            <span className="is-pulled-right">
                              <Rating size='small' value={checkin.review?.rating} disabled />
                            </span>
                          )}
                          <br />
                          <b>{checkin.user.username}</b> checked in at <b>{business.name}</b>
                          {checkin.review?.content && (
                            <span> and left a review: "<i>{checkin.review.content}</i>"</span>
                          )}
                      </td>
                    </tr>
                    )
                  )}
                </Table>
              </Card.Content>
            </Card>
          ) : (
            <React.Fragment>
              <Heading className="has-text-centered" size={5}>No checkins</Heading>
              <Heading className="has-text-centered" size={6} subtitle>Be the first to review this business!</Heading>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Container>
  )
}

export default Business
