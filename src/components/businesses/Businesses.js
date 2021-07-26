import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Container, Columns } from "react-bulma-components"
import BusinessSearchFilter from "./BusinessSearchFilter"
import { flashError } from "../../utils/Utils"
import { stateContext } from "../../stateReducer"
import LoadingWidget from "../shared/LoadingWidget"
import PageHeading from "../shared/PageHeading"
import BusinessCardsSection from "./BusinessCardsSection"

const Businesses = () => {
  const [businesses, setBusinesses] = useState([])
  const [loaded, setLoaded] = useState(false)
  const { dispatch } = useContext(stateContext)
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses`)
      .then((response) => {
        setBusinesses(response.data)
        setLoaded(true)
      })
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong while trying to access the list of businesses. Please try again shortly."
        )
      })
  }, [dispatch])

  return (
    <>
      {loaded ? (
        <Container>
          <PageHeading className="has-text-centered">
            Browse Businesses
          </PageHeading>
          <BusinessSearchFilter
            searchCallback={(data) => {
              setBusinesses(data)
            }}
          />
          <Columns>
            <BusinessCardsSection
              {...{ businesses }}
              desktopSize="half"
              tabletSize="full"
              mobileSize="full"
            />
          </Columns>
        </Container>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default Businesses
