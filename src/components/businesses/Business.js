import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Heading, Content, Columns, Image, Card, Table, Tag } from 'react-bulma-components';

const Business = () => {
  const [business, setBusiness] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/businesses/${id}`)
      .then(response => {
        setBusiness(response.data);
      });
  }, []);

  return (
    <Container>
      {business && (
        <React.Fragment>
          <Heading className="has-text-centered">{business.name}</Heading>
          <Columns>
            <Columns.Column>
              <Image src='https://placekitten.com/666/666'></Image>
            </Columns.Column>
            <Columns.Column>
              <Content>
                {business.reviews.length > 0 && (
                  <React.Fragment>
                    <Heading size={5}>
                      <Tag rounded color='primary'>
                        {(business.reviews.reduce((a, b) => a + parseFloat(b.rating), 0) / business.reviews.length).toFixed(1)} ★
                      </Tag>
                      <span className="ml-5">({business.reviews.length} reviews)</span>
                    </Heading>
                    <Heading size={6}>
                      {business.checkins.filter(checkin => {
                        // 604800000 milliseconds === 1 week
                        return (new Date(checkin.created_at) > new Date() - 604800000)
                      }).length} checkins this week
                    </Heading>
                  </React.Fragment>
                  )}
              </Content>
              <Content>{business.description}</Content>
              <code>
                Promotions
              </code>
            </Columns.Column>
          </Columns>
          {business.checkins.length > 0 ? (
            <Card>
              <Card.Header.Title>Recent Check-ins</Card.Header.Title>
              <Card.Content>
                  {business.checkins.map(checkin => (
                    <Table>
                      <td>
                        <Image rounded src="https://placekitten.com/50/50"></Image>
                      </td>
                      <td>
                        <p>
                          <span className="has-text-grey">{new Date(checkin.created_at).toLocaleString()}</span>
                          <br />
                          <b>{checkin.user.username}</b> checked in at <b>{business.name}</b>
                          {checkin.review.content && (
                            <span> and left a review: "<i>{checkin.review.content}</i>"</span>
                          )}
                        </p>
                      </td>
                    </Table>
                  ))
                }
              </Card.Content>
            </Card>
          ) : (
            <React.Fragment>
              <Heading className="has-text-centered" size={5}>No checkins</Heading>
              <Heading className="has-text-centered" size={6} subtitle>Be the first to review this business!</Heading>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Container>
  )
}

export default Business
