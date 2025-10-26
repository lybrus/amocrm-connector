let password, username, subdomain

context('Actions', () => {
    beforeEach(async () => {
        const {
            link,
            password: p,
            username: u,
            subdomain: d
        } = await cy.task('getParameters')
        password = p
        username = u
        subdomain = d

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

        cy.get('[type="submit"]').first()
            .click()

        cy.get('select').select(subdomain)

        cy.get('button.js-accept').click()

        cy.contains('Access granted!', { timeout: 10000 })
    })
})
