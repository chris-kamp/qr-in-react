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
  Image,
  Tag,
  Section,
} from "react-bulma-components"
import QRCode from "qrcode.react"
import { stateContext } from "../../stateReducer"
import CheckinsSection from "../checkin/CheckinsSection"
import ListingImg from "./ListingImg"
const Business = () => {
  const { session, dispatch } = useContext(stateContext)
  const [business, setBusiness] = useState(false)
  const { id } = useParams()
  const history = useHistory()
  const [isOwnBusiness, setIsOwnBusiness] = useState(false)
  const destroyBusiness = () => {
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`, {
        headers: { Authorization: `Bearer ${session?.token}` },
      })
      .then(() => {
        dispatch({
          type: "pushAlert",
          alert: {
            message: "Business deleted",
            type: "notice",
          },
        })

        history.push("/businesses")
      })
      .catch((err) => {
        console.error(err)
      })
  }
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        setBusiness({
          ...response.data,
          starRating: (
            response.data.reviews.reduce(
              (a, b) => a + parseFloat(b.rating),
              0
            ) / response.data.reviews.length
          ).toFixed(1),
          reviewCount: response.data.reviews.length,
          weeklyCheckins: response.data.checkins.filter(
            (checkin) => new Date(checkin.created_at) > new Date() - 604800000
          ).length,
          formattedAddress: `${response.data.address.street}, ${response.data.address.suburb.name}, ${response.data.address.postcode.code}, ${response.data.address.state.name}`,
        })
        setIsOwnBusiness(response.data.user_id === session?.user.id)
      })
  }, [id, session])

  return (
    <Container>
      {business && (
        <React.Fragment>
          <PageHeading>{business.name}</PageHeading>
          <Columns>
            <Columns.Column>
              <ListingImg business={business} />
            </Columns.Column>
            <Columns.Column>
              <Content>
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
                {business.active_promotions.length > 0 && (
                  <React.Fragment>
                    <Heading size={4} className="has-text-centered">
                      Promotions
                    </Heading>
                    {business.active_promotions.map((promotion) => {
                      return (
                        <p className="mb-2" key={promotion.id}>
                          {promotion.description}
                          <br />
                          <b>
                            Expires{" "}
                            {new Date(promotion.end_date).toLocaleString()}
                          </b>
                        </p>
                      )
                    })}
                  </React.Fragment>
                )}
              </Content>
            </Columns.Column>
            {isOwnBusiness && (
              <Columns.Column size="full" className="has-text-centered">
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
  )
}

export default Business
