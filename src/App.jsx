import { useState, useEffect, useRef } from 'react' // 5b, 5.5; for accessing an extracted component's functions etc.!
import Blog from "./components/Blog.jsx"
import LikeButton from "./components/LikeButton.jsx"
import DeleteButton from "./components/DeleteButton.jsx"
import blogService from './services/blogs' // imports FIVE functions: setToken (for login), getAll, create, update, remove
import Notification from './components/Notification.jsx'
import ErrorNotification from "./components/ErrorNotification.jsx"
import SuccessNotification from "./components/SuccessNotification.jsx"
import Footer from './components/Footer.jsx'
import LoginForm from './components/LoginForm.jsx' // 5b (EI PAKOLLINEN TEHTÄVÄ)
import BlogForm from './components/BlogForm.jsx' // 5b: extract blogForm to BlogForm component
import loginService from "./services/login.js"
import Togglable from "./components/Togglable.jsx"

const App = () => {
  const [blogs, setBlogs] = useState(null) // HUOM! Tämä takia, huomaa rivin ~~19 "if(!blogs) {return null}" joka varmistaa, että App:in käynnistäessä ekalla kertaa palautetaan null, ja vasta kun blogs on haettu serveriltä (?), alkaa toimimaan; palautetaan null App:ista, kunnes serveriltä on saatu data. HUOM! "The method based on conditional rendering is suitable in cases where it is impossible to define the state so that the initial rendering is possible." Eli mitään oikeaa syytä initata blogs "null":iksi ei ole; paljon mieluummin inittaa []:ksi, jolloin tätä ongelmaa ei ole!! (ongelma: null:ille ei voi kutsua .map:iä. TAI, joutuisit joka kohdassa tarkistamaan ?.map jne... paskempi vaihtoehto)
 
  const [username, setUsername] = useState('') // 5a https://fullstackopen.com/en/part4/token_authentication#limiting-creating-new-notes-to-logged-in-users  
  const [password, setPassword] = useState('') // 5a
  const [user, setUser] = useState(null) // 5a. So, by default, it's null -> login will be visible, functions for adding a new blog won't be available, "logged-in as..." won't be visible,...

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const blogFormRef = useRef() // 5b, 5.5
  
  
  useEffect(() => {    
    blogService.getAll()
    .then(initialBlogs => {
      setBlogs(initialBlogs)
    }) 
  }, []) // without the [] as 2nd argument, it would keep rendering them FOREVER! Thanks to the [], it will only render them ONCE c:
  
  useEffect(() => {    // 5a. NB!! This has to be BEFORE the "if(!notes)..." below! Why? Dunno!
    const loggedUserJSON = window.localStorage.getItem('loggedInBlogAppUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
    }  
  }, []) // remember: "The empty array as the parameter of the effect ensures that the effect is executed only when the component is rendered for the first time."
  
  if(!blogs) { 
    return null
  }
  console.log('render', blogs.length, 'blogs')

  const logoutButton = () => (
    <button onClick={handleLogout}>logout</button>
  )

  const addBlog = (blogObject) => {  // 5b (5.6): this is given as a prop to BlogForm
    //event.preventDefault()   // prevents the page from being refreshed on submit event     
    //console.log('form onSubmit button clicked', event.currentTarget)  // event.target works too: "event.target will return the element that was clicked but not necessarily the element to which the event listener has been attached."
    blogService
      .create(blogObject) // this will succeed if the Title and Url are provided - otherwise, error -> error message is shown c:
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        //setSuccessMessage(`a new blog "${newTitle}" by "${newAuthor}" added!`)      // OLD! THIS DOESN'T WORK NOW, BECAUSE APP.JSX FUNCTION DOESN'T HAVE THIS! It DOES have to have the parameter, blogObject, that's fed into it in BlogForm component, however - so using that instead DOES work! Nice! REMEMBER!
        setSuccessMessage(`a new blog "${blogObject.title}" by "${blogObject.author}" added!`)      
        blogFormRef.current.toggleVisibility()  // 5b (5.5) - only if successful, then hide it after adding a new blog c:
        
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
  
  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)  // so, behold, no-one is logged in anymore
    window.localStorage.removeItem('loggedInBlogAppUser') // so the browser no longer remembers the user
  }

  const handleLogin = async (event) => {    // 5a
    event.preventDefault()        
    try {      
      const user = await loginService.login({       // remember the await! Even if you have async/await there already, you also need it here.  
        username, password
      })    
      
      window.localStorage.setItem(       // 5a: so that even if browser is refreshed, the loggedInBlogAppUser stays in the local storage of the browser
        'loggedInBlogAppUser', JSON.stringify(user)      
      )
      blogService.setToken(user.token) // so, user has property token, which will contain the token. This blogService.setToken will set the token for the blogService.create's post function to use -> in effect, authentication ok
      setUser(user)    // "The token returned with a successful login is saved to the application's state - the user's field token:"        
      setUsername('')     
      setPassword('')    
      setErrorMessage(null) // we don't wanna see previous error messages, if still lingering, after finally successfully logging in
    } catch (exception) {      
      setErrorMessage('Please choose one or more: (a) learn to type, (b) jog your memory, (c) create a new account, (d) jog')      
      setTimeout(() => {        
        setErrorMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
      }, 5000)    
    }
  }
  

  let palautettavat_blogit = [...blogs]
    console.log("blogs:",palautettavat_blogit.length)
    
    return (
    <div>
      <h1>BlogBlob</h1>
      <Notification message={ message } />
      <ErrorNotification message={ errorMessage } />
      <SuccessNotification message={ successMessage } />
      
      {user === null
      // ? loginForm() // OLD (5a), 5b uses LoginForm component
      ? <LoginForm username={username} password={password} setPassword={setPassword} setUsername={setUsername} handleLogin={handleLogin}/>
      : <div>
          <p>logged in as <i><b>{user.name}</b></i></p>
          { logoutButton() }
          {/** { blogForm() } */} {/** OLD. 5b extracted this to BlogForm */}
          <Togglable buttonLabel="create new blog" ref={blogFormRef}> {/** REMEMBER! */}
            <BlogForm createBlog={addBlog} /> {/** NB! You have to build it again nin BlogForm c: REMEMBER! */}
          </Togglable>
          
        </div> 
      }

       {user ? 
        <div>
          <h2>Our current blogs</h2>
          <ul>
          {palautettavat_blogit.map(blog => 
          <div>
            <Blog key={blog.id} blog={blog}/>
            <LikeButton blog={blog} prelikes={blog.likes}/>
            <DeleteButton blog={blog} blogs={blogs} user={user} setBlogs={setBlogs} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
          </div>
          )}
        </ul>
        </div>
      : null}
      <Footer/>
    </div>
  )
}

export default App