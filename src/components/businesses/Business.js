import React, { useEffect, useState, useContext } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import axios from "axios"
import PageHeading from "../shared/PageHeading"
import {
  Container,
  Heading,
  Button,
  Content,
  Columns,
  Tag,
  Section,
} from "react-bulma-components"
import QRCode from "qrcode.react"
import { stateContext } from "../../stateReducer"
import CheckinsSection from "../checkin/CheckinsSection"
import ListingImg from "./ListingImg"
import { enforceLogin, flashError, flashNotice } from "../../utils/Utils"
import LoadingWidget from "../shared/LoadingWidget"

const Business = () => {
  const { session, dispatch } = useContext(stateContext)
  const [business, setBusiness] = useState()
  const [loaded, setLoaded] = useState(false)
  const { id } = useParams()
  const history = useHistory()
  const [isOwnBusiness, setIsOwnBusiness] = useState(false)

  const destroyBusiness = () => {
    // Ensure user logged in can delete this business
    enforceLogin(
      "You must be logged in to delete a business.",
      session,
      dispatch,
      history
    )
    // Send a DELETE request to Rails with this business id.
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      })
      .then(() => {
        // Notify the user and redirect to the businesses index page.
        flashNotice(dispatch, "Business deleted")
        history.push("/businesses")
      })
      .catch(() => {
        // Notify the user of any errors.
        flashError(
          dispatch,
          "Something went wrong while attempting to delete the listing. Please try again shortly."
        )
      })
  }
  useEffect(() => {
    // Get the business data from Rails
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        // Set the state business to a deconstruction of the retrieved business data
        // Along with some calculated properties: starRating, reviewCount, weeklyCheckins, formattedAddress
        // to make it easier to display in the JSX later.
        setBusiness({
          ...response.data,
          starRating: (
            // Reduce to sum the reviews rating value, rounded to 1 decimal place.
            response.data.reviews.reduce(
              (a, b) => a + parseFloat(b.rating),
              0
            ) / response.data.reviews.length
          ).toFixed(1),
          reviewCount: response.data.reviews.length,
          weeklyCheckins: response.data.checkins.filter(
            // Checkins with a created date in the last 7 days.
            (checkin) => new Date(checkin.created_at) > new Date() - 604800000
          ).length,
          formattedAddress: `${response.data.address.street}, ${response.data.address.suburb.name}, ${response.data.address.postcode.code}, ${response.data.address.state.name}`,
        })
        // Set isOwnBusiness state when the business user_id is the same as the session's logged in user.
        setIsOwnBusiness(response.data.user_id === session?.user.id)
        // Finish loading.
        setLoaded(true)
      })
      // Redirect to home and display flash message error if business loading fails
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong. You may have tried to access a business listing that doesn't exist."
        )
        history.push("/")
      })
  }, [id, session, dispatch, history])

  return (
    <>
      {loaded ? (
        <Container>
          {business && (
            <React.Fragment>
              <PageHeading>{business.name}</PageHeading>
              <Columns>
                <Columns.Column>
                  <ListingImg src={business.listing_img_src} />
                </Columns.Column>
                <Columns.Column>
                  <Content>
                    {/* Hide review-related content if there are no reviews */}
                    {business.reviewCount > 0 && (
                      <React.Fragment>
                        <Heading size={5}>
                          <Tag rounded color="primary">
                            {business.starRating} ★
                          </Tag>
                          <span className="ml-5">
                            ({business.reviewCount} reviews)
                          </span>
                        </Heading>
                        <Heading size={6}>
                          {business.weeklyCheckins} checkins this week
                        </Heading>
                      </React.Fragment>
                    )}
                  </Content>
                  <Content>
                    <Heading size={4} className="has-text-centered">
                      About Us
                    </Heading>

                    {business.description}
                    <Heading size={6}>Address</Heading>
                    <p>{business.formattedAddress}</p>
                    <Link to={`/businesses/${business.id}/checkin`}>
                      <Button color="primary">Checkin</Button>
                    </Link>
                  </Content>
                  <Content>
                    {/* Hide promotions section when there are no active promotions. */}
                    {business.active_promotions.length > 0 && (
                      <React.Fragment>
                        <Heading size={4} className="has-text-centered">
                          Promotions
                        </Heading>
                        {/* Map through each promotion and display the details. */}
                        {business.active_promotions.map((promotion) => {
                          return (
                            <p className="mb-2" key={promotion.id}>
                              {promotion.description}
                              <br />
                              <b>
                                {/*
                                  Parse the end_date using JavaScripts toLocaleDateString() method
                                  to display in the user's format
                                */}
                                Valid until{" "}
                                {new Date(
                                  promotion.end_date
                                ).toLocaleDateString()}
                              </b>
                            </p>
                          )
                        })}
                      </React.Fragment>
                    )}
                  </Content>
                </Columns.Column>
                {/* Show additional buttons for the owner user. */}
                {isOwnBusiness && (
                  <Columns.Column size="full" className="has-text-centered">
                    {/* Show the QR Code to the business owner. */}
                    <QRCode
                      value={`${process.env.REACT_APP_SITE_URL}/businesses/${id}/checkin`}
                      level={"L"}
                    />
                    <Link to={`/businesses/${id}/promotions/new`}>
                      <Button className="mx-5" color="success">
                        New Promotion
                      </Button>
                    </Link>
                    <Link to={`/businesses/${id}/edit`}>
                      <Button className="mx-5" color="warning">
                        Edit Listing
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        if (
                          // Use a confirm prompt to confirm the delete action.
                          // If the user continues, the destroyBusiness() function will
                          //   delete the business.
                          window.confirm(
                            "Are you sure you want to delete this business?"
                          )
                        ) {
                          destroyBusiness()
                        }
                      }}
                      className="mx-5"
                      color="danger"
                    >
                      Delete Listing
                    </Button>
                  </Columns.Column>
                )}
              </Columns>
              <Section>
                <Container>
                  <PageHeading>Recent Check-ins</PageHeading>
                  <CheckinsSection checkins={business.checkins} />
                </Container>
              </Section>
            </React.Fragment>
          )}
        </Container>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default Business
