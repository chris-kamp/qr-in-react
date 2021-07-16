import { Link } from 'react-router-dom';

const BusinessCard = (props) => {
  return (
    <div>
      <h3>{props.business.name}</h3>
      <h4>{props.business.category.name}</h4>
      <p>{`${props.business.description.substr(0, 60)}...`}</p>
      <img src="http://placekitten.com/200/200" />
      <p>
        {props.business.address.street}
        , {props.business.address.suburb.name}
        , {props.business.address.postcode.code}
        , {props.business.address.state.name}
      </p>
      <Link to={`/business/${props.business.id}`}>Know more</Link>
    </div>
  )
}

export default BusinessCard
