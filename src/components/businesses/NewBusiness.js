import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { stateContext } from "../../stateReducer"
import LocationAutocomplete from './LocationAutocomplete';
import { Heading, Card } from 'react-bulma-components';
import { Button } from 'react-bulma-components';

const NewBusiness = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => createBusiness(data);
  const [checked, setChecked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [business, setBusiness] = useState({})

  const addressCallback = (address) => {
    console.debug(address)
  }

  const context = useContext(stateContext);

  const handleCheck = event => setChecked(event.target.checked);

  const createBusiness = (payload) => {
    // Set the user_id of the business to the current user in session.
    payload.business.user_id = context.session.user.id

    // Post form data to the business route.
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/businesses`, payload)
      .then((response) => {
        console.debug(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then(response => {
        setCategories(response.data);
      })
  }, []);

  return (
    <React.Fragment>
      <Card>
        <Card.Header.Title>New Business</Card.Header.Title>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>

            <Heading size={5}>Business details</Heading>

            <div className="control">
              <label className="label" htmlFor="business.name">Name</label>
              <input
                className="input"
                type="text"
                id="name"
                {...register('business.name')}
              />
            </div>

            <div className="control">
              <label className="label" htmlFor="business.description">Description</label>
              <input
                className="input"
                type="text"
                id="description"
                {...register('business.description')}
              />
            </div>

            <div className="control">
              <label className="label" htmlFor="business.category_id">Category</label>
              <select className="select is-primary" {...register('business.category_id')}>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>

            <br />

            <Heading size={5}>Address</Heading>

            { !checked && (
                <LocationAutocomplete addressCallback={addressCallback} />
              )
            }

            <div className="is-pulled-right control">
              <label className="checkbox" htmlFor="_useManualAddress">
                <input className="checkbox mr-2" id="_useManualAddress" onChange={handleCheck} type="checkbox" />
                Enter address manually?
              </label>
            </div>

            { checked &&
              <React.Fragment>
                <div className="control">
                  <label className="label" htmlFor="business.address.street">Street Address</label>
                  <input
                    className="input"
                    type="text"
                    id="street"
                    {...register('business.address.street')}
                  />
                </div>

                <div className="control">
                  <label className="label" htmlFor="business.address.suburb">Suburb</label>
                  <input
                    className="input"
                    type="text"
                    id="suburb"
                    {...register('business.address.suburb')}
                  />
                </div>

                <div className="control">
                  <label className="label" htmlFor="business.address.postcode">Postcode</label>
                  <input
                    className="input"
                    type="text"
                    id="postcode"
                    {...register('business.address.postcode')}
                  />
                </div>

                <div className="control">
                  <label className="label" htmlFor="business.address.state">State</label>
                  <input
                    className="input"
                    type="text"
                    id="state"
                    {...register('business.address.state')}
                  />
                </div>
              </React.Fragment>
            }

            <br />

            <Button submit color='primary'>Create Business</Button>
          </form>
        </Card.Content>
      </Card>
    </React.Fragment>
  )
}

export default NewBusiness
