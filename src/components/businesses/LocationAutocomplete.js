import React, { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const LocationAutocomplete = (props) => {
  const [address, setAddress] = useState(null)

  const handleChange = address => {
    console.debug(address)
    setAddress(address)
  }

  const handleSelect = address => {
    console.debug(address)
    geocodeByAddress(address)
      .then(results => {
        console.debug(results)
        setAddress(results[0].formatted_address)
        props.setAddress(results[0])
        return getLatLng(results[0])
      })
      .then(latLng => {
        console.debug(latLng)
      })
      .catch(error => {
        console.error(error)
      })

  }

  return (
    <React.Fragment>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="control">
            <input
              className="input"
              type="text"
              { ...getInputProps({placeholder: 'Start typing to search location'}) }
            />
            <div>
              {loading && <p>Loading Suggestions...</p>}
              {suggestions.map(suggestion => (
                  <div
                    { ...getSuggestionItemProps(suggestion, {})}
                  >
                    <span>{suggestion.description}</span>
                  </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </React.Fragment>
  )
}

export default LocationAutocomplete
