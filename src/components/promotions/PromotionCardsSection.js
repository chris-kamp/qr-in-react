import { Columns, Heading } from "react-bulma-components"
import PromotionCard from "./PromotionCard"

const PromotionCardsSection = ({promotions, desktopSize, tabletSize, mobileSize}) => {
  return (
    <>
      {promotions.length > 0 ? (
          promotions.map((promotion) => (
            <Columns.Column
              desktop={{ size: desktopSize }}
              tablet={{ size: tabletSize }}
              mobile={{ size: mobileSize }}
              key={promotion.id}
            >
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                business={promotion.business}
              ></PromotionCard>
            </Columns.Column>
          ))
        ) : (
          <Columns.Column size={"full"}>
            <Heading size={4}>No Promotions Found</Heading>
          </Columns.Column>
        )}
    </>
  )
}

export default PromotionCardsSection
