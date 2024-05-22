import { useState } from "react"
import blogService from '../services/blogs'

const DeleteButton = ({ blog, blogs, setBlogs, setSuccessMessage, setErrorMessage, user}) => { // user needed so that user.token can be accessed!
  
    const handleDeleteButtonClick = () => {     
        console.log("blog.title that handleDeleteButtonClick is referring to:", blog.title)
        try {
            blogService.setToken(user.token) // so that check is possible
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

    return (
    <button onClick = {handleDeleteButtonClick}>delete</button>
)}

export default DeleteButton