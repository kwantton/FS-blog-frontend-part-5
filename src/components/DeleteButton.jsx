import { useState } from "react"
import blogService from '../services/blogs'

const DeleteButton = ({ blog, blogs, setBlogs, setSuccessMessage, setErrorMessage}) => {
  
    const handleDeleteButtonClick = () => {     
        console.log("blog.title that handleDeleteButtonClick is referring to:", blog.title)
        try {
            const response = blogService.remove(blog.id) // removal from the database!
            setBlogs(blogs.filter(aBlog => aBlog.id !== blog.id))
            console.log("deleted! status:", response.status)
            setSuccessMessage(`blog ("${blog.title}") deleted`)
            setTimeout(() => {        
                setSuccessMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
            }, 5000)
        } catch {
            (error => console.error("Error in DeleteButton:", error))
            setErrorMessage(`it is possible only to remove blogs you have added yourself`)
            setTimeout(() => {        
                setSuccessMessage(null)  // = show the error message for 5 seconds, then set the error message to null again    
            }, 5000)
        }
    }

    return (
    <button onClick = {handleDeleteButtonClick}>delete</button>
)}

export default DeleteButton