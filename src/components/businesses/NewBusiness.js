import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import axios from "axios"
import { useForm } from "react-hook-form"
import { stateContext } from "../../stateReducer"
import LocationAutocomplete from "./LocationAutocomplete"
import { enforceLogin, flashError, flashNotice } from "../../utils/Utils"
import FormContainer from "../shared/FormContainer"
import PageHeading from "../shared/PageHeading"
import InputLabel from "../shared/InputLabel"
import Input from "../shared/Input"
import ErrorText from "../shared/ErrorText"
import TextArea from "../shared/TextArea"
import Select from "../shared/Select"
import FormButtonGroup from "../shared/FormButtonGroup"
import Checkbox from "../shared/Checkbox"
import {
  createImgWidget,
  getImgWidgetOpener,
} from "../../utils/CloudinaryWidgets"
import ListingImg from "./ListingImg"
import LoadingWidget from "../shared/LoadingWidget"
import UploadButton from "../shared/UploadButton"

const NewBusiness = () => {
  const [categories, setCategories] = useState([])
  const [failureMessage, setFailureMessage] = useState()
  const [listingImgSrc, setListingImgSrc] = useState()
  const [loaded, setLoaded] = useState()
  const [showWidget, setShowWidget] = useState()
  const history = useHistory()
  const { session, dispatch } = useContext(stateContext)
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const watchManualAddress = watch("manualAddress", false)

  useEffect(() => {
    const widget = createImgWidget(
      window,
      dispatch,
      session,
      setListingImgSrc
    )
    setShowWidget(getImgWidgetOpener(widget, session, dispatch))
    return () => {
      widget.destroy()
    }
  }, [dispatch, session])

  const onSubmit = (data) => {
    // Ensure user is logged in
    enforceLogin(
      "You must be logged in to create a business.",
      session,
      dispatch,
      history
    )

    // Send the data to Rails API
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/businesses`,
        { business: { ...data.business, user_id: session.user.id, listing_img_src: listingImgSrc } },
        {
          headers: { Authorization: `Bearer ${session?.token}` },
        }
      )
      .then((response) => {
        flashNotice(dispatch, "Business created successfully")
        setFailureMessage(null)
        // View the business with the ID returned from Rails
        history.push(`/businesses/${response.data.id}`)
      })
      .catch((err) => {
        // Display the errors to the user
        flashError(
          dispatch,
          "Errors: " +
            Object.keys(err.response.data.errors)
              .map((k) => `${k}: ${err.response.data.errors[k].join(", ")}`)
              .join(", ")
        )
      })
  }

  useEffect(() => {
    enforceLogin(
      "You must be logged in to create a business.",
      session,
      dispatch,
      history
    )

    // Load the available categories from Rails for selection display in the form.
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then((response) => {
        setCategories(response.data)
        setLoaded(true)
      })
      .catch((err) => {
        setFailureMessage("Something went wrong. Please try again shortly.")
      })
  }, [dispatch, history, session])

  return (
    <>
      {loaded ? (
        <FormContainer>
          <PageHeading>Create Business</PageHeading>
          <form onSubmit={handleSubmit(onSubmit)} id="newBusinessForm" />
          <InputLabel htmlFor="business.name" text="Name" isFirst />
          <Input
            register={register}
            validator={{ required: true }}
            name="business.name"
            placeholder="Your Business"
            form="newBusinessForm"
            focus
          />
          {errors.business?.name && (
            <ErrorText>Invalid business name</ErrorText>
          )}

          <InputLabel htmlFor="business.description" text="Description" />
          <TextArea
            register={register}
            validator={{ required: true }}
            name="business.description"
            placeholder="A description of your business."
            form="newBusinessForm"
          />
          {errors.business?.description && (
            <ErrorText>Invalid business description</ErrorText>
          )}

          <InputLabel htmlFor="business.category_id" text="Category" />
          <Select
            register={register}
            validator={{ required: true }}
            name="business.category_id"
            options={categories}
            optionKeyField="id"
            optionLabelField="name"
            form="newBusinessForm"
          />
          {errors.business?.category && <ErrorText>Invalid category</ErrorText>}

          <InputLabel />
          <Checkbox
            register={register}
            name="manualAddress"
            labelText="Enter address manually"
            type="checkbox"
            form="newBusinessForm"
          />

          {/*
            Using a watcher to determine if a checkbox has been checked.
            Displaying either an autocomplete address finder using the Google API
            or several text fields for each attribute to the user.
          */}

          {watchManualAddress ? (
            <React.Fragment>
              <InputLabel
                htmlFor="business.address.street"
                text="Street address"
              />
              <Input
                register={register}
                validator={{ required: true }}
                name="business.address.street"
                placeholder="123 Coder St"
                form="newBusinessForm"
              />
              {errors.business?.address?.street && (
                <ErrorText>Invalid street</ErrorText>
              )}

              <InputLabel
                htmlFor="business.address.suburb"
                text="City or suburb"
              />
              <Input
                register={register}
                validator={{ required: true }}
                name="business.address.suburb"
                placeholder="Brisbane City"
                form="newBusinessForm"
              />
              {errors.business?.address?.suburb && (
                <ErrorText>Invalid suburb</ErrorText>
              )}

              <InputLabel
                htmlFor="business.address.postcode"
                text="Postal code"
              />
              <Input
                register={register}
                validator={{ required: true }}
                name="business.address.postcode"
                placeholder="4000"
                form="newBusinessForm"
              />
              {errors.business?.address?.postcode && (
                <ErrorText>Invalid postcode</ErrorText>
              )}

              <InputLabel htmlFor="business.address.state" text="State" />
              <Input
                register={register}
                validator={{ required: true }}
                name="business.address.state"
                placeholder="QLD"
                form="newBusinessForm"
              />
              {errors.business?.address?.state && (
                <ErrorText>Invalid state</ErrorText>
              )}
            </React.Fragment>
          ) : (
            <LocationAutocomplete
              addressCallback={(address) => {
                setValue("business.address", address)
              }}
            />
          )}

          <InputLabel text="Upload listing image" />
          <UploadButton showWidget={showWidget} text="Upload" />
          <p>Preview:</p>
          <ListingImg src={listingImgSrc} />

          {failureMessage && (
            <ErrorText>Business creation failed: {failureMessage}</ErrorText>
          )}
          <FormButtonGroup
            form="newBusinessForm"
            submitValue="Create business"
          />
        </FormContainer>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default NewBusiness
