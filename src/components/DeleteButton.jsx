import { useState } from "react"
import blogService from '../services/blogs'

const DeleteButton = ({ blog, blogs, setBlogs, setSuccessMessage, setErrorMessage, user}) => { // user needed so that user.token can be accessed!
  
    const handleDeleteButtonClick = () => {     
        // console.log("blog.title that handleDeleteButtonClick is referring to:", blog.title)
        
        if (window.confirm(`Are you sure you want to remove the blog "${blog.title}" by "${blog.author}"?`)) {
            try {
            
                blogService.setToken(user.token) // so that check is possible
                console.log("user:", user) // user.username tulee olla kaikille uniikki, se varmistettiin backendissä
                console.log("blog:", blog) // blog.user.username:issä on username, joka on kaikille uniikki. myös user.id löytyy, mutta sitä ei nyt ole yllä user:issa
                console.log("")
                blogService.remove(blog.id).then(response => {
                    console.log("status:", response.status)
                    if (response.status === 204) {
                        setBlogs(blogs.filter(aBlog => aBlog.id !== blog.id))
                        setSuccessMessage(`blog titled "${blog.title}" was deleted`)
                        setTimeout(() => {        
                                setSuccessMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
                            }, 5000)
                    } else {
                        setErrorMessage(`it is possible only to remove blogs you have added yourself`)
                        setTimeout(() => {        
                            setSuccessMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
                        }, 5000)
                    }
                }) // removal from the database!
                
            } catch {
                (error => console.error("Error in DeleteButton:", error))
            }
        }
        
    }

    if (user.username == blog.user.username) { // 5.11. Pitäs tarkistaa mieluummin id:n perusteella, tietty.
        return (
        <button onClick = {handleDeleteButtonClick}>delete</button>
    )}
}

export default DeleteButton