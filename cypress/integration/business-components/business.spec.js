describe('Businesses', () => {
    it('Loads the index and displays the businesses', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 200,
            fixture: 'businesses-index'
        })

        cy.visit(`${Cypress.env('siteUrl')}/businesses`)

        cy.get(':nth-child(1) > .card > :nth-child(3)')
            .should('have.text', "It's the third business...")
        cy.get(':nth-child(2) > .card > :nth-child(3)')
            .should('have.text', "It's the second business...")
        cy.get(':nth-child(3) > .card > :nth-child(3)')
            .should('have.text', "It's the first business...")
    })

    it('Searches businesses and displays the correct results', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
            statusCode: 200,
            fixture: 'business-search-name'
        })
        cy.get('#search').type('Second{enter}')

        cy.get('.card > :nth-child(3)').should('have.text', "It's the second business...")
    })

    it('Uses checkboxes to filter the search', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
            statusCode: 200,
            fixture: 'categories-index'
        })

        cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
            statusCode: 200,
            fixture: 'business-search-filter'
        })

        cy.get('.is-pulled-right > :nth-child(4) > .checkbox').click()
        cy.get(':nth-child(2) > .is-primary').click()
        cy.get('.card > :nth-child(3)').should('have.text', "It's the first business...")
    })
})

describe('Business', () => {
    it('Views an individual business', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
            statusCode: 200,
            fixture: 'business-show'
        })

        cy.get('a > .is-pulled-right').click()

        cy.get('#root > :nth-child(2) > :nth-child(1)').should('have.text', 'First business')
    })

    it('Displays the business image', () => {
        cy.get('.columns > :nth-child(1) > .image > img').should('be.visible').and((image) => {
            expect(image[0].naturalWidth).to.be.greaterThan(0)
        })
    })

    it('Displays relevant business details', () => {
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
        // Shows 3 checkins
        cy.get('.card-content > table > tbody').children().should('have.length', 3)

        cy.get('tbody > :nth-child(1) > :nth-child(2)').contains('user2 checked in at First business')
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(6)').contains('Great')
        cy.get(':nth-child(3) > :nth-child(2) > :nth-child(6)').contains('Extremely average')

        cy.get(':nth-child(3) > :nth-child(2) > .is-pulled-right').should('be.visible')
    })
})

describe('Business owner', () => {
    it('Login as user and loads the homepage', () => {
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

        cy.visit(`${Cypress.env('siteUrl')}/login`)

        cy.get('[placeholder="email@example.com"]').type('user4@user4.com')
        cy.get('[placeholder="Password"]').type('Password1')

        cy.get('.has-background-primary-dark').click()

        cy.get(':nth-child(2) > .message-header > .delete').click()
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

        cy.get('.navbar-start > [href="/users/4"]').click()

        // Navigate to new business page
        cy.get('.container > .is-flex > .button').click()
    })

    it('Enters invalid details and displays errors', () => {
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
        cy.intercept('POST', `${Cypress.env('apiUrl')}/businesses`, {
            statusCode: 201,
            fixture: 'business-create-post'
        })
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-create-show'
        })

        cy.wait(1000)

        cy.get('[placeholder="Your Business"]').type('Fourth business')
        cy.get('[placeholder="123 Coder St"]').type('116 Adelaide St')
        cy.get('[placeholder="4000"]').type('4000')

        cy.get('div.mt-5 > .has-background-primary-dark').click()
    })

    it('Displays the new business', () => {
        cy.get('.message-header').should('be.visible').should('have.text', 'Business created successfully')
        cy.get('.delete').click()

        cy.get('#root > :nth-child(2) > :nth-child(1)').should('have.text', 'Fourth business')
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

        cy.get('[href="/businesses/4/edit"] > .mx-5').click()

        cy.get('.input.is-medium').should('have.value', 'Fourth business')
    })

    it('Updates a business', () => {
        cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-update-show'
        })
        cy.intercept('PATCH', `${Cypress.env('apiUrl')}/businesses/4`, {
            statusCode: 200,
            fixture: 'business-update-post'
        })

        cy.get('.input.is-medium').clear().type('Edited business!')
        cy.get('.textarea').type('{enter}Has been edited!')

        cy.get('.mr-1').click()
        cy.get('[placeholder="123 Coder St"]').clear().type('116 Updated Road')

        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.get('.delete').click()
        cy.get('#root > :nth-child(2) > :nth-child(1)').should('have.text', 'Edited business!')
        cy.get(':nth-child(2) > p').contains('116 Updated Road')
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

    // it ('Deletes a business', () => {
    //     cy.visit(`${Cypress.env('siteUrl')}/businesses/4`)

    //     cy.get().click()
    // })
})
