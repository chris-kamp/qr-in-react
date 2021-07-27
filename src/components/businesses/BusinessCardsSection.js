import { Columns, Heading } from "react-bulma-components"
import BusinessCard from "./BusinessCard"

const BusinessCardsSection = ({ businesses, desktopSize, tabletSize, mobileSize }) => {
  return (
    <>
    {/*
      Map each business and display a BusinessCard component with each business details.
    */}
      {businesses.length > 0 ? (
        businesses.map((business) => (
          <Columns.Column
            desktop={{ size: desktopSize }}
            tablet={{ size: tabletSize }}
            mobile={{ size: mobileSize }}
            key={business.id}
          >
            <BusinessCard key={business.id} business={business}></BusinessCard>
          </Columns.Column>
        ))
      ) : (
        <Columns.Column size={"full"}>
          <Heading size={4}>No Businesses Found</Heading>
        </Columns.Column>
      )}
    </>
  )
}

export default BusinessCardsSection
