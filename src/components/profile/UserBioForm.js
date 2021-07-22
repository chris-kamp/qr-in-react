import axios from "axios"
import { useForm } from "react-hook-form"
import { useContext } from "react"
import { stateContext } from "../../stateReducer"
import FormButtonGroup from "../shared/FormButtonGroup"
import TextArea from "../shared/TextArea"
import InlineFormButtonGroup from "../shared/InlineFormButtonGroup"

const UserBioForm = ({ toggleForm, setUser, user }) => {
  const { session, dispatch } = useContext(stateContext)

  // react-hook-form setup
  const { register, handleSubmit } = useForm()

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
      .then((response) => {
        dispatch({
          type: "pushAlert",
          alert: {
            type: "notice",
            message: "Bio successfully updated",
          },
        })
        setUser(response.data)
        toggleForm()
      })
      .catch(() => {
        dispatch({
          type: "pushAlert",
          alert: {
            type: "error",
            message:
              "Something went wrong while trying to update your bio. Please try again shortly.",
          },
        })
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
