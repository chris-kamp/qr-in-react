describe('Promotions', () => {
    beforeEach(() => {
        cy.fixture('user-login').then((user) => {
            cy.window().then((window) => {
                window.localStorage.setItem('session', JSON.stringify(user))
            })
        })
    })

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

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses/4/promotions/new')

        cy.get('.textarea').type('This is an example promotion!')
        cy.get('[name="promotion.end_date"]').type('2030-01-01')

        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses/4')
        cy.get('.message-header').should('have.text', 'Promotion created successfully')
        cy.get('.mb-2').should('contain', 'This is an example promotion!')
        cy.get('b').should('contain', 'Valid until 01/01/2030')
    })

    it('Shows the promotion on the promotion index', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/promotions`, {
            statusCode: 200,
            fixture: 'promotion-index'
        })

        cy.visit('/promotions')

        cy.get(':nth-child(2) > .card > :nth-child(3)').should('have.text', 'This is an example promotion!...')
    })
})
