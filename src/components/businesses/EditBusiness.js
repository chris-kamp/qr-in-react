import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
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

const EditBusiness = () => {
  const [categories, setCategories] = useState([])
  const [failureMessage, setFailureMessage] = useState()
  const [listingImgSrc, setListingImgSrc] = useState()
  const [businessData, setBusinessData] = useState()
  const [loadedCategories, setLoadedCategories] = useState(false)
  const [loadedBusiness, setLoadedBusiness] = useState(false)
  const [showWidget, setShowWidget] = useState()
  const history = useHistory()
  const { id } = useParams()
  const { session, dispatch } = useContext(stateContext)
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const watchManualAddress = watch("manualAddress", false)

  const onSubmit = (data) => {
    // Ensure user is logged in
    enforceLogin(
      "You must be logged in to create a business.",
      session,
      dispatch,
      history
    )

    // Get the user id from the current session
    data.business.user_id = session.user.id

    axios
      // Send the data to Rails API
      .patch(
        `${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`,
        // Data is encapsulated in a busines object, with business deconstructed and the listing_img_src included
        { business: { ...data.business, listing_img_src: listingImgSrc } },
        {
          headers: { Authorization: `Bearer ${session?.token}` },
        }
      )
      .then((response) => {
        flashNotice(dispatch, "Business updated successfully")
        setFailureMessage(null)
        // View the edited business with the ID returned from Rails
        history.push(`/businesses/${response.data.id}`)
      })
      .catch((error) => {
        // Display error messages - handles unauthorized, or other uncategorised error
        error.response?.status === 401
          ? flashError(
              dispatch,
              "You must be logged in as the business owner to edit a business listing."
            )
          : flashError(
              dispatch,
              "Something went wrong when attempting to edit the listing. Please try again shortly."
            )
      })
  }

  useEffect(() => {
    // Ensure user is logged in upon loading this page.
    if (
      enforceLogin(
        "You must be logged in to edit a business.",
        session,
        dispatch,
        history
      )
    )
      return

    // Load the available categories from Rails for selection display in the form.
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then((response) => {
        setCategories(response.data)
        setLoadedCategories(true)
      })
      .catch((err) => {
        setFailureMessage("Something went wrong. Please try again shortly.")
      })

    // Load the selected business information from Rails for editing.
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        if (response.data.user_id !== session.user.id) {
          // Ensure that only the owner of the business can make edits.
          flashError(
            dispatch,
            "You must be logged in as the business owner to edit a listing."
          )
          history.push("/")
          return
        }
        // Set business state variable to the retrieved business data.
        setBusinessData({
          ...response.data,
          address: {
            street: response.data.address.street,
            suburb: response.data.address.suburb.name,
            postcode: response.data.address.postcode.code,
            state: response.data.address.state.name,
          },
        })
        // Set the listing image to the retrieved business listing image.
        setListingImgSrc(response.data.listing_img_src)
        setLoadedBusiness(true)
      })
      // Redirect to home and display flash message error if business loading fails
      .catch(() => {
        flashError(
          dispatch,
          "Something went wrong. You may have tried to access a listing that doesn't exist."
        )
        history.push("/")
      })
  }, [dispatch, history, session, id, setValue])

  useEffect(() => {
    loadedCategories &&
      loadedBusiness &&
      businessData &&
      setValue("business", businessData)
  }, [businessData, setValue, loadedCategories, loadedBusiness])

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

  return (
    <>
    {/*
      Display once the business and categories have been successfully loaded.
    */}
      {loadedCategories && loadedBusiness ? (
        <FormContainer>
          <PageHeading>Edit Business</PageHeading>
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
              // Callback from the autocomplete component to set the address to
              //   the autocomplete result.
              addressCallback={(address) => {
                setValue("business.address", address)
              }}
            />
          )}

          <InputLabel text="Upload listing image" />
          <UploadButton showWidget={showWidget} text="Upload" />
          <ListingImg src={listingImgSrc} />

          {failureMessage && (
            <ErrorText>Business creation failed: {failureMessage}</ErrorText>
          )}
          <FormButtonGroup form="newBusinessForm" submitValue="Save business" />
        </FormContainer>
      ) : (
        <LoadingWidget />
      )}
    </>
  )
}

export default EditBusiness
