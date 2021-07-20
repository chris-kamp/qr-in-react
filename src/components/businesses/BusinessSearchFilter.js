import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { stateContext } from "../../stateReducer"
import { Card, Heading, Button } from "react-bulma-components"

const BusinessSearchFilter = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/categories`)
      .then(response => {
        setCategories(response.data);
      })
  }, []);

  return (
    <Card className="my-5">
      <Card.Header.Title>Search Businesses</Card.Header.Title>
      <Card.Content>

        <form action="">
          <div className="field has-addons">
            <div className="control is-expanded">
              <input type="text" name="" id="" className="input" placeholder="Type a business name or location" />
            </div>
            <div className="control">
              <Button color='primary'>Search</Button>
            </div>
          </div>

          <div className='is-pulled-right'>
            <span className='has-text-grey'>Filter By Type:</span>
            {categories.map(category => (
              <label className="checkbox mx-1">
                <input type="checkbox" className="checkbox mx-1" />
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
