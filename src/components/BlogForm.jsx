import { useState } from 'react'

const BlogForm = ({ createBlog }) => {  // NB! the "createBlog" is a modified version of the og "addBlog"
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({ // mainly copy-pasted from App.jsx. So: this gives this blogObject as a parameter to the createBlog (which is the addBlog in App.jsx c:)
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    })
    //console.log("result:", result)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')


  }

  const handleTitleChange = (event) => {      // this event handler is called EVERY TIME onChange of the form value (=form field!). See console.logs! This is needed to be able to change the input value of the form; otherwise it's stuck forever as "a new blog" and the console will show a React error message complaining about this c:
    console.log(event.currentTarget.value)
    setNewTitle(event.currentTarget.value)    // this updates the newTitle based on what the value of the form input field is
  }
  const handleAuthorChange = (event) => {
    console.log(event.currentTarget.value)
    setNewAuthor(event.currentTarget.value)
  }
  const handleUrlChange = (event) => {
    console.log(event.currentTarget.value)
    setNewUrl(event.currentTarget.value)
  }



  return (
    <form onSubmit={addBlog}>

      <p><i>title</i></p>
      <input value={newTitle} onChange={handleTitleChange}/>

      <p><i>author</i></p>
      <input value={newAuthor} onChange={handleAuthorChange}/>

      <p><i>url</i></p>
      <input value={newUrl} onChange={handleUrlChange}/>

      <button type="submit">save</button>

    </form>
  )
}

export default BlogForm