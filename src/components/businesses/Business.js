import React, { useState, useEffect, useContext } from "react"
import { useParams, useHistory } from "react-router"
import axios from "axios"
import PageHeading from "../shared/PageHeading"
import { Columns, Image, Tag, Button, Container, Section, Card, Table } from "react-bulma-components"
import { Rating } from "@material-ui/lab"
import { Link } from "react-router-dom"
import QRCode from "qrcode.react"
import { stateContext } from "../../stateReducer"
const Business = () => {
  const [business, setBusiness] = useState()
  const { session, dispatch } = useContext(stateContext)
  const { id } = useParams()
  const history = useHistory()

  const destroyBusiness = () => {
    axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`, {
      headers: { Authorization: `Bearer ${session?.token}` }
    })
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
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then(response => {
        setBusiness({
          ...response.data,
          starRating: (response.data.reviews.reduce((a, b) => a + parseFloat(b.rating), 0) / response.data.reviews.length).toFixed(1),
          reviewCount: response.data.reviews.length,
          weeklyCheckins: response.data.checkins.filter((checkin) => new Date(checkin.createed_at) > new Date() - 604800000).length,
          formattedAddress: `${response.data.address.street}, ${response.data.address.suburb.name}, ${response.data.address.postcode.code}, ${response.data.address.state.name}`
        })
      })
  }, [])

  return business ? (
    <div>
      <PageHeading>{business.name}</PageHeading>
      <Columns>
        <Columns.Column>
          <Image src="https://placekitten.com/g/666/666" />
        </Columns.Column>
        <Columns.Column>
          <Container>
            <span>
              {business.starRating > 0 && (
                <Tag rounded color='primary'>
                  {business.starRating} ★
                </Tag>
              )}
            </span>
            <span className="ml-2">
              {business.reviewCount > 0 && (
                <b>({business.reviewCount} reviews)</b>
              )}
            </span>
            <span>
              {business.weeklyCheckins > 0 && (
                <b>{business.weeklyCheckins} checkins this week</b>
              )}
            </span>
            <h3 className="is-size-4 has-text-centered">About Us</h3>
            <p>{business.description}</p>

            <br />

            <h3 className="is-size-5">Address</h3>
            <p>{business.formattedAddress}</p>

            <br />

            {business.active_promotions.length > 0 && (
              <React.Fragment>
                <h3 className="is-size-4 has-text-centered">Promotions</h3>
                {business.active_promotions.map((promotion) => {
                  return (
                    <p className="mb-2">
                      {promotion.description}
                      <br />
                      <b>Expires {new Date(promotion.end_date).toLocaleString()}</b>
                    </p>
                  )
                })}
              </React.Fragment>
            )}

            <br />

            <Link to={`/businesses/${business.id}/checkin`}>
              <Button color='primary'>Checkin</Button>
            </Link>
          </Container>
        </Columns.Column>
      </Columns>
      <Section>
        <Container className="is-flex is-flex-wrap-wrap is-justify-content-center">
          <Link to={`/businesses/${id}/promotions/new`}>
            <Button className='mx-5' color='success'>New Promotion</Button>
          </Link>
          <Link to={`/businesses/${id}/edit`}>
            <Button className='mx-5' color='warning'>Edit Listing</Button>
          </Link>
          <Button onClick={() => {
            if (window.confirm('Are you sure you want to delete this business?')) { destroyBusiness() }
          }} className='mx-5' color='danger'>Delete Listing</Button>
        </Container>
      </Section>
      <Section>
        <Container>
          <PageHeading>Recent Check-ins</PageHeading>
          {business.checkins.length > 0 ? (
            <Card>
              <Card.Content>
                <Table className="table is-fullwidth">
                  <tbody>
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
                  </tbody>
                </Table>
              </Card.Content>
            </Card>
          ) : (
            'No checkins'
          )}
        </Container>
      </Section>
    </div>
  ) : ('')
}

export default Business
