import { render, screen } from '@testing-library/react' // 5c
import Blog from './Blog'
import LikeButton from './LikeButton'
import userEvent from '@testing-library/user-event' // 5c
import BlogForm from './BlogForm'

describe('<Blog />', () => {

  test('The blog creation form calls the event handler it received as props with the right details when a new blog is created', async () => {

    const blog = {
        title: 'test title',
        author: 'test author',
        url:'test url',
        likes:0
    }
    
    const createBlog = vi.fn()
    const user = userEvent.setup()
    
    const { container } = render(<BlogForm createBlog={createBlog}/>) // NYT SIIS ON FORM, SITÄ PITÄS TÄYTTÄÄ!
    const title = container.querySelector('#title') // works
    const author = container.querySelector('#author') // works
    const url = container.querySelector('#url') // works
    //const fields = screen.getAllByRole('textbox') // works
    // const title = fields[0] // WORKS
    // const author = fields[1] // WORKS
    // const url = fields[2] // WORKS
    const saveButton = screen.getByText('save')
    // //console.log("title, author, url:",title,author, url)

    await user.type(title, 'test title')
    await user.type(author, 'test author')
    await user.type(url, 'test url')
    await user.click(saveButton)



    //console.log("container:", container)

    console.log("createBlog.mock.calls[0][0].title:", createBlog.mock.calls[0][0].title)
    
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('test title') // test: did the BlogForm call the createBlog function with object with title "test title"?
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('test url')
    })

})