import { Card } from "react-bulma-components"

const CardListingImg = ({ src }) => {
  // Cloudinary image display.
  const size = "440" // Default size for card..
  const publicId = src ? src : "qrin/o9hhjmqphocfk24pe71s" // The existing image or a placeholder.
  return (
    <Card.Image
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
      size={"square"}
    />
  )
}

export default CardListingImg
