describe('Businesses', () => {
    it('Loads the index and displays the businesses', () => {
        cy.fixture('businesses-index').then((businessesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses`, {
                statusCode: 200,
                body: businessesJson
            })
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
        cy.fixture('business-search-name').then((businessesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
                statusCode: 200,
                body: businessesJson
            })
        })
        cy.get('#search').type('Second{enter}')

        cy.get('.card > :nth-child(3)').should('have.text', "It's the second business...")
    })

    it('Uses checkboxes to filter the search', () => {
        cy.fixture('categories-index').then((categoriesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
                statusCode: 200,
                body: categoriesJson
            })
        })

        cy.fixture('business-search-filter').then((businessesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
                statusCode: 200,
                body: businessesJson
            })
            cy.get('.is-pulled-right > :nth-child(4) > .checkbox').click()
            cy.get(':nth-child(2) > .is-primary').click()
            cy.get('.card > :nth-child(3)').should('have.text', "It's the first business...")
        })
    })
})

describe('Business', () => {
    it('Views an individual business', () => {
        cy.fixture('business-show').then((businessJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses/1`, {
                statusCode: 200,
                body: businessJson
            })
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

describe('Business Owner', () => {
    it('Login as user', () => {
        cy.visit(`${Cypress.env('siteUrl')}/login`)

        cy.get('[placeholder="email@example.com"]').type('user4@user4.com')
        cy.get('[placeholder="Password"]').type('Password1')

        cy.fixture('user-login').then((userLoginJson) => {
            cy.intercept('POST', `${Cypress.env('apiUrl')}/users/login`, {
                statusCode: 200,
                body: userLoginJson
            })

            cy.get('.has-background-primary-dark').click()
        })
    })

    it('Creates a business from Profile page', () => {
        cy.fixture('user-show').then((userJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/users/4`, {
                statusCode: 200,
                body: userJson
            })
            cy.intercept(`${Cypress.env('apiUrl')}/users/4/public`, {
                statusCode: 200,
                body: userJson
            })

            cy.get('[href="/users/4"]').click()
        })


        cy.fixture('categories-index').then((categoriesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/categories`, {
                statusCode: 200,
                body: categoriesJson
            })
        })
        // Navigate to new business page
        cy.get('.container > .is-flex > .button').click()

        // Name

        // Description
        cy.get('.textarea').type("It's the fourth business...")

        // Category
        cy.get('.select').select("1")

        cy.get('.mr-1').click()

        cy.get('[placeholder="Brisbane City"]').type('Brisbane City')
        cy.get('[placeholder="QLD"]').type('QLD')

        // Errors
        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.get('.container > :nth-child(5)').should('have.text', 'Invalid business name')
        cy.get('.container > :nth-child(14)').should('have.text', 'Invalid street')
        cy.get('.container > :nth-child(19)').should('have.text', 'Invalid postcode')

        cy.get('[placeholder="Your Business"]').type('Fourth business')
        cy.get('[placeholder="123 Coder St"]').type('116 Adelaide St')
        cy.get('[placeholder="4000"]').type('4000')

        cy.fixture('business-create-post').then((businessCreatePostJson) => {
            cy.intercept('POST', `${Cypress.env('apiUrl')}/businesses`, {
                statusCode: 200,
                body: businessCreatePostJson
            })
        })
        cy.fixture('business-create-show').then((businessCreateShowJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses/4`, {
                statusCode: 200,
                body: businessCreateShowJson
            })
        })
        cy.get('div.mt-5 > .has-background-primary-dark').click()

        cy.get(':nth-child(3) > .message-header').should('be.visible').should('have.text', 'Business created successfully')
    })
})
