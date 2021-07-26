import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Columns, Container, Heading } from "react-bulma-components"
import { stateContext } from "../../stateReducer"
import { flashError } from "../../utils/Utils"
import BusinessCardsSection from "../businesses/BusinessCardsSection"
import CheckinsSection from "../checkin/CheckinsSection"
import PromotionCardsSection from "../promotions/PromotionCardsSection"
import LoadingWidget from "../shared/LoadingWidget"
import PageHeading from "../shared/PageHeading"

const Home = () => {
  const [checkins, setCheckins] = useState([])
  const [checkinsLoaded, setCheckinsLoaded] = useState(false)
  const [businessesLoaded, setBusinessesLoaded] = useState(false)
  const [promotionsLoaded, setPromotionsLoaded] = useState(false)
  const [allLoaded, setAllLoaded] = useState(false)
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
        setCheckinsLoaded(true)
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
        setBusinessesLoaded(true)
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
        setPromotionsLoaded(true)
      })
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong while trying to access the list of checkins. Please try again shortly."
        )
      })
  }, [dispatch])

  useEffect(() => {
    setAllLoaded(businessesLoaded && promotionsLoaded && checkinsLoaded)
  }, [businessesLoaded, promotionsLoaded, checkinsLoaded])

  return (
    <>
    {allLoaded ? (
    <Container>
      <PageHeading>Home</PageHeading>
      <Columns>
        <Columns.Column size="full">
          <Heading size={4} className="has-text-centered">
            Popular Businesses
          </Heading>
        </Columns.Column>
        <BusinessCardsSection {...{businesses}} desktopSize="one-quarter" tabletSize="half" mobileSize="full" />
      </Columns>
      <Columns>
        <Columns.Column size="full">
          <Heading size={4} className="has-text-centered">
            Current Promotions
          </Heading>
        </Columns.Column>
        <PromotionCardsSection {...{promotions}} desktopSize="one-quarter" tabletSize="half" mobileSize="full" />
      </Columns>
      <Heading size={4} className="has-text-centered">
        Recent Checkins
      </Heading>
      <CheckinsSection {...{ checkins }} />
    </Container>
  ): (
    <LoadingWidget />
  )}
</>)
}

export default Home
