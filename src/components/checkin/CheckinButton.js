import ButtonWide from "../shared/ButtonWide"

const CheckinButton = ({ checkedIn, submitCheckIn }) => {
  return (
    <>
      {checkedIn ? (
        <ButtonWide bgColor="primary" disabled>Checked In!</ButtonWide>
      ) : (
        <ButtonWide bgColor="primary-dark" handleClick={submitCheckIn}>
          Check In
        </ButtonWide>
      )}
    </>
  )
}

export default CheckinButton
