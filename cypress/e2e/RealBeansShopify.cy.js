describe('General', () => {
    it('Dev Login', () => {
        cy.visit('https://r0989526-realbeans.myshopify.com/')
        cy.get('input[name="password"]').type('rickee');
        cy.get('button[type="submit"]').click();
    })
})


describe('HomePage', () => {
    beforeEach(() => {
        cy.visit('https://r0989526-realbeans.myshopify.com/')
        cy.get('input[name="password"]').type('rickee');
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    });


    it('should display the banner image and welcome text', () => {
        // Check that the banner image is visible
        cy.get('[id="Banner-template--25043524190541__image_banner_QgnWFB"]')
        .should('be.visible')

        // Check that the heading text "Welcome!" is visible
        cy.get('.banner__heading')
        .should('be.visible')
        .and('have.text', '\n              Welcome!\n            ');

        // Check that the paragraph with RealBeans description is present
        cy.get('.banner__text p')
        .should('be.visible')
        .and('contain.text', 'Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care.');
    });

    it('should display Blended coffee 5kg on the featured collection slider', () => {
        // Wait for the slider to load
        cy.get('#Slider-template--25043524190541__featured-collection')
        .should('exist');

        // Check if the coffee product titles are visible
        cy.contains('Blended coffee 5kg')
        cy.contains('Roasted coffee beans 5kg')
    });

    it('should navigate to Blended Coffee collection', () => {
        // Check if blended collection navigation works
        cy.get('a[href="/collections/blended-coffee"]:visible')
        .should('be.visible')
        .click();

    });

    it('should navigate to Roasted Coffee collection', () => {
        // Check if roasted collection navigation works
        cy.get('a[href="/collections/roasted-coffee"]:visible')
        .should('be.visible')
        .click();
    });
})


describe('AboutPage', () => {
    beforeEach(() => {
        cy.visit('https://r0989526-realbeans.myshopify.com/')
        cy.get('input[name="password"]').type('rickee');
        cy.get('button[type="submit"]').click();
        cy.get('#HeaderMenu-about').click();
        cy.wait(500);
    });

    it('should display the company banner image', () => {
        // Check if the image company logo is visible
        cy.get('img[src*="RealBeans_banner.jpg"]').should('be.visible');
    });

    it('should display the company history text', () => {
        // Check if the description text correct and visible
        cy.contains('From a small Antwerp grocery to a European coffee staple').should('be.visible');
    });

})


describe('CatalogePage', () => {
    beforeEach(() => {
        cy.visit('https://r0989526-realbeans.myshopify.com/')
        cy.get('input[name="password"]').type('rickee');
        cy.get('button[type="submit"]').click();
        cy.get('#HeaderMenu-catalog').click();
        cy.wait(500);
    });


    it('should display the product grid with products inside', () => {
        // Check product grid exists
        cy.get('#product-grid').should('exist');

        // Check if products exist
        cy.get('#product-grid > li.grid__item').should('exist');
    });

    it('A product is in stock', () => {
        cy.get('#ProductCountDesktop').should('contain.text', 'products');

        // Open availability filter with force
        cy.get('summary[aria-label^="Availability"]').click({ force: true });

        // Check "In stock" with force
        cy.get('input[name="filter.v.availability"][value="1"]').check({ force: true });

        // Wait for filter to apply
        cy.wait(1000);

        // Verify at least one product is displayed
        cy.get('.product-grid').should('have.length.greaterThan', 0);
    });


    it('checks if price sorting changes order', () => {
        // Set filter to accending
        cy.get('#SortBy').select('price-ascending');
        cy.wait(2000);

        cy.get('#product-grid li .card__heading')
            .then($namesAsc => {
            const namesAsc = [...$namesAsc].map(el => el.innerText.trim());

            // Set filter to descending
            cy.get('#SortBy').select('price-descending');
            cy.wait(2000);

            // Compare filter grids
            cy.get('#product-grid li .card__heading')
                .should($namesDesc => {
                const namesDesc = [...$namesDesc].map(el => el.innerText.trim());
                expect(namesDesc).to.not.deep.equal(namesAsc);
                });
            });
    });
})

describe('DetailPage', () => {
    beforeEach(() => {
        cy.visit('https://r0989526-realbeans.myshopify.com/')
        cy.get('input[name="password"]').type('rickee');
        cy.get('button[type="submit"]').click();
        cy.get('#HeaderMenu-catalog').click();
        cy.get('.grid__item').first().click();
        cy.wait(2000);
    });


    it('checks if the product image is displayed correctly', () => {
        // Target the image inside the product media 
        cy.get('.product__media img')
            .and(($img) => {
            // Check the src attribute contains expected URL fragment
            expect($img).to.have.attr('src').and.to.include('RealBeansBlendBag.png');

            // Check that alt attribute exists (can be empty string)
            expect($img).to.have.attr('alt');
            });
    });

    it('checks if the product title is displayed correctly', () => {
        // target the product title and check its visibility and text
        cy.get('.product__title h1')
            .should('be.visible')
            .and('have.text', 'Blended coffee 5kg');
    });


    const variants = [
        { name: 'Robusta', price: '€55,00 EUR' },
        { name: 'Excelsa', price: '€60,00 EUR' },
        { name: 'Arabica', price: '€60,00 EUR' },
        { name: 'Liberica', price: '€65,00 EUR' },

    ];

    variants.forEach(({ name, price }) => {
    it(`selects variant "${name}" and checks price is "${price}"`, () => {
      // Select the variant radio button
      cy.get(`input[type="radio"][value="${name}"]`).check({ force: true });

      // Wait for price to update if necessary
      cy.wait(500);

      // Verify the displayed price
      cy.get('#price-template--25043524387149__main .price-item--sale')
        .should('contain.text', price);
    });
  });

})


describe('RealBeans User Journey', () => {
    beforeEach(() => {
        cy.visit('https://r0989526-realbeans.myshopify.com/')
        cy.get('input[name="password"]').type('rickee');
        cy.get('button[type="submit"]').click();
        cy.wait(500);
    });

  it('a user logs in, explores products, navigates collections, and filters by availability, and select a varient in a product.', () => {
    // Check homepage banner and welcome text
    cy.get('[id^="Banner-template"]').should('be.visible');
    cy.get('.banner__heading').should('contain.text', 'Welcome!');
    cy.get('.banner__text p').should('contain.text', 'Since 1801, RealBeans has roasted premium coffee');

    // Check featured products in the slider
    cy.get('#Slider-template--25043524190541__featured-collection').should('exist');
    cy.contains('Blended coffee 5kg').should('exist');
    cy.contains('Roasted coffee beans 5kg').should('exist');


    // Navigate to Blended Coffee collection and verify URL
    cy.get('a[href="/collections/blended-coffee"]:visible').click();
    cy.url().should('include', '/collections/blended-coffee');
    cy.wait(500);

    // Navigate back to homepage for next navigation
    cy.get('a.header__heading-link[href="/"]').click({ force: true });
    cy.wait(500);


    // Navigate to Roasted Coffee collection and verify URL
    cy.get('a[href="/collections/roasted-coffee"]:visible').click();
    cy.url().should('include', '/collections/roasted-coffee');
    cy.wait(500);

    // Go to Catalog page using header menu
    cy.get('#HeaderMenu-catalog').click();

    // Check product grid presence and products loaded
    cy.get('#product-grid').should('exist');
    cy.get('#product-grid > li.grid__item').should('exist');

    // Filter products by availability "In stock"
    cy.get('#ProductCountDesktop').should('contain.text', 'products');
    cy.get('summary[aria-label^="Availability"]').click({ force: true });
    cy.get('input[name="filter.v.availability"][value="1"]').check({ force: true });
    cy.wait(500);

    // Check filtered product count and that at least one product is avaliable
    cy.get('#ProductCountDesktop').invoke('text').then(text => {
      expect(text).to.match(/\d+ products/);
    });

    cy.get('.product-grid').should('have.length.greaterThan', 0);

    // Wait for catalog to load and click first product in grid
    cy.get('.grid__item').first().click();
    cy.wait(500);

    // Select a variant type by visible label (e.g., Arabica)
    const typeToSelect = 'Arabica';
    cy.contains('label', typeToSelect).click();
    cy.wait(500);

    // Confirm the radio button is selected
    cy.get(`input[type="radio"][value="${typeToSelect}"]`).should('be.checked');
    cy.wait(500);

    // Navigate back to homepage
    cy.get('a.header__heading-link[href="/"]').click({ force: true });
  });
});
