import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { stateContext } from "../../stateReducer";
import { Container, Card, Heading, Button } from "react-bulma-components";
import LocationAutocomplete from "./LocationAutocomplete";

const NewBusiness = () => {
  const context = useContext(stateContext);
  const {register, handleSubmit, setValue, formState: { errors }} = useForm();
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then(response => {
        setCategories(response.data);
      })
  }, []);

  const onSubmit = (data) => {
    data.business.user_id = context.session.user.id

    console.debug(data)

    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/businesses`, data)
      .then((response) => {
        console.debug(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Container>
      <Card>
        <Card.Header.Title>New Business</Card.Header.Title>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Heading size={5}>Business details</Heading>

          <div className="control">
            <label className="label" htmlFor="business.name">Name</label>
            <input className="input" type="text" id="name" {...register('business.name')} />
          </div>

          <div className="control">
            <label className="label" htmlFor="business.description">Description</label>
            <input className="input" type="text" id="description" {...register('business.description')} />
          </div>

          <div className="control">
            <label className="label" htmlFor="business.category_id">Category</label>
            <select className="select is-primary" {...register('business.category_id')}>
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

          <Button submit color='primary'>Create Business</Button>
          </form>
        </Card.Content>
      </Card>
    </Container>
  )
}

export default NewBusiness
