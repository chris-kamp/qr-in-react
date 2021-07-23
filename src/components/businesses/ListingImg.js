import { Image } from "react-bulma-components"

const ListingImg = ({ src }) => {
  const size = "660"
  const publicId = src
    ? src
    : "qrin/o9hhjmqphocfk24pe71s"
  return (
    <Image
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
    />
  )
}

export default ListingImg
