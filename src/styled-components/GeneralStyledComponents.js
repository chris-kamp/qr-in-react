import styled from "styled-components"

const breakpoint = '768px';

const PageHeader = styled.h1`
  text-align: center;
`

const FlexColumns = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`

const Card = styled.div`
  width: 80%;
  background: #f5f5f5;
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  @media(min-width: ${breakpoint}) {
    width: 40%;
  }
`

export { PageHeader, FlexColumns, Card }
