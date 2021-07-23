import { Rating } from "@material-ui/lab"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import ProfileImg from "../profile/ProfileImg"

const CheckinCard = ({ checkin }) => {
  const location = useLocation()

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
        <b>
          {location.pathname === `/users/${checkin.user.id}` ? (
            checkin.user.username
          ) : (
            <Link to={`/users/${checkin.user.id}`}>
              {checkin.user.username}
            </Link>
          )}
        </b>{" "}
        checked in at{" "}
        <b>
          {location.pathname === `/businesses/${checkin.business.id}` ? (
            checkin.business.name
          ) : (
            <Link to={`/businesses/${checkin.business.id}`}>
              {checkin.business.name}
            </Link>
          )}{" "}
        </b>
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
