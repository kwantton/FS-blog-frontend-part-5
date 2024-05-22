import { useState } from "react"
import blogService from '../services/blogs'

const DeleteButton = ({ blog, blogs, setBlogs }) => {
  
    const handleDeleteButtonClick = () => {     
        console.log("blog.title that handleDeleteButtonClick is referring to:", blog.title)
        try {
            const response = blogService.remove(blog.id) // removal from the database!
            setBlogs(blogs.filter(aBlog => aBlog.id !== blog.id))
            console.log("deleted! status:", response.status)
        } catch {
            (error => console.error("Error in DeleteButton:", error))
        }
        
    }

    return (
    <button onClick = {handleDeleteButtonClick}>delete</button>
)}

export default DeleteButton