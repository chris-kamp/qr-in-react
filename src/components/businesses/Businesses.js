import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Container, Heading, Columns } from "react-bulma-components"
import BusinessCard from "./BusinessCard"
import BusinessSearchFilter from "./BusinessSearchFilter"
import { flashError } from "../../utils/Utils"
import { stateContext } from "../../stateReducer"
import LoadingWidget from "../shared/LoadingWidget"

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
          <Heading className="has-text-centered">Browse Businesses</Heading>
          <BusinessSearchFilter
            searchCallback={(data) => {
              setBusinesses(data)
            }}
          />
          <Columns>
            {businesses.length > 0 ? (
              businesses.map((business) => (
                <Columns.Column
                  desktop={{ size: "half" }}
                  tablet={{ size: "full" }}
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
        </Container>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default Businesses
