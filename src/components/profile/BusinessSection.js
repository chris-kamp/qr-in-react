import { Button } from "react-bulma-components"
import { Link } from "react-router-dom"

const BusinessSection = ({ user }) => {
  return (
    <section className="is-flex">
      {user?.business ? (
        <Button
          className="button has-background-info-dark has-text-white has-text-weight-bold mx-auto mt-2"
          style={{ borderRadius: "0.6rem" }}
          renderAs={Link}
          to={`/businesses/${user.business.id}`}
        >
          My Business
        </Button>
      ) : (
        <Button
          className="button has-background-primary-dark has-text-white has-text-weight-bold mx-auto mt-2"
          style={{ borderRadius: "0.6rem" }}
          renderAs={Link}
          to={`/businesses/new`}
        >
          Create a Business
        </Button>
      )}
    </section>
  )
}

export default BusinessSection
