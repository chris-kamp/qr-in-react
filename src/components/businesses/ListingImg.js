import { Image } from "react-bulma-components"

const ListingImg = ({ business }) => {
  const size = "660"
  const publicId = business.profile_img_src
    ? business.profile_img_src
    : "v1626930815/qrin/profile-pic-placeholder_rwztji"
  return (
    <Image
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
    />
  )
}

export default ListingImg
