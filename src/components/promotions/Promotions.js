import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Container, Columns } from "react-bulma-components"
import PageHeading from "../shared/PageHeading"
import { flashError } from "../../utils/Utils"
import { stateContext } from "../../stateReducer"
import LoadingWidget from "../shared/LoadingWidget"
import PromotionCardsSection from "./PromotionCardsSection"

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
            <PromotionCardsSection
              {...{ promotions }}
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

export default Promotions
