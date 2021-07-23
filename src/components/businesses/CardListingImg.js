import { Card } from "react-bulma-components"

const CardListingImg = ({ business }) => {
  const size = "440"
  const publicId = business.profile_img_src
    ? business.profile_img_src
    : "v1626930815/qrin/profile-pic-placeholder_rwztji"
  return (
    <Card.Image
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
      size={"square"}
    />
  )
}

export default CardListingImg
