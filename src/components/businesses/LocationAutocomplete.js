import React, { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const LocationAutocomplete = (props) => {
  const [address, setAddress] = useState(props.addresPlaceholder || '')

  const handleChange = address => {
    setAddress(address)
  }

  const handleSelect = address => {
    geocodeByAddress(address)
      .then(results => {
        setAddress(results[0].formatted_address)
        props.addressCallback(parseAddress(results[0].address_components))
      })
      .catch(error => {
        console.error(error)
      })
  }

  const parseAddress = (addressComponents) => {
    let componentParse = {
      street: ['street_number', 'street_address', 'route'],
      suburb: [
        'locality',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4',
        'sublocality_level_5',
      ],
      postcode: ['postal_code'],
      state: [
        'political',
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'administrative_area_level_4',
        'administrative_area_level_5'
      ]
    }

    let address = {
      street: '',
      suburb: '',
      postcode: '',
      state: ''
    }

    addressComponents.forEach(component => {
      for (let parse in componentParse) {
        if (componentParse[parse].indexOf(component.types[0]) !== -1) {
          if (componentParse.street.includes(component.types[0])) {
            address[parse] += `${component.long_name} `
          } else if (componentParse.state.includes(component.types[0])) {
            address[parse] = component.short_name
          } else {
            address[parse] = component.long_name
          }
        }
      }
    })

    address.street = address.street.trim()

    console.debug(address)

    return address;
  }

  return (
    <React.Fragment>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        debounce={500}
        highlightFirstSuggestion={true}
        shouldFetchSuggestions={address.length > 5}
        searchOptions={{componentRestrictions: { country: 'au' }}}
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
                  <div key={suggestion.id}
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
