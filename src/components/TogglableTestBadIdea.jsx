import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'
import Blog from './Blog'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url:'test url',
      likes:0
    }

    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          <Blog blog={blog}/>
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')

    const url = container.querySelector('#url') // exact:false -> a partial text that includes this also causes the test to fail - which is what we want! This queryByText does NOT cause an exception when not found -> can test for not being found successfully c:
    expect(url).toHaveTextContent('test url')

    const likeButton = container.querySelector('#like-button')
    expect(likeButton).toHaveTextContent('like', {exact:false}) // this works! Nice c:
  })

  // test('toggled content can be closed', async () => {
  //   const user = userEvent.setup()
  //   const button = screen.getByText('show...')
  //   await user.click(button)

  //   const closeButton = screen.getByText('less')
  //   await user.click(closeButton)

  //   const div = container.querySelector('.togglableContent')
  //   expect(div).toHaveStyle('display: none')
  // })
})