import { Button } from "react-bulma-components"

const UserBio = ({ user, toggleForm }) => {
  return (
    <>
      {user?.bio ? (
        <p className="has-text-centered-mobile">{user.bio}</p>
      ) : (
        <p className="has-text-centered-mobile">
          This user hasn't created a bio yet!
        </p>
      )}
      <Button
        className="button has-background-warning-dark has-text-white has-text-weight-bold mx-auto mt-2"
        style={{ borderRadius: "0.6rem" }}
        onClick={toggleForm}
      >
        Edit Bio
      </Button>
    </>
  )
}

export default UserBio
