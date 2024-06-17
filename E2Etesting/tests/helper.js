const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username) // data-testid='username' added in the frontend's loginForm
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}
  
const createBlog = async (page, title, author, url) => {  
    await page.getByRole('button', { name: 'create new blog' }).click()  
    //await page.getByRole ('textbox').fill(content)  
    //const inputFields = page.get
    //await inputFields[0].fill(title)
    //await page.getByTestId('title').fill(title)
    // const fields = screen.getAllByRole('textbox') // works
    // console.log("fields:", fields)
    await page.getByTestId('title').fill(title)
    //await page.getByText(title).waitFor() // 5d NB! IMPORTANT! this WAITS for all of these three (?) before continuing. USE IRL!

    await page.getByTestId('author').fill(author)
    //await page.getByText(author).waitFor() // 5d NB! IMPORTANT! this WAITS for all of these three (?) before continuing. USE IRL!

    await page.getByTestId('url').fill(url)
    //await page.getByText(url).waitFor() // 5d NB! IMPORTANT! this WAITS for all of these three (?) before continuing. USE IRL!

    await page.getByRole('button', { name: 'save' }).click()
}


export { loginWith, createBlog }