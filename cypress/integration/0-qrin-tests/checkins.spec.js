describe('Checkins', () => {
    beforeEach(() => {
        cy.fixture('user-login').then((user) => {
            cy.window().then((window) => {
                window.localStorage.setItem('session', JSON.stringify(user))
            })
        })
    })

    it('Leaves a checkin with no rating or view', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/checkins`, {
            statusCode: 200,
            fixture: 'checkins-post'
        }).as('checkinPost')

        cy.visit('businesses/1/checkin')
        cy.get('.has-background-primary-dark').click()

        cy.wait('@checkinPost').then((interception) => {
            assert.isNotNull(interception.response.body, 'Sends checkin POST request')
        })
        cy.get('.has-background-primary').should('have.text', 'Checked In!')
    })

    it('Cannot leave a review without a rating', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/checkins`, {
            statusCode: 201,
            fixture: 'checkins-post'
        })

        cy.visit('businesses/1/checkin')
        cy.get('.has-background-primary-dark').click()

        cy.get('form > .button').click()

        cy.get('.has-text-danger').should('be.visible').should('have.text', 'Rating is required')
    })

    it('Leaves a rating without a review', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/checkins`, {
            statusCode: 201,
            fixture: 'checkins-post'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/checkins`, {
            statusCode: 201,
            fixture: 'checkins-post'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/reviews`, {
            statusCode: 201,
            fixture: 'reviews-post-rating'
        }).as('reviewPost')

        cy.visit('businesses/1/checkin')
        cy.get('.has-background-primary-dark').click()

        cy.get('[for="rating-5"]').click()

        cy.get('form > .button').click()

        cy.wait('@reviewPost').then((interception) => {
            assert.isNotNull(interception.response.body, 'Sends review POST request')
        })
    })

    it('Leaves a rating and a review', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/checkins`, {
            statusCode: 201,
            fixture: 'checkins-post'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/reviews`, {
            statusCode: 201,
            fixture: 'reviews-post'
        }).as('reviewPost')

        cy.visit('businesses/1/checkin')
        cy.get('.has-background-primary-dark').click()

        cy.get('[for="rating-5"]').click()

        cy.get('.textarea').type('This is an example review!')

        cy.get('form > .button').click()

        cy.wait('@reviewPost').then((interception) => {
            assert.isNotNull(interception.response.body, 'Sends review POST request')
        })

        cy.get('.message-header').should('have.text', 'Your review of First business has been posted!')
    })
})
