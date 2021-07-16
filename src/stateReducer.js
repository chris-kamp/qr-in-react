import { createContext } from "react"

export default function stateReducer(currentState, action) {
  switch (action.type) {
    case "login": {
      localStorage.setItem("session", JSON.stringify(action.session))
      return {
        ...currentState,
        session: action.session,
      }
    }

    case "logout": {
      localStorage.removeItem("session")
      return {
        ...currentState,
        session: null,
      }
    }

    default:
      return currentState
  }
}

export const stateContext = createContext()
