import React, { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Card, Button } from "react-bulma-components"

const BusinessSearchFilter = (props) => {
  const [categories, setCategories] = useState([])
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    // Retrieve available categories from Rails for displaying in filter checkboxes
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then((response) => {
        setCategories(response.data)
      })
  }, [])

  const onSubmit = (data) => {
    // When form is submitted, send the search data and selected filters as GET query params
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/search`, {
        params: data,
      })
      .then((response) => {
        // Send the response from the search request back to the parent component callback function.
        props.searchCallback(response.data)
      })
  }

  return (
    <Card className="my-5">
      <Card.Header.Title>Search Businesses</Card.Header.Title>
      <Card.Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                {...register("search")}
                type="text"
                id="search"
                className="input"
                placeholder="Search businesses by name or description"
              />
            </div>
            <div className="control">
              <Button color="primary">Search</Button>
            </div>
          </div>

          <div className="is-pulled-right">
            <span className="has-text-grey">Filter By Type:</span>
            {/*
              Checkbox for each category to filter by
            */}
            {categories.map((category) => (
              <label className="checkbox mx-1" key={category.id}>
                <input
                  {...register(`filter._${category.id}`)}
                  type="checkbox"
                  className="checkbox mx-1"
                />
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
