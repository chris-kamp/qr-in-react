import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import axios from "axios"
import { useForm } from "react-hook-form"
import { stateContext } from "../../stateReducer"
import FormContainer from "../shared/FormContainer"
import PageHeading from "../shared/PageHeading"
import InputLabel from "../shared/InputLabel"
import ErrorText from "../shared/ErrorText"
import FormButtonGroup from "../shared/FormButtonGroup"
import TextArea from "../shared/TextArea"
import { useParams } from "react-router-dom"
import { enforceLogin, flashError, flashNotice } from "../../utils/Utils"
import LoadingWidget from "../shared/LoadingWidget"

const NewPromotion = () => {
  const [loaded, setLoaded] = useState(false)
  const { session, dispatch } = useContext(stateContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  // Get business id from restful params
  const { id } = useParams()

  const history = useHistory()

  useEffect(() => {
    // Require user to be logged in. Redirect home and return to prevent unnecessary requests if they are not.
    if (
      enforceLogin(
        "You must be logged in to create a promotion.",
        session,
        dispatch,
        history
      )
    ) return

    // Get details of business to which the promotion relates
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        if (response.data.user_id !== session.user.id) {
          flashError(
            dispatch,
            "You must be logged in as the business owner to create a promotion."
          )
          history.push("/")
          return
        }
        setLoaded(true)
      })
      // Redirect to home and display flash message error if business does not exist or otherwise cannot be loaded
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong. You may have tried to access a listing that doesn't exist."
        )
        history.push("/")
      })
  }, [dispatch, history, session, id])

  // Callback to handle form submission
  const onSubmit = (data) => {
    // Set business_id of the promotion based on restful params
    data.promotion.business_id = id
    // Post promotion to backend API
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/promotions`,
        data,
        { headers: { Authorization: `Bearer ${session?.token}` } }
      )
      // Notify success and redirect back to business listing page
      .then((response) => {
        flashNotice(dispatch, "Promotion created successfully")
        history.push(`/businesses/${response.data.business_id}`)
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        error.response?.status === 401
          ? flashError(
              dispatch,
              "You must be logged in as the business owner to create a promotion."
            )
          : flashError(
              dispatch,
              "Something went wrong when attempting to create the promotion. Please try again shortly."
            )
      })
  }

  return (
    <>
    {/* Display loading widget until page is loaded */}
      {loaded ? (
        <FormContainer>
          <PageHeading>New Promotion</PageHeading>
          <form onSubmit={handleSubmit(onSubmit)} id="newPromotionForm" />
          <InputLabel
            htmlFor="promotion.description"
            text="Description"
            isFirst
          />
          <TextArea
            register={register}
            name="promotion.description"
            validator={{ required: true }}
            placeholder="Enter the details of your promotion"
            form="newPromotionForm"
            focus
          />
          {errors.promotion?.description && (
            <ErrorText>Invalid promotion description</ErrorText>
          )}

          <InputLabel htmlFor="promotion.end_date" text="End date" />
          <input {...register("promotion.end_date")} type="date" />

          <FormButtonGroup
            form="newPromotionForm"
            submitValue="Publish promotion"
          />
        </FormContainer>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default NewPromotion
