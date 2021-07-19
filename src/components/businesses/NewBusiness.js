import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { stateContext } from "../../stateReducer"
import LocationSearchInput from './LocationSearchInput';
import { PageHeader } from '../../styled-components/GeneralStyledComponents';

const NewBusiness = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => createBusiness(data);
  const [checked, setChecked] = useState(false);
  const [categories, setCategories] = useState([]);

  const context = useContext(stateContext);
  console.debug(context.session)

  const handleCheck = event => {
    setChecked(event.target.checked);
  }

  const createBusiness = (payload) => {
    payload.business.user_id = 3;
    console.debug(payload);
    axios.post(`${process.env.REACT_APP_API_ENDPOINT}/businesses`, payload);
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then(response => {
        setCategories(response.data);
      })
  }, []);

  return (
    <div>
      <PageHeader>New Business</PageHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="business.name">Name</label>
          <input {...register('business.name')} />
        </div>

        <div>
          <label htmlFor="business.description">Description</label>
          <input {...register('business.description')} />
        </div>

        <div>
          <label htmlFor="business.category_id">Category</label>
          <select {...register('business.category_id')}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>

        { !checked && (
            <LocationSearchInput />
          )
        }

        <div>
          <label htmlFor="_useManualAddress">Enter address manually?</label>
          <input id="_useManualAddress" onChange={handleCheck} type="checkbox" />
        </div>

        { checked &&
          <>
            <div>
              <label htmlFor="business.address.street">Street Address</label>
              <input {...register('business.address.street')} />
            </div>

            <div>
              <label htmlFor="business.address.suburb">Suburb</label>
              <input {...register('business.address.suburb')} />
            </div>

            <div>
              <label htmlFor="business.address.postcode">Postcode</label>
              <input {...register('business.address.postcode')} />
            </div>

            <div>
              <label htmlFor="business.address.state">State</label>
              <input {...register('business.address.state')} />
            </div>
          </>
        }

        <input type="submit" value="Create Business" />
      </form>
    </div>
  )
}

export default NewBusiness
