const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset') // NB!, 3 things: (1) DELETES ALL USERS AND BLOGS from test DB! (2) This abbreviated url works thanks to playwright.config.js's use: {baseUrl:'http://localhost:5173'). (3) since there's a proxy from front (5173) to back (3001), it doesn't matter which one you're using here - both work (5173 and 3001)
    await request.post('/api/users', {
      data: {
        name: 'Third Dude', // the same Third Dude I've been using before
        username: 'Third Dude',
        password: '12345'
      }
    })

    await request.post('/api/users', {
        data: {
          name: 'WRONG DUDE', // for checking if another blogger's blog can be deleted (wanted situation: another user's blog cannot be deleted)
          username: 'WRONG DUDE',
          password: '54321'
        }
      })

    await page.goto('/') // '/' = http://localhost:5173, = playwright.config.js's "baseUrl"
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('login')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Blog app, Ad Hoccer 2024')).toBeVisible()
    expect(page.getByText('username')).not.toBeNull() // another way of writing, ".not.toBeNull"
    expect(page.getByText('password')).not.toBeNull()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Third Dude', '12345')    
        await expect(page.getByText('logged in as Third Dude')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Third DuuuUUUUUUUUUUUde!', '12345')    
        await expect(page.getByText('logged in as Third Dude')).not.toBeVisible()
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Third Dude', '12345')
            await expect(page.getByText('logged in as Third Dude')).toBeVisible()
        })
      
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'test blog title','test blog author','test blog url')      
            await expect(page.getByText('test blog title, test blog author')).toBeVisible()
            await expect(page.getByText('show more')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'test blog title','test blog author','test blog url')      
            await page.getByRole('button', { name: 'show more' }).click()
            expect(page.getByTestId('like-button')).toContainText('like 0👍')
            await page.getByTestId('like-button').click()
            expect(page.getByTestId('like-button')).toContainText('nah 1👍')
        })

        test('a blog can be deleted by the user who created it', async ({ page }) => {
            await createBlog(page, 'test blog title','test blog author','test blog url')
            await expect(page.getByText('test blog title, test blog author')).toBeVisible()
            
            page.on('dialog', async dialog => { // set up in advance; this is called when dialog occurs
                if (dialog.message() === 'Are you sure you want to remove the blog "test blog title" by "test blog author"?') {
                    await dialog.accept();
                } else {
                    await dialog.dismiss();
                }
            });

            await page.getByRole('button', { name: 'delete' }).click() // the above dialog handler should be called

            await expect(page.getByText('test blog title, test blog author')).not.toBeVisible()
        })

        test('the delete button is visible only to the person who added the blog', async ({ page }) => {
            // Third Dude is logged-in
            await createBlog(page, 'test blog title','test blog author','test blog url')
            await expect(page.getByText('test blog title, test blog author')).toBeVisible()
            expect(page.getByRole('button', { name: 'delete' })).toBeVisible()  // delete-button visible to the person who created it
            await page.getByRole('button', { name: 'logout' }).click()

            await loginWith(page, 'WRONG DUDE', '54321')    
            await expect(page.getByText('logged in as WRONG DUDE')).toBeVisible()
            await expect(page.getByText('test blog title, test blog author')).toBeVisible() 
            expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()  // NOT visible to other users
            
        })

        test('blogs are arranged in order according to the number of likes, the blog with the most likes first', async({ page, request }) => {
            // NB! My blog app has the functionality to increase by ONE LIKE at a time only - to like more, you need to (a) relogin, or (b) refresh. That's why I'm using the "await page.reload()"s after every like c:
            // NB! logging out, then logging back in, in the tests, for whatever unknown reason, does NOT  persist the number of likes. Hence, I used await page.reload() (also it's more convenient)
            await createBlog(page, 'blog 1','author 1','www.url.is_1')      // 1 like
            await page.getByRole('button', { name: 'show more' }).first().click()

            // LB
            await page.getByTestId('like-button').first().click()                   // give 1 like to blog 1

            await page.getByRole('button', { name: 'less' }).first().click()        // hide it, let's simplify things so that there are not many like buttons visible at a time c:

            await createBlog(page, 'blog 0','author 0','www.url.is_0')              // 0 likes
            await page.getByText('blog 0, author 0').waitFor() // WORKS!            // wait that it shows up. Should be unnecessary, but since webkit or chromium messes up occasionally, I dunno where the problem is

            await createBlog(page, 'blog 2','author 2','www.url.is_2')              // now still 0 likes; goal is to give 2
            await page.getByText('blog 2, author 2').waitFor() // WORKS!
            
            // THIS WORKS! The number of likes persists. FOR WHATEVER REASON, UNLIKE IN MY BROWSERS (dev build or test build), AFTER LOGOUT IN DEBUGGER THE NUMBER OF LIKES DOESN'T PERSIST unlike by doing this (browser refresh in-between likes), where the number of likes persists, as wanted and expected! THAT DOESN'T MAKE ANY SENSE SINCE THE BLOGS THEMSELVES DO PERSIST AND IN MY BROWSER (NTO PLAYWRIGHT DEBUGGER) EVERYTHING WORKS - YES, IN BOTH TEST MODE AND DEV MODE...
            await page.reload() 

            await page.getByRole('button', {name: 'show more'}).last().click()      // show the like button of the newcomer, i.e. the third one (index is [2])
            await page.getByText('blog 2, author 2').waitFor()                      // wait that blog 2 appears
            
            // LB
            await page.getByTestId('like-button').click()   // the only like button VISIBLE atm
            
            await page.reload()

            // show more (i.e. the like buttons) for all. AT THIS POINT: blog 1 (1 like), blog 2 (1 like), blog 0 (0 likes)
            await page.getByRole('button', {name:'show more'}).first().click()  
            await page.getByText('blog 1, author 1').waitFor()
            await page.getByRole('button', {name:'show more'}).first().click() // the second one is blog 2
            await page.getByText('blog 2, author 2').waitFor()

            // at this point, blog 1 with 1 like, and blog 2 with 1 like are visible


            await page.getByTestId('like-button').last().click()    // number of likes for blog 2: 2, at this point

            await page.reload()                                     // now, blog 2, with 2 likes, is listed first. Second comes blog 1 with 1 like, last comes blog 0 with 0 likes.

            
            // CHECKS: open the first one (show more) -> 2 likes should be visible; open second one (show more), close 1st one -> 1 likes visible, then 0. This is unlike the original order
            await page.getByRole('button', {name:'show more'}).first().click()      // show the first like button (2 likes)
            await page.getByText('blog 2, author 2').waitFor()                      // wait for it..

            expect(page.getByTestId('like-button')).toContainText('like 2👍')       // mysteriously, sometimes 2x "like 1" - webkit or chromium messes this up. Don't ask how!
            expect(page.getByRole('button', {name: 'like 1👍'})).not.toBeVisible()

            await page.getByRole('button', {name:'show more'}).first().click()  // open the second one
            await page.getByRole('button', {name:'less'}).first().click()       // CLOSE THE FIRST ONE (with 2 likes). This ensures that there are not two "like 1":s visible, which sometimes breaks this test. Goddamn flaky piece of s***.
            await page.getByText('blog 1, author 1').waitFor()

            expect(page.getByRole('button', {name: 'like 1👍'})).toBeVisible()
            expect(page.getByRole('button', {name: 'like 0👍'})).not.toBeVisible()
            
            //await page.waitForTimeout(500)
            await page.getByRole('button', {name:'show more'}).last().click()  // open the third one. Sometimes this fails (flaky)
            
            //await page.waitForTimeout(500)
            await page.getByText('like 0👍').waitFor() // WORKS!
            expect(page.getByRole('button', {name: 'like 0👍'})).toBeVisible()
            await page.getByRole('button', {name:'logout'}).click()  // logout since the test is stupid
            
            
        })
      })
  })
})