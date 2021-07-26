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
        cy.fixture('business-search_name').then((businessesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
                statusCode: 200,
                body: businessesJson
            })
        })
        cy.get('#search').type('Second{enter}')

        cy.get('.card > :nth-child(3)').should('have.text', "It's the second business...")
    })

    it('Uses checkboxes to filter the search', () => {
        cy.fixture('business-search_filter').then((businessesJson) => {
            cy.intercept(`${Cypress.env('apiUrl')}/businesses/search*`, {
                statusCode: 200,
                body: businessesJson
            })
        })

        cy.get('.is-pulled-right > :nth-child(4) > .checkbox').click()
        cy.get(':nth-child(2) > .is-primary').click()

        cy.get('.card > :nth-child(3)').should('have.text', "It's the first business...")
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
