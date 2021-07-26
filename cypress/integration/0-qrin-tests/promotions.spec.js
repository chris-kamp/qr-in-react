before(() => {
    cy.fixture('user-login').then((user) => {
        cy.window().then((window) => {
            window.localStorage.setItem('session', JSON.stringify(user))
        })
    })
})

describe('Promotions', () => {
    it('Creates a promotion', () => {
        cy.intercept('POST', `${Cypress.env('apiUrl')}/promotions`, {
            statusCode: 201,
            fixture: 'promotion-create-post'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'promotion-create-show'
        })

        cy.visit('businesses/4')

        cy.get('[href="/businesses/4/promotions/new"] > .mx-5').click()

        cy.get('.textarea').type('This is an example promotion!')

        cy.get('[name="promotion.end_date"]').type('2030-01-01')

        cy.get('div.mt-5 > .has-background-primary-dark').click()
    })

    it('Shows the new promotion on business', () => {
        cy.get('.delete').click()

        cy.get('.mb-2').contains('This is an example promotion!')
        cy.get('b').contains('01/01/2030')
    })

    it('Shows the promotion on the promotion index', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/promotions`, {
            statusCode: 200,
            fixture: 'promotion-index'
        })

        cy.get('[href="/promotions"]').click()
    })
})
