import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import axios from "axios"
import { useForm } from "react-hook-form"
import { stateContext } from "../../stateReducer"
import { Container, Card, Heading, Button } from "react-bulma-components"
import FormContainer from "../shared/FormContainer"
import PageHeading from "../shared/PageHeading"
import Input from "../shared/Input"
import InputLabel from "../shared/InputLabel"
import { ErrorText } from "../../styled-components/FormStyledComponents"

const NewPromotion = () => {
  const context = useContext(stateContext)
  const { dispatch } = useContext(stateContext)
  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm()

  const history = useHistory()

  const onSubmit = (data) => {
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/promotions`, data)
      .then((response) => {
        dispatch({
          type: 'pushAlert',
          alert: {
            message: 'Business created successfully',
            type: 'notice'
          }
        })

        history.push(`/businesses/${response.data.id}`)
      })
      .catch((error) => {
        dispatch({
          type: 'pushAlert',
          alert: {
            message: 'Errors: ' + Object.keys(error.response.data.errors).map(k => `${k}: ${error.response.data.errors[k].join(', ')}`).join(', '),
            type: 'error'
          }
        })
      })
  }

  return (
    <FormContainer>
      <PageHeading>New Promotion</PageHeading>
      <form onSubmit={handleSubmit(onSubmit)} id="newPromotionForm" />
      <InputLabel htmlFor="promotion.description" text="Description" isFirst />
      <Input
        register={register}
        name="promotion.description"
        validator={{ required: true }}
        placeholder="Enter the details of your promotion"
        form="newPromotionForm"
        focus
      />
      {errors.promotion?.description && <ErrorText>Invalid promotion description</ErrorText>}

      <code>End Date</code>
    </FormContainer>
  )
}

export default NewPromotion
