import { Rating } from "@material-ui/lab"
import ProfileImg from "../profile/ProfileImg"

const CheckinCard = ({ checkin }) => {
  return (
    <tr>
      <td>
        <ProfileImg user={checkin.user} size={64} rounded />
      </td>
      <td>
        <span className="has-text-grey">
          {new Date(checkin.created_at).toLocaleString()}
        </span>
        {checkin.review?.rating && (
          <span className="is-pulled-right">
            <Rating
              name="rating"
              size="small"
              value={parseInt(checkin.review?.rating)}
              disabled
            />
          </span>
        )}
        <br />
        <b>{checkin.user.username}</b> checked in at{" "}
        <b>{checkin.business.name}</b>
        {checkin.review?.content && (
          <span>
            {" "}
            and left a review: "<i>{checkin.review.content}</i>"
          </span>
        )}
      </td>
    </tr>
  )
}

export default CheckinCard
