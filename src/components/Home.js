import { stateContext } from "../stateReducer"
import { useContext } from "react"
import {Image} from 'cloudinary-react';

const Home = () => {
  const { session } = useContext(stateContext)
  let widget = window.cloudinary.createUploadWidget(
    {
      cloudName: "chriskamp",
      uploadPreset: "gp17ernf",
      folder: "qrin"
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info)
      }
    }
  )
  const showWidget = () => widget.open()

  return (
    <div>
      <h1>Home</h1>
      <button onClick={showWidget}>Upload Image</button>
      <Image cloudName="chriskamp" publicId="qrin/wfjxocf60izkkadk1hpz" width="300" crop="scale"/>
    </div>
  )
}

export default Home
