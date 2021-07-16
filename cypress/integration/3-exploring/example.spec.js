describe('Businesses', () => {
  it('Example loading index with fixture', () => {
    cy.fixture('businesses-index').then((businessesJson) => {
      cy.intercept('http://localhost:4000/api/v1/businesses', {
        statusCode: 200,
        body: businessesJson
      })
    })

    cy.visit('http://localhost:3000/businesses')
  })
})
