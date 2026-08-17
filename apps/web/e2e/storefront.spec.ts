import { expect, test } from '@playwright/test'

test('customer browses, selects a variant, and adds it to the cart', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /discover the jewelry/i }).click()
  await page.getByRole('link', { name: /Layali Necklace/i }).first().click()
  await page.locator('button:visible').filter({ hasText: /add to my selection/i }).click()
  await page.getByRole('link', { name: /my selection: 1/i }).click()
  await expect(page.getByRole('heading', { name: /your selection/i })).toBeVisible()
})

test('featured catalogue button keeps its burgundy color while interacting', async ({ page }) => {
  await page.goto('/')
  const button = page.getByRole('link', { name: /view all jewelry/i }).last()
  await expect(button).toBeVisible()

  const originalColor = await button.evaluate((element) => getComputedStyle(element).backgroundColor)
  await button.hover()
  await expect.poll(() => button.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(originalColor)

  await button.focus()
  await expect.poll(() => button.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(originalColor)

  const box = await button.boundingBox()
  if (!box) throw new Error('Featured catalogue button has no bounding box')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await expect.poll(() => button.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(originalColor)
  await page.mouse.up()
})

test('product image uses compact responsive proportions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/products/layali-necklace')
  const productImage = page.getByRole('img', { name: 'Layali Necklace', exact: true })
  await expect(productImage).toBeVisible()

  const mobileBox = await productImage.boundingBox()
  if (!mobileBox) throw new Error('Product image has no mobile bounding box')
  expect(mobileBox.width / mobileBox.height).toBeCloseTo(1, 1)

  await page.setViewportSize({ width: 1440, height: 900 })
  const desktopBox = await productImage.boundingBox()
  if (!desktopBox) throw new Error('Product image has no desktop bounding box')
  expect(desktopBox.width / desktopBox.height).toBeCloseTo(1.25, 1)
})

test('product page prioritizes the selection without a duplicate green WhatsApp action', async ({ page }) => {
  await page.goto('/products/layali-necklace')

  await expect(page.getByRole('link', { name: 'Order this piece on WhatsApp' })).toHaveCount(0)
  const purchasePanel = page.getByRole('complementary', { name: 'Product purchase details' })
  await expect(purchasePanel).toBeVisible()
  const availability = purchasePanel.getByText(/^Available/)
  await expect(availability).toBeVisible()
  await expect.poll(() => availability.evaluate((element) => getComputedStyle(element).color)).toBe('rgb(104, 31, 50)')

  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.getByText('Choisir la finition')).toBeVisible()
})

test('product share button copies the product link when native sharing is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text: string) => {
          ;(window as Window & { __copiedProductLink?: string }).__copiedProductLink = text
        },
      },
      configurable: true,
    })
  })
  await page.goto('/products/layali-necklace')

  await page.getByRole('button', { name: 'Share' }).click()

  await expect.poll(() => page.evaluate(() => (window as Window & { __copiedProductLink?: string }).__copiedProductLink)).toContain('/products/layali-necklace')
  await expect(page.getByRole('button', { name: 'Link copied' })).toBeVisible()
})

test('product share button uses native sharing when available', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      value: async (data: ShareData) => {
        ;(window as Window & { __sharedProduct?: ShareData }).__sharedProduct = data
      },
      configurable: true,
    })
  })
  await page.goto('/products/layali-necklace')

  await page.getByRole('button', { name: 'Share' }).click()

  const shared = await page.evaluate(() => (window as Window & { __sharedProduct?: ShareData }).__sharedProduct)
  expect(shared?.title).toBe('Layali Necklace')
  expect(shared?.url).toContain('/products/layali-necklace')
})

test('mobile header hides search and Instagram while desktop keeps them', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const header = page.locator('header')
  const search = header.getByRole('link', { name: 'Search', exact: true })
  const instagram = header.getByRole('link', { name: 'Instagram Casa de Perla', exact: true })

  await expect(search).toBeHidden()
  await expect(instagram).toBeHidden()

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(search).toBeVisible()
  await expect(instagram).toBeVisible()
})

test('premium homepage presents all jewelry categories in one balanced desktop row', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  const categoryCards = page.locator('main a[href^="/catalogue?category="]')
  await expect(categoryCards).toHaveCount(5)

  const boxes = await categoryCards.evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect()
    return { top: box.top, width: box.width, height: box.height }
  }))

  expect(Math.max(...boxes.map((box) => box.top)) - Math.min(...boxes.map((box) => box.top))).toBeLessThan(2)
  expect(Math.max(...boxes.map((box) => box.height)) - Math.min(...boxes.map((box) => box.height))).toBeLessThan(2)
  expect(boxes.every((box) => box.width > 180 && box.height > box.width)).toBe(true)
})

test('header uses a transparent wrapper around its floating charcoal-plum shell', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const header = page.locator('header')
  const shell = header.locator(':scope > div')

  await expect.poll(() => header.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  await expect.poll(() => shell.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(48, 42, 46)')
  expect(await shell.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius))).toBeGreaterThanOrEqual(20)
  await expect(header.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link')).toHaveCount(4)
  await expect(header.getByRole('button', { name: 'Change language' })).toBeVisible()
  await expect(header.getByRole('link', { name: /My selection:/i })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Search' })).toBeVisible()
  await expect(header.getByRole('link', { name: 'Instagram Casa de Perla' })).toBeVisible()
})

test('delivery announcement uses a compact premium hierarchy on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  const announcement = page.getByRole('region', { name: 'Delivery announcement' })
  await expect(announcement).toBeVisible()
  await expect(announcement.getByText('Complimentary delivery from')).toBeVisible()
  await expect(announcement.getByText('International delivery available')).toBeVisible()
  const threshold = announcement.getByText('500 MAD', { exact: true })
  await expect.poll(() => threshold.evaluate((element) => getComputedStyle(element).color)).toBe('rgb(184, 137, 61)')
  expect((await announcement.boundingBox())?.height).toBeLessThanOrEqual(36)

  await page.setViewportSize({ width: 390, height: 844 })
  expect((await announcement.boundingBox())?.height).toBeLessThanOrEqual(52)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('our story presents a concise bilingual artisan narrative', async ({ page }) => {
  await page.goto('/about')

  await expect(page.getByRole('heading', { name: 'Jewelry shaped by hand, carried by story.' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Bijoux artisanaux Casa de Perla' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Craft signatures' }).getByRole('listitem')).toHaveCount(3)

  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.getByRole('heading', { name: 'Des bijoux façonnés à la main, portés par une histoire.' })).toBeVisible()
})

test('contact offers direct bilingual WhatsApp and Instagram paths', async ({ page }) => {
  await page.goto('/contact')

  await expect(page.getByRole('heading', { name: "Let's find the piece that feels like yours." })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Write on WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\//)
  await expect(page.getByRole('link', { name: 'Follow on Instagram' })).toHaveAttribute('href', 'https://instagram.com/casadeperla.jewelry')
  await expect(page.getByRole('link', { name: 'WhatsApp support' })).toBeHidden()

  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.getByRole('heading', { name: 'Trouvons la pièce qui vous ressemble.' })).toBeVisible()
})

test('contact card keeps compact balanced spacing below the header and above the footer', async ({ page }) => {
  await page.setViewportSize({ width: 1340, height: 596 })
  await page.goto('/contact')

  const headerBox = await page.locator('header').boundingBox()
  const cardBox = await page.locator('main aside').boundingBox()
  const footerBox = await page.locator('footer').boundingBox()
  if (!headerBox || !cardBox || !footerBox) throw new Error('Contact layout is missing a measured region')

  const topGap = cardBox.y - (headerBox.y + headerBox.height)
  const bottomGap = footerBox.y - (cardBox.y + cardBox.height)
  expect(topGap).toBeGreaterThanOrEqual(36)
  expect(topGap).toBeLessThanOrEqual(60)
  expect(bottomGap).toBeGreaterThanOrEqual(36)
  expect(bottomGap).toBeLessThanOrEqual(60)
})

test('navigation starts every destination page at the top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/catalogue')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(500)

  await page.locator('header').getByRole('link', { name: 'Home', exact: true }).click()
  await expect(page).toHaveURL('/')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1)
})

test('catalogue presents one concise introduction and one compact control region', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/catalogue')

  const controls = page.locator('.catalog-toolbar')
  await expect(controls).toBeVisible()
  await expect(controls.getByRole('button', { pressed: true })).toHaveCount(1)
  await expect(controls.getByRole('button', { name: /Earrings|Boucles d'oreilles/i })).toHaveCount(0)
  await expect(controls.getByRole('button', { name: /Rings|Bagues/i })).toHaveCount(0)
  await expect(controls.getByRole('button', { name: /Gift sets|Coffrets cadeaux/i })).toHaveCount(0)
  await expect(controls.getByText(/In stock only|Disponibles/i)).toHaveCount(0)
  const allJewelry = controls.getByRole('button', { name: /All jewelry|Tous les bijoux/i })
  const sorting = controls.getByRole('button', { name: /Sort by.*(Favorites|Featured)|Classer par.*Nos favoris/i })
  const allBox = await allJewelry.boundingBox()
  const sortBox = await sorting.boundingBox()
  if (!allBox || !sortBox) throw new Error('Compact catalogue controls are missing')
  expect(Math.abs(allBox.y - sortBox.y)).toBeLessThanOrEqual(2)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})

test('mobile catalogue gives every product a full-width premium card and tablet keeps two columns', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalogue')

  const cards = page.locator('main article')
  await expect(cards).toHaveCount(10)
  const mobileCards = await cards.evaluateAll((elements) => elements.slice(0, 2).map((element) => {
    const box = element.getBoundingClientRect()
    return { x: box.x, top: box.top, width: box.width, height: box.height }
  }))
  expect(mobileCards[0].width).toBeGreaterThanOrEqual(350)
  expect(Math.abs(mobileCards[0].x - mobileCards[1].x)).toBeLessThan(2)
  expect(mobileCards[1].top).toBeGreaterThan(mobileCards[0].top + mobileCards[0].height)

  await page.setViewportSize({ width: 768, height: 1024 })
  const tabletCards = await cards.evaluateAll((elements) => elements.slice(0, 2).map((element) => {
    const box = element.getBoundingClientRect()
    return { top: box.top, width: box.width }
  }))
  expect(Math.abs(tabletCards[0].top - tabletCards[1].top)).toBeLessThan(2)
  expect(tabletCards.every((card) => card.width >= 330)).toBe(true)
})

test('mobile homepage starts with an image-only hero and a two-column product grid', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')

  const hero = page.getByTestId('home-hero')
  await expect(hero).toBeVisible()
  await expect(page.locator('section[aria-label="Comment commander"]')).toHaveCount(0)
  await expect(hero.getByRole('link')).toHaveAttribute('href', '/catalogue')
  await expect(hero.getByRole('heading')).toHaveCount(0)
  const heroBox = await hero.boundingBox()
  if (!heroBox) throw new Error('Mobile homepage hero is missing')
  expect(heroBox.height).toBeLessThanOrEqual(222)

  const mobileProducts = page.getByTestId('mobile-home-products')
  await expect(mobileProducts).toBeVisible()
  const cards = mobileProducts.locator(':scope > a')
  expect(await cards.count()).toBeGreaterThan(2)
  const boxes = await cards.evaluateAll((elements) => elements.slice(0, 3).map((element) => {
    const box = element.getBoundingClientRect()
    return { x: box.x, top: box.top, width: box.width, height: box.height }
  }))
  expect(boxes.slice(0, 2).every((box) => box.width >= 130)).toBe(true)
  expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(2)
  expect(boxes[1].x).toBeGreaterThan(boxes[0].x + boxes[0].width)
  expect(boxes[2].top).toBeGreaterThan(boxes[0].top + boxes[0].height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})

test('desktop homepage presents an image-only hero and premium product gallery', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')

  await expect(page.getByTestId('home-hero')).toBeVisible()
  await expect(page.getByTestId('desktop-home-products')).toBeVisible()
  await expect(page.getByTestId('mobile-home-products')).toBeHidden()
  await expect(page.getByTestId('home-hero').getByRole('heading')).toHaveCount(0)
  await expect(page.locator('section[aria-label="Comment commander"]')).toHaveCount(0)
})

test('mobile chrome stays compact without a floating WhatsApp shortcut', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const headerShell = page.locator('header > div')
  const mobileNav = page.getByRole('navigation', { name: 'Mobile primary navigation' })
  const whatsapp = page.getByRole('link', { name: 'WhatsApp support' })
  const shellBox = await headerShell.boundingBox()
  const navBox = await mobileNav.boundingBox()
  if (!shellBox || !navBox) throw new Error('Mobile chrome is missing a measured element')

  expect(shellBox.height).toBeLessThanOrEqual(60)
  await expect(whatsapp).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('mobile product page exposes a dedicated purchase action above navigation', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/products/layali-necklace')

    const purchaseBar = page.getByRole('region', { name: /Actions d’achat sur mobile|Mobile purchase actions/i })
    const mobileNav = page.getByRole('navigation', { name: /Navigation principale mobile|Mobile primary navigation/i })
    await expect(purchaseBar).toBeVisible()
    await expect(purchaseBar.getByRole('button')).toHaveCount(2)
    await expect(purchaseBar.getByText(/MAD/)).toHaveCount(0)
    await expect(purchaseBar.getByText('Layali Necklace')).toHaveCount(0)
    const purchaseBox = await purchaseBar.boundingBox()
    const navBox = await mobileNav.boundingBox()
    if (!purchaseBox || !navBox) throw new Error('Mobile purchase controls are missing a measured region')
    expect(purchaseBox.y + purchaseBox.height).toBeLessThanOrEqual(navBox.y - 4)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)

    const titleSize = await page.locator('main h1').evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))
    expect(titleSize).toBeGreaterThanOrEqual(28)
    expect(titleSize).toBeLessThanOrEqual(30)
    await expect(page.locator('main aside').getByRole('button', { name: 'Commander via WhatsApp' })).toBeHidden()
    await expect(page.locator('main aside').getByRole('button', { name: /Ajouter à ma sélection|Add to my selection/i })).toBeHidden()
    await expect(page.locator('main details').first()).not.toHaveAttribute('open', '')
  }

  await page.goto('/catalogue')
  await expect(page.getByRole('region', { name: /Actions d’achat sur mobile|Mobile purchase actions/i })).toHaveCount(0)
})

test('mobile story leads with readable copy and a compact editorial image', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/about')

  const heading = page.getByRole('heading', { name: 'Jewelry shaped by hand, carried by story.' })
  const image = page.getByRole('img', { name: 'Bijoux artisanaux Casa de Perla' })
  const headingBox = await heading.boundingBox()
  const imageBox = await image.boundingBox()
  if (!headingBox || !imageBox) throw new Error('Story layout is missing its main content')
  expect(headingBox.y).toBeLessThan(imageBox.y)
  expect(imageBox.height).toBeLessThanOrEqual(340)
})

test('mobile cart and checkout use comfortable touch targets and fields', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/products/layali-necklace')
  await page.getByRole('region', { name: 'Mobile purchase actions' }).getByRole('button', { name: /add to my selection/i }).click()
  await page.getByRole('link', { name: /my selection: 1/i }).click()

  const remove = page.getByRole('button', { name: 'Remove Layali Necklace' })
  const removeBox = await remove.boundingBox()
  if (!removeBox) throw new Error('Cart remove action is missing')
  expect(removeBox.width).toBeGreaterThanOrEqual(44)
  expect(removeBox.height).toBeGreaterThanOrEqual(44)

  await page.locator('a[href="/checkout"]').click()
  const firstName = page.getByLabel(/first name/i)
  const fieldBox = await firstName.boundingBox()
  if (!fieldBox) throw new Error('Checkout first-name field is missing')
  expect(fieldBox.height).toBeGreaterThanOrEqual(52)
  expect(await firstName.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16)
})

test('narrow mobile checkout keeps every field inside the form and gives the phone number a full row', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/products/layali-necklace')
  await page.getByRole('region', { name: 'Mobile purchase actions' }).getByRole('button', { name: /add to my selection/i }).click()
  await page.getByRole('link', { name: /my selection: 1/i }).click()
  await page.locator('a[href="/checkout"]').click()

  const country = page.getByRole('combobox', { name: 'Country code' })
  const telephone = page.getByLabel(/telephone/i)
  const countryBox = await country.boundingBox()
  const telephoneBox = await telephone.boundingBox()
  if (!countryBox || !telephoneBox) throw new Error('International phone controls are missing')

  expect(countryBox.y + countryBox.height).toBeLessThanOrEqual(telephoneBox.y)
  expect(countryBox.width).toBeLessThan(telephoneBox.width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)

  const formControlBoxes = await page.locator('main form input, main form select, main form textarea').evaluateAll((elements) => elements.map((element) => {
    const box = element.getBoundingClientRect()
    return { left: box.left, right: box.right }
  }))
  expect(formControlBoxes.every((box) => box.left >= 0 && box.right <= 320)).toBe(true)
})

test('mobile footer is grouped into a concise premium block', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/about')

  const footer = page.locator('footer')
  const footerBox = await footer.boundingBox()
  if (!footerBox) throw new Error('Footer is missing')
  expect(footerBox.height).toBeLessThanOrEqual(650)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('tablet product collections keep readable two-column cards', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/')

  const featured = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Jewelry made to be remembered.' }) })
  const cards = featured.locator('article')
  await expect(cards).toHaveCount(4)
  const boxes = await cards.evaluateAll((elements) => elements.slice(0, 3).map((element) => {
    const box = element.getBoundingClientRect()
    return { top: box.top, width: box.width }
  }))
  expect(boxes[0].width).toBeGreaterThanOrEqual(330)
  expect(Math.abs(boxes[0].top - boxes[1].top)).toBeLessThan(2)
  expect(boxes[2].top).toBeGreaterThan(boxes[0].top)
})

test('mobile navigation keeps the previous compact floating dimensions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: /Navigation principale mobile|Mobile primary navigation/i })
  const home = nav.getByRole('link', { name: /Accueil|Home/i })
  const navBox = await nav.boundingBox()
  const homeBox = await home.boundingBox()
  if (!navBox || !homeBox) throw new Error('Mobile navigation is missing a measured element')

  expect(navBox.x).toBeGreaterThanOrEqual(11)
  expect(navBox.x).toBeLessThanOrEqual(13)
  expect(navBox.width).toBeGreaterThanOrEqual(365)
  expect(navBox.width).toBeLessThanOrEqual(367)
  expect(844 - (navBox.y + navBox.height)).toBeGreaterThanOrEqual(7)
  expect(844 - (navBox.y + navBox.height)).toBeLessThanOrEqual(9)
  expect(await nav.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius))).toBe(6)
  expect(homeBox.height).toBeGreaterThanOrEqual(56)

  await nav.getByRole('link', { name: 'Catalogue', exact: true }).click()
  await expect(nav.getByRole('link', { name: /Catalogue/i })).toHaveAttribute('aria-current', 'page')

  await page.setViewportSize({ width: 768, height: 1024 })
  const tabletBox = await nav.boundingBox()
  if (!tabletBox) throw new Error('Tablet navigation is missing')
  expect(tabletBox.width).toBeGreaterThanOrEqual(718)
  expect(tabletBox.width).toBeLessThanOrEqual(722)
  expect(tabletBox.x).toBeGreaterThanOrEqual(23)
})

test('mobile navigation uses a lighter header tone and a distinct gold active panel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: /Navigation principale mobile|Mobile primary navigation/i })
  const active = nav.getByRole('link', { name: /Accueil|Home/i })
  const inactive = nav.getByRole('link', { name: 'Catalogue', exact: true })
  expect(await nav.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(81, 72, 77)')
  expect(await inactive.evaluate((element) => getComputedStyle(element).borderLeftWidth)).toBe('0px')
  expect(await active.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  expect(await active.locator('svg').evaluate((element) => getComputedStyle(element).color)).toBe('rgb(184, 137, 61)')
  expect(await inactive.locator('svg').evaluate((element) => getComputedStyle(element).color)).toBe('rgb(221, 211, 204)')
  expect(await active.locator('svg').evaluate((element) => Number.parseFloat(getComputedStyle(element).width))).toBe(17)
  expect(await active.locator('span').last().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))).toBe(8)
  const activeIndicator = active.locator('[data-active-panel]')
  await expect(activeIndicator).toBeVisible()
  expect(await activeIndicator.evaluate((element) => getComputedStyle(element).borderColor)).toBe('rgb(216, 169, 79)')
  expect(await activeIndicator.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(98, 87, 93)')
  const activeBox = await active.boundingBox()
  const indicatorBox = await activeIndicator.boundingBox()
  if (!activeBox || !indicatorBox) throw new Error('Active mobile navigation indicator is missing')
  expect(indicatorBox.x - activeBox.x).toBeGreaterThanOrEqual(3)
  expect(indicatorBox.x - activeBox.x).toBeLessThanOrEqual(5)
  expect(indicatorBox.y - activeBox.y).toBeGreaterThanOrEqual(3)
  expect(indicatorBox.y - activeBox.y).toBeLessThanOrEqual(5)
  expect((activeBox.x + activeBox.width) - (indicatorBox.x + indicatorBox.width)).toBeGreaterThanOrEqual(3)
  expect((activeBox.y + activeBox.height) - (indicatorBox.y + indicatorBox.height)).toBeGreaterThanOrEqual(3)

  const inactiveBox = await inactive.boundingBox()
  if (!inactiveBox) throw new Error('Inactive mobile navigation button is missing')
  await page.mouse.move(inactiveBox.x + inactiveBox.width / 2, inactiveBox.y + inactiveBox.height / 2)
  await page.mouse.down()
  expect(await inactive.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  await page.mouse.up()
})

test('footer uses warm charcoal instead of burgundy', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')
  expect(await footer.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(47, 42, 44)')
})

test('ordering from a card replaces the selection and opens the form for that product only', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/products/layali-necklace')
  await page.getByRole('region', { name: 'Mobile purchase actions' }).getByRole('button', { name: /add to my selection/i }).click()
  await page.goto('/catalogue')

  const nourCard = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Nour Pearl Earrings' }) })
  await nourCard.getByRole('button', { name: 'Order Nour Pearl Earrings via WhatsApp' }).click()

  await expect(page).toHaveURL('/checkout')
  await expect(page.getByRole('heading', { name: /your whatsapp order/i })).toBeVisible()
  await expect(page.getByText('Nour Pearl Earrings', { exact: true })).toBeVisible()
  await expect(page.getByText('Layali Necklace', { exact: true })).toHaveCount(0)
  await expect(page.getByText(/No online payment/i)).toBeVisible()
  await expect(page.getByRole('link', { name: /My selection: 1/i })).toBeVisible()
})

test('WhatsApp order form does not ask for email or postal code', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalogue')

  const layaliCard = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Layali Necklace' }) })
  await layaliCard.getByRole('button', { name: 'Order Layali Necklace via WhatsApp' }).click()

  await expect(page).toHaveURL('/checkout')
  await expect(page.getByLabel(/first name/i)).toBeVisible()
  await expect(page.getByLabel(/telephone/i)).toBeVisible()
  await expect(page.getByLabel(/city/i)).toBeVisible()
  await expect(page.getByLabel(/delivery address/i)).toBeVisible()
  await expect(page.getByLabel(/email/i)).toHaveCount(0)
  await expect(page.getByLabel(/postal code/i)).toHaveCount(0)

  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.getByLabel(/e-mail/i)).toHaveCount(0)
  await expect(page.getByLabel(/code postal/i)).toHaveCount(0)
})
