import { useState } from "react"
import blogService from "../services/blogs"

const BlogForm = ({ blogs, setBlogs, setSuccessMessage, setErrorMessage }) => { 
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState("")

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

    const addBlog = (event) => {  // 5b (5.6): this is given as a prop to BlogForm
        event.preventDefault()   // prevents the page from being refreshed on submit event     
        console.log('form onSubmit button clicked', event.currentTarget)  // event.target works too: "event.target will return the element that was clicked but not necessarily the element to which the event listener has been attached."
        const blogObject = { // TO-DO: check what should be going on here!
          title: newTitle,
          author: newAuthor,
          url: newUrl,
          likes: 0,
          
          // id : blogs.length+1 // "it's better to let the server generate the new id"
        }
    
        blogService      
        .create(blogObject)      // this should also have
        .then(blog => {        
          setBlogs(blogs.concat(blog))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
    
          setSuccessMessage(`a new blog "${newTitle}" by "${newAuthor}" added!`)      
          setTimeout(() => {        
            setSuccessMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
          }, 5000)
        })
        .catch(error => { // added this
          setErrorMessage("please provide values for 'title' AND 'url' for the new blog (author is optional)")
          setTimeout(() => {        
            setErrorMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
          }, 5000) 
        })
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