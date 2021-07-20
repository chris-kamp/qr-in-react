import { Container } from "react-bulma-components"

const FormContainer = ({children}) => {
  return (
    <Container className="is-flex is-flex-direction-column is-align-items-center">
      {children}
    </Container>
  )
}

export default FormContainer
