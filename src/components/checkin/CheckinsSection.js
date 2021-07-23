import { Card, Table } from "react-bulma-components"
import CheckinCard from "./CheckinCard"

const CheckinsSection = ({checkins}) => {
  return (
    <>
      {checkins.length > 0 ? (
        <Card>
          <Card.Content>
            <Table className="is-fullwidth">
              <tbody>
                {checkins.map((checkin) => (
                  <CheckinCard checkin={checkin} key={checkin.id} />
                ))}
              </tbody>
            </Table>
          </Card.Content>
        </Card>
      ) : (
        "No checkins"
      )}
    </>
  )
}

export default CheckinsSection
