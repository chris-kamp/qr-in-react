describe('Businesses', () => {
    it('Loads the index and displays the businesses', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'businesses-index'
        })

        cy.visit('/businesses')

        cy.get(':nth-child(1) > .card > :nth-child(3)')
            .should('have.text', "It's the third business...")
        cy.get(':nth-child(2) > .card > :nth-child(3)')
            .should('have.text', "It's the second business...")
        cy.get(':nth-child(3) > .card > :nth-child(3)')
            .should('have.text', "It's the first business...")
    })

    it('Searches businesses and displays the correct results', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'businesses-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
            statusCode: 200,
            fixture: 'business-search-name'
        })

        cy.visit('/businesses')

        cy.get('#search').type('Second{enter}')

        cy.get('.card > :nth-child(3)').should('have.text', "It's the second business...")
    })

    it('Uses checkboxes to filter the search', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'businesses-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
            statusCode: 200,
            fixture: 'business-search-filter'
        })

        cy.wait(1000)

        cy.visit('/businesses')

        cy.get('.is-pulled-right > :nth-child(4) > .checkbox').click()
        cy.get(':nth-child(2) > .is-primary').click()
        cy.get('.card > :nth-child(3)').should('have.text', "It's the first business...")
    })
})

describe('Business', () => {
    it('Views an individual business', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'businesses-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })

        cy.wait(1000)

        cy.visit('/businesses')

        cy.get(':nth-child(3) > .card > .is-size-7 > a > .is-pulled-right').click()

        cy.get('#root > :nth-child(2) > :nth-child(1)').should('have.text', 'First business')
    })

    it('Displays the business image', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })

        cy.visit('/businesses/1')

        cy.get('.columns > :nth-child(1) > .image > img').should('be.visible').and((image) => {
            expect(image[0].naturalWidth).to.be.greaterThan(0)
        })
    })

    it('Displays relevant business details', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })

        cy.visit('/businesses/1')

        // Ratings tag
        cy.get('.tag').should('be.visible').contains('4.0')

        // Review count
        cy.get('.ml-5').should('be.visible').contains('reviews')

        // Weekly checkins
        cy.get(':nth-child(1) > .is-6').should('be.visible').contains('checkins this week')

        // Address
        cy.get('.columns > :nth-child(2) > :nth-child(2)').contains('123 Coder Street, Brisbane City, 4000, Queensland')

        // Promotions
        cy.get('.mb-2').contains('Another example promotion!')
    })

    it('Displays checkins', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })

        cy.visit('/businesses/1')

        // Shows 3 checkins
        cy.get('.card-content > table > tbody').children().should('have.length', 3)

        cy.get('tbody > :nth-child(1) > :nth-child(2)').contains('user2 checked in at First business')
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(6)').contains('Great')
        cy.get(':nth-child(3) > :nth-child(2) > :nth-child(6)').contains('Extremely average')

        cy.get(':nth-child(3) > :nth-child(2) > .is-pulled-right').should('be.visible')
    })
})

describe('Business owner', () => {
    beforeEach(() => {
        cy.fixture('user-login').then((user) => {
            cy.window().then((window) => {
                window.localStorage.setItem('session', JSON.stringify(user))
            })
        })
    })

    it('Creates a business, navigating from profile page', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/users/4`, {
            statusCode: 200,
            fixture: 'user-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/users/4/public`, {
            statusCode: 200,
            fixture: 'user-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })

        cy.visit('users/4')

        // Navigate to new business page
        cy.get('.container > .is-flex > .button').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses/new')
    })

    it('Enters invalid details and displays errors', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-create-show'
        })

        cy.visit('/businesses/new')

        cy.get('.textarea').type("It's the fourth business...")
        cy.get('.select').select("1")

        cy.get('.mr-1').click()

        cy.get('[placeholder="Brisbane City"]').type('Brisbane City')
        cy.get('[placeholder="QLD"]').type('QLD')

        // Errors
        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.get('.container > :nth-child(5)').should('have.text', 'Invalid business name')
        cy.get('.container > :nth-child(14)').should('have.text', 'Invalid street')
        cy.get('.container > :nth-child(19)').should('have.text', 'Invalid postcode')
    })

    it('Enters valid details and submits form', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })
        cy.intercept('post', `${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'business-create-post'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-create-show'
        })

        cy.visit('/businesses/new')

        cy.get('[placeholder="Your Business"]').type('Fourth business')
        cy.get('.textarea').type("It's the fourth business...")
        cy.get('.select').select("1")

        cy.get('.mr-1').click()
        cy.get('[placeholder="123 Coder St"]').type('116 Adelaide St')
        cy.get('[placeholder="Brisbane City"]').type('Brisbane City')
        cy.get('[placeholder="4000"]').type('4000')
        cy.get('[placeholder="QLD"]').type('QLD')

        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses/4')
    })

    it('Edits an existing business', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-edit'
        })

        cy.visit('/businesses/4')

        cy.get('[href="/businesses/4/edit"] > .mx-5').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses/4/edit')
        cy.get('.input.is-medium').should('have.value', 'Fourth business')
    })

    it('Updates a business', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-update-show'
        })
        cy.intercept('PATCH', `${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-update-post'
        })

        cy.visit('/businesses/4/edit')

        cy.wait(500)

        cy.get('.input.is-medium').clear().type('Edited business!')
        cy.get('.textarea').type('{enter}Has been edited!')

        cy.get('.mr-1').click()
        cy.get('[placeholder="123 Coder St"]').clear().type('116 Updated Road')

        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses/4')

        cy.get('.delete').click()
        cy.get('#root > :nth-child(2) > :nth-child(1)').should('have.text', 'Edited business!')
        cy.get(':nth-child(2) > p').contains('116 Updated Road')
    })

    it('Deletes a business', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-create-show'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'businesses-index'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })

        cy.visit('/businesses/4')

        cy.get('.is-danger').click()

        cy.url().should('eq', Cypress.config().baseUrl + '/businesses')

        cy.get('.message-header').should('have.text', 'Business deleted')
    })
})
