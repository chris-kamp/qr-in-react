import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import axios from "axios"
import { useForm } from "react-hook-form"
import { stateContext } from "../../stateReducer"
import LocationAutocomplete from "./LocationAutocomplete"
import { enforceLogin } from "../../utils/Utils"
import FormContainer from "../shared/FormContainer"
import PageHeading from "../shared/PageHeading"
import InputLabel from "../shared/InputLabel"
import Input from "../shared/Input"
import { ErrorText } from "../../styled-components/FormStyledComponents"
import TextArea from "../shared/TextArea"
import Select from "../shared/Select"
import FormButtonGroup from "../shared/FormButtonGroup"
import Checkbox from "../shared/Checkbox"
import {
  createListingImgWidget,
  getProfileImgWidgetOpener,
} from "../../utils/CloudinaryWidgets"
import ListingImg from "./ListingImg"
import { Button } from "react-bulma-components"

const EditBusiness = () => {
  const [categories, setCategories] = useState([])
  const [failureMessage, setFailureMessage] = useState()
  const [listingImgSrc, setListingImgSrc] = useState()
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
  const widget = createListingImgWidget(
    window,
    dispatch,
    session,
    setListingImgSrc
  )
  const showWidget = getProfileImgWidgetOpener(widget, session, dispatch)

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

    // Send the data to Rails API
    axios
      .patch(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`, {business: {...data.business, listing_img_src: listingImgSrc}}, {
        headers: { Authorization: `Bearer ${session?.token}` },
      })
      .then((response) => {
        console.debug(response)

        dispatch({
          type: "pushAlert",
          alert: {
            message: "Business updated successfully",
            type: "notice",
          },
        })

        setFailureMessage(null)

        // View the business with the ID returned from Rails
        history.push(`/businesses/${response.data.id}`)
      })
      .catch((err) => {
        // Display the errors to the user
        dispatch({
          type: "pushAlert",
          alert: {
            message: JSON.stringify(err.response.data),
            type: "error",
          },
        })
      })
  }

  useEffect(() => {
    enforceLogin(
      "You must be logged in to create a business.",
      session,
      dispatch,
      history
    )

    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then((response) => {
        setCategories(response.data)
      })
      .catch((err) => {
        setFailureMessage("Something went wrong. Please try again shortly.")
      })

    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        setValue("business", {
          ...response.data,
          address: {
            street: response.data.address.street,
            suburb: response.data.address.suburb.name,
            postcode: response.data.address.postcode.code,
            state: response.data.address.state.name,
          },
        })
        setListingImgSrc(response.data.listing_img_src)
      })
  }, [dispatch, history, session, id, setValue])

  return (
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
      {errors.business?.name && <ErrorText>Invalid business name</ErrorText>}

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
        labelText="Manual address"
        type="checkbox"
        form="newBusinessForm"
      />

      {watchManualAddress ? (
        <React.Fragment>
          <InputLabel htmlFor="business.address.street" text="Street address" />
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

          <InputLabel htmlFor="business.address.suburb" text="City or suburb" />
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

          <InputLabel htmlFor="business.address.postcode" text="Postal code" />
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
      <Button
        className="button has-background-primary-dark has-text-white has-text-weight-bold mx-auto mt-2 mb-2"
        style={{ borderRadius: "0.6rem", display: "block" }}
        onClick={showWidget}
      >
        Upload
      </Button>
      <ListingImg src={listingImgSrc} />

      {failureMessage && (
        <ErrorText>Business creation failed: {failureMessage}</ErrorText>
      )}
      <FormButtonGroup form="newBusinessForm" submitValue="Save business" />
    </FormContainer>
  )
}

export default EditBusiness
