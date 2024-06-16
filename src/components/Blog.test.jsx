import { render, screen } from '@testing-library/react' // 5c
import Blog from './Blog'
import LikeButton from './LikeButton'
import userEvent from '@testing-library/user-event' // 5c

describe('<Blog />', () => {


  test('renders title and author but NOT url or likes by default', () => {
    
    const blog = {
      title: 'test title',
      author: 'test author',
      url:'test url',
      likes:0
    }

    const { container } = render(<Blog blog={blog}/>)

    const li = container.querySelector('.blog') // className = blog, so classnames are referred to by .classname
    expect(li).toHaveTextContent(
      'test title, test author' // 5c this is very simple but works; since I know I'm listing each blog in format "title, author[, url, likes]", this works c: AND since url is compulsory and each blog has at least 0 likes, this also proves that those two are NOT shown. Problem solved.
    )

    const url = screen.queryByText('test url', {exact:false}) // exact:false -> a partial text that includes this also causes the test to fail - which is what we want! This queryByText does NOT cause an exception when not found -> can test for not being found successfully c:
    expect(url).toBeNull()

    const likeButton = container.querySelector('#like-button')
    expect(likeButton).toBeNull() // this works! Nice c:
    
  })

  test("the blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
    
    const blog = {
      title: 'test title',
      author: 'test author',
      url:'test url',
      likes:0
    }

    const { container } = render(<Blog blog={blog}/>) // this has the likebutton, etc...

    const user = userEvent.setup()
    const button = screen.getByText('show more')

    await user.click(button)

    const likeButton = screen.queryByText('👍', {exact:false}) // this actually works, holy shit! It returns the whole thing!
    expect(likeButton).not.toBeNull() // this works, holy shit
    //console.log("likeButton:", likeButton)

    const url = screen.queryByText('test url')
    //console.log("url:",url)
    expect(url).not.toBeNull()
  })

  test("if the like button is clicked twice, the event handler the component received as props is called twice", async () => {
    
    const blog = {
      title: 'test title',
      author: 'test author',
      url:'test url',
      likes:0
    }
    const user = userEvent.setup()
    const mockHandler = vi.fn()
    const { container } = render(<LikeButton blog={blog} likes={blog.likes} handleLikeButtonClick={mockHandler}/>)

    const likeButton = screen.queryByText('👍', {exact:false}) // this actually works, holy shit! It returns the whole thing!

    await user.click(likeButton)
    await user.click(likeButton) // twice
    expect(mockHandler.mock.calls).toHaveLength(2)

    
  })

})