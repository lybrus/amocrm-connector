let password, username, domain

context('Actions', () => {
    beforeEach(async () => {
        const {
            link,
            password: p,
            username: u,
            domain: d
        } = await cy.task('getParameters')
        password = p
        username = u
        domain = d

        cy.visit(link)
    })

    // https://on.cypress.io/interacting-with-elements

    it('Get authorization code', () => {
        cy.get('[name="username"]')
            .type(username)

        cy.get('[name="password"]')
            .type(password, {
                force: true,
                log: false
            })

        cy.get('[type="submit"]')
            .click()

        cy.get('select').select(domain)

        cy.get('button.js-accept').click()

        cy.get(':contains("Access granted!")', { timeout: 6000 })
    })
})
