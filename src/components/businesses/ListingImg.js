import { Image } from "react-bulma-components"

const ListingImg = ({ src }) => {
  // Cloudinary image display.
  const size = "660" // Default size.
  const publicId = src ? src : "qrin/o9hhjmqphocfk24pe71s" // The provided src image or a placeholder.
  return (
    <Image
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
    />
  )
}

export default ListingImg
