import ButtonWide from "../shared/ButtonWide"

const CheckinButton = ({ checkinId, submitCheckIn, addClasses }) => {
  return (
    <>
      {checkinId ? (
        <ButtonWide bgColor="primary" disabled {...{ addClasses }}>
          Checked In!
        </ButtonWide>
      ) : (
        <ButtonWide
          bgColor="primary-dark"
          handleClick={submitCheckIn}
          {...{ addClasses }}
        >
          Check In
        </ButtonWide>
      )}
    </>
  )
}

export default CheckinButton
