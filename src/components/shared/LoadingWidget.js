import { CircularProgress } from "@material-ui/core"

const LoadingWidget = () => {
  return (
    <div style={{ margin: "2rem auto", width: "max-content" }}>
      <CircularProgress />
    </div>
  )
}

export default LoadingWidget
