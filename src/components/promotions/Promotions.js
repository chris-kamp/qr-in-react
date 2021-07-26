import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Container, Heading, Columns } from "react-bulma-components"
import PromotionCard from "./PromotionCard"
import PageHeading from "../shared/PageHeading"
import { flashError } from "../../utils/Utils"
import { stateContext } from "../../stateReducer"
import LoadingWidget from "../shared/LoadingWidget"

const Promotions = () => {
  const [promotions, setPromotions] = useState([])
  const [loaded, setLoaded] = useState(false)
  const { dispatch } = useContext(stateContext)
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/promotions`)
      .then((response) => {
        setPromotions(response.data)
        setLoaded(true)
      })
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong while trying to access the list of promotions. Please try again shortly."
        )
      })
  }, [dispatch])

  return (
    <>
      {loaded ? (
        <Container>
          <PageHeading>Browse Promotions</PageHeading>
          <Columns>
            {promotions.length > 0 ? (
              promotions.map((promotion) => (
                <Columns.Column
                  desktop={{ size: "half" }}
                  tablet={{ size: "full" }}
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
        </Container>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default Promotions
