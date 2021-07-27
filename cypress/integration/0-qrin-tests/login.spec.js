describe('Log in', () => {
    it ('Saves a token to localStorage', () => {
        cy.intercept('POST', `${Cypress.env('apiUrl')}/users/login`, {
            statusCode: 200,
            fixture: 'user-login'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses?limit=4`, {
            statusCode: 200,
            fixture: 'home-businesses'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/promotions?limit=4`, {
            statusCode: 200,
            fixture: 'home-promotions'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/checkins?limit=10`, {
            statusCode: 200,
            fixture: 'home-checkins'
        })

        cy.visit('/login')

        cy.get('[placeholder="email@example.com"]').type('user4@user4.com')
        cy.get('[placeholder="Password"]').type('Password1')

        cy.get('.has-background-primary-dark').click()

        cy.window().then((window) => {
            expect(JSON.parse(window.localStorage.getItem('session'))).to.deep.equal({
                "token": "eyJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6InVzZXI0QHVzZXI0LmNvbSIsImV4cCI6MTYyNzM1NDY0NX0.92uFtbRRsp0tKdIUbr2tbaElj4hq65CtKUpYrN6j8Z6f5D1k-8PKG-tMxPKr3EOr9lOadSK_x1TEUgihIBnQ3Q",
                "user": {
                    "username": "user4",
                    "email": "user4@user4.com",
                    "id": 4
                }
            })
        })

        cy.get('.message-header').contains('You are now logged in as user4')
        cy.get('.delete').click()
    })
})
