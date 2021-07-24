import { createContext } from "react"
import { v4 as uuid } from "uuid"

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

    case "pushAlert": {
      return {
        ...currentState,
        alerts: [
          ...currentState.alerts,
          {
            message: action.alert.message,
            type: action.alert.type,
            id: uuid(),
          },
        ],
      }
    }

    case "removeAlert": {
      return {
        ...currentState,
        alerts: currentState.alerts.filter(
          (element) => element.id !== action.id
        ),
      }
    }

    case "setBackPath": {
      return {
        ...currentState,
        backPath: action.backPath,
      }
    }

    default:
      return currentState
  }
}

export const stateContext = createContext()
