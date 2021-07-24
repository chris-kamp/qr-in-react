import { Card } from "react-bulma-components"

const CardListingImg = ({ src }) => {
  const size = "440"
  const publicId = src ? src : "qrin/o9hhjmqphocfk24pe71s"
  return (
    <Card.Image
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
      size={"square"}
    />
  )
}

export default CardListingImg
