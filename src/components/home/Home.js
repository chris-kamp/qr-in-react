import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Columns, Container, Heading, Image } from "react-bulma-components"
import { stateContext } from "../../stateReducer"
import { flashError } from "../../utils/Utils"
import BusinessCard from "../businesses/BusinessCard"
import CheckinsSection from "../checkin/CheckinsSection"
import PromotionCard from "../promotions/PromotionCard"
import PageHeading from "../shared/PageHeading"

const Home = () => {
  const [checkins, setCheckins] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [promotions, setPromotions] = useState([])
  const { dispatch } = useContext(stateContext)

  // Retrieve most recent 10 checkins
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/checkins`, {
        params: {
          limit: 10,
        },
      })
      .then((response) => {
        setCheckins(response.data)
      })
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong while trying to access the list of checkins. Please try again shortly."
        )
      })
  }, [dispatch])

  // Retrieve 4 businesses
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses`, {
        params: {
          limit: 4,
        },
      })
      .then((response) => {
        setBusinesses(response.data)
      })
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong while trying to access the list of businesses. Please try again shortly."
        )
      })
  }, [dispatch])

  // Retrieve 4 promotions
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/promotions`, {
        params: {
          limit: 4,
        },
      })
      .then((response) => {
        setPromotions(response.data)
      })
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong while trying to access the list of promotions. Please try again shortly."
        )
      })
  }, [dispatch])

  return (
    <Container>
      <PageHeading>Home</PageHeading>
      <Columns>
        <Columns.Column size="full">
          <Heading size={4} className="has-text-centered">
            Popular Businesses
          </Heading>
        </Columns.Column>
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <Columns.Column
              desktop={{ size: "one-quarter" }}
              tablet={{ size: "half" }}
              mobile={{ size: "full" }}
              key={business.id}
            >
              <BusinessCard
                key={business.id}
                business={business}
              ></BusinessCard>
            </Columns.Column>
          ))
        ) : (
          <Columns.Column size={"full"}>
            <Heading size={4}>No Businesses Found</Heading>
          </Columns.Column>
        )}
      </Columns>
      <Columns>
        <Columns.Column size="full">
          <Heading size={4} className="has-text-centered">
            Current Promotions
          </Heading>
        </Columns.Column>
        {promotions.length > 0 ? (
          promotions.map((promotion) => (
            <Columns.Column
              desktop={{ size: "one-quarter" }}
              tablet={{ size: "half" }}
              mobile={{ size: "full" }}
              key={promotion.id}
            >
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                business={promotion.business}
              ></PromotionCard>
            </Columns.Column>
          ))
        ) : (
          <Columns.Column size={"full"}>
            <Heading size={4}>No Promotions Found</Heading>
          </Columns.Column>
        )}
      </Columns>
      <Heading size={4} className="has-text-centered">
        Recent Checkins
      </Heading>
      <CheckinsSection {...{ checkins }} />
    </Container>
  )
}

export default Home
