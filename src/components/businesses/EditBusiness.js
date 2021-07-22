import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { stateContext } from "../../stateReducer";
import { Container, Card, Heading, Button } from "react-bulma-components";
import LocationAutocomplete from "./LocationAutocomplete";

const EditBusiness = () => {
  const context = useContext(stateContext);
  const { dispatch } = useContext(stateContext);
  const {register, handleSubmit, getValues, setValue, formState: { errors }} = useForm();
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [categories, setCategories] = useState([])
  const { id } = useParams();
  const history = useHistory()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then((response) => {
        setValue('business', {...response.data, address: {
          street: response.data.address.street,
          suburb: response.data.address.suburb.name,
          postcode: response.data.address.postcode.code,
          state: response.data.address.state.name
        }})
      })
  }, [])


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then(response => {
        setCategories(response.data);
      })
  }, []);

  const onSubmit = (data) => {
    data.business.user_id = context.session.user.id

    axios
      .patch(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`, data)
      .then((response) => {
        dispatch({
          type: 'pushAlert',
          alert: {
            message: 'Business updated successfully',
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
    <Container>
      <Card>
        <Card.Header.Title>Edit Business</Card.Header.Title>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Heading size={5}>Business details</Heading>

          <div className="control">
            <label className="label" htmlFor="business.name">Name</label>
            <input className="input" type="text" id="name" {...register('business.name')} />
            {errors.business?.name && 'Name is required'}
          </div>

          <div className="control">
            <label className="label" htmlFor="business.description">Description</label>
            <textarea className="input" type="text" id="description" {...register('business.description')}></textarea>
            {errors.business?.description && 'Description is required'}
          </div>

          <div className="control">
            <label className="label" htmlFor="business.category_id">Category</label>
            <select className="select is-fullwidth" {...register('business.category_id')}>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>

          <br />

          <Heading size={5}>Address</Heading>

          {!useManualAddress && (
            <React.Fragment>
              <LocationAutocomplete addressCallback={(address) => {
                setValue('business.address', address)
              }} />
            </React.Fragment>
          )}

          <div className="is-pulled-right control">
            <label className="checkbox" htmlFor="useManualAddress">
              <input className="checkbox mr-2" id="useManualAddress" onChange={() => {setUseManualAddress(!useManualAddress)}} type="checkbox" />
              Enter address manually?
            </label>
          </div>

          {useManualAddress && (
            <React.Fragment>
              <div className="control">
                <label htmlFor="business.address.street" className="label">Street Address</label>
                <input className="input" type="text" id="street" {...register('business.address.street')} />
              </div>

              <div className="control">
                <label htmlFor="business.address.suburb" className="label">Suburb / City</label>
                <input className="input" type="text" id="suburb" {...register('business.address.suburb')} />
              </div>

              <div className="control">
                <label htmlFor="business.address.postcode" className="label">Postcode</label>
                <input className="input" type="text" id="postcode" {...register('business.address.postcode')} />
              </div>

              <div className="control">
                <label htmlFor="business.address.state" className="label">State</label>
                <input className="input" type="text" id="state" {...register('business.address.state')} />
              </div>
            </React.Fragment>
          )}

          <br />

          <Button submit color='primary'>Update Business</Button>
          </form>
        </Card.Content>
      </Card>
    </Container>
  )
}

export default EditBusiness
