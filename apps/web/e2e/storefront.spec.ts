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
  const instagram = header.getByRole('link', { name: "Instagram Perle d'Orient", exact: true })

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
  await expect(header.getByRole('link', { name: "Instagram Perle d'Orient" })).toBeVisible()
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
  await expect(page.getByRole('img', { name: "Perle d'Orient artisan jewelry" })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Craft signatures' }).getByRole('listitem')).toHaveCount(3)

  await page.getByRole('button', { name: 'Change language' }).click()
  await expect(page.getByRole('heading', { name: 'Des bijoux façonnés à la main, portés par une histoire.' })).toBeVisible()
})

test('contact offers direct bilingual WhatsApp and Instagram paths', async ({ page }) => {
  await page.goto('/contact')

  await expect(page.getByRole('heading', { name: "Let's find the piece that feels like yours." })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Write on WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\//)
  await expect(page.getByRole('link', { name: 'Follow on Instagram' })).toHaveAttribute('href', 'https://instagram.com/ma.perle.dorient')
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
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/catalogue')

  await expect(page.getByRole('heading', { name: 'The collection' })).toBeVisible()
  await expect(page.getByText('The collection', { exact: true })).toHaveCount(1)
  const controls = page.getByRole('region', { name: 'Catalogue controls' })
  await expect(controls).toBeVisible()
  await expect(controls.getByRole('button', { pressed: true })).toHaveCount(1)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
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

test('mobile homepage uses a swipeable editorial category rail', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const rail = page.getByRole('region', { name: 'Jewelry categories' })
  await expect(rail).toBeVisible()
  const measurements = await rail.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    firstCardWidth: element.querySelector('a')?.getBoundingClientRect().width ?? 0,
  }))
  expect(measurements.scrollWidth).toBeGreaterThan(measurements.clientWidth)
  expect(measurements.firstCardWidth).toBeGreaterThanOrEqual(240)
})

test('mobile chrome stays compact and never lets WhatsApp overlap the bottom navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const headerShell = page.locator('header > div')
  const mobileNav = page.getByRole('navigation', { name: 'Mobile primary navigation' })
  const whatsapp = page.getByRole('link', { name: 'WhatsApp support' })
  const shellBox = await headerShell.boundingBox()
  const navBox = await mobileNav.boundingBox()
  const whatsappBox = await whatsapp.boundingBox()
  if (!shellBox || !navBox || !whatsappBox) throw new Error('Mobile chrome is missing a measured element')

  expect(shellBox.height).toBeLessThanOrEqual(60)
  expect(whatsappBox.y + whatsappBox.height).toBeLessThanOrEqual(navBox.y - 8)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('mobile product page exposes a dedicated purchase action above navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/products/layali-necklace')

  const purchaseBar = page.getByRole('region', { name: 'Mobile purchase actions' })
  const mobileNav = page.getByRole('navigation', { name: 'Mobile primary navigation' })
  await expect(purchaseBar).toBeVisible()
  await expect(purchaseBar.getByRole('button', { name: /add to my selection/i })).toBeVisible()
  const purchaseBox = await purchaseBar.boundingBox()
  const navBox = await mobileNav.boundingBox()
  if (!purchaseBox || !navBox) throw new Error('Mobile purchase controls are missing a measured region')
  expect(purchaseBox.y + purchaseBox.height).toBeLessThanOrEqual(navBox.y + 1)
})

test('mobile story leads with readable copy and a compact editorial image', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/about')

  const heading = page.getByRole('heading', { name: 'Jewelry shaped by hand, carried by story.' })
  const image = page.getByRole('img', { name: "Perle d'Orient artisan jewelry" })
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

test('mobile navigation behaves like a classic full-width bar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Mobile primary navigation' })
  const home = nav.getByRole('link', { name: 'Home', exact: true })
  const navBox = await nav.boundingBox()
  const homeBox = await home.boundingBox()
  if (!navBox || !homeBox) throw new Error('Mobile navigation is missing a measured element')

  expect(navBox.x).toBeLessThanOrEqual(1)
  expect(navBox.width).toBeGreaterThanOrEqual(389)
  expect(844 - (navBox.y + navBox.height)).toBeLessThanOrEqual(1)
  expect(await nav.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius))).toBe(0)
  expect(homeBox.height).toBeGreaterThanOrEqual(56)

  await nav.getByRole('link', { name: 'Catalogue', exact: true }).click()
  await expect(nav.getByRole('link', { name: 'Catalogue', exact: true })).toHaveAttribute('aria-current', 'page')

  await page.setViewportSize({ width: 768, height: 1024 })
  const tabletBox = await nav.boundingBox()
  if (!tabletBox) throw new Error('Tablet navigation is missing')
  expect(tabletBox.width).toBeGreaterThanOrEqual(767)
  expect(tabletBox.x).toBeLessThanOrEqual(1)
})

test('simple mobile navigation uses gold for the active icon without a filled capsule', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Mobile primary navigation' })
  const active = nav.getByRole('link', { name: 'Home', exact: true })
  const inactive = nav.getByRole('link', { name: 'Catalogue', exact: true })
  expect(await active.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)')
  expect(await active.locator('svg').evaluate((element) => getComputedStyle(element).color)).toBe('rgb(184, 137, 61)')
  expect(await inactive.locator('svg').evaluate((element) => getComputedStyle(element).color)).toBe('rgb(117, 103, 106)')
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
