import { Image } from "react-bulma-components"

const ProfileImg = ({ user, size, rounded }) => {
  // Cloudinary public id of user's profile image if any, or otherwise of a pre-set placeholder image
  const publicId = user.profile_img_src
    ? user.profile_img_src
    : "v1626930815/qrin/profile-pic-placeholder_rwztji"
  return (
    <Image
      size={size}
      rounded={rounded}
      src={`https://res.cloudinary.com/chriskamp/image/upload/c_scale,h_${size},w_${size}/${publicId}`}
    />
  )
}

export default ProfileImg
