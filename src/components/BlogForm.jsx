import { useState } from "react"

const BlogForm = ({newTitle, newAuthor, newUrl, handleAuthorChange, handleTitleChange, handleUrlChange, addBlog}) => { 
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