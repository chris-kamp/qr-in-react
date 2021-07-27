import axios from "axios"
import { useForm } from "react-hook-form"
import { useContext } from "react"
import { stateContext } from "../../stateReducer"
import TextArea from "../shared/TextArea"
import InlineFormButtonGroup from "../shared/InlineFormButtonGroup"
import { flashError, flashNotice } from "../../utils/Utils"

const UserBioForm = ({ toggleForm, setUser, user }) => {
  const { session, dispatch } = useContext(stateContext)

  // react-hook-form setup
  const { register, handleSubmit } = useForm()

  // On form submission, send request to update the user resource on the backend
  const onSubmit = (data) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_ENDPOINT}/users/${session?.user.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      )
      // Notify success, update user state with response data, and toggle editing form to closed
      .then((response) => {
        flashNotice(dispatch, "Bio successfully updated")
        setUser(response.data)
        toggleForm()
      })
      // Notify of error if request fails
      .catch(() => {
        flashError(dispatch, "Something went wrong while trying to update your bio. Please try again shortly.")
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="bioForm" />
      <TextArea
        register={register}
        name="bio"
        placeholder="Tell us about yourself..."
        form="bioForm"
        defaultValue={user.bio}
        focus
      />
      <InlineFormButtonGroup
        form="bioForm"
        submitValue="Confirm"
        toggleForm={toggleForm}
      />
    </>
  )
}

export default UserBioForm
