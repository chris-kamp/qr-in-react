import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Card, Button } from "react-bulma-components"

const BusinessSearchFilter = (props) => {
  const [categories, setCategories] = useState([])
  const {register, handleSubmit, setValue, formState, formState: { errors }} = useForm();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then(response => {
        setCategories(response.data);
      })
  }, [])

  const onSubmit = (data) => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/search`, {
        params: data
      })
      .then((response) => {
        props.searchCallback(response.data)
      })
  };

  return (
    <Card className="my-5">
      <Card.Header.Title>Search Businesses</Card.Header.Title>
      <Card.Content>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input {...register('search')} type="text" id="search" className="input" placeholder="Type a business name or location" />
            </div>
            <div className="control">
              <Button color='primary'>Search</Button>
            </div>
          </div>

          <div className='is-pulled-right'>
            <span className='has-text-grey'>Filter By Type:</span>
            {categories.map(category => (
              <label className="checkbox mx-1">
                <input {...register(`filter._${category.id}`)} type="checkbox" className="checkbox mx-1" />
                {category.name}
              </label>
            ))}
          </div>

          <br />
        </form>

      </Card.Content>
    </Card>
  )
}

export default BusinessSearchFilter
