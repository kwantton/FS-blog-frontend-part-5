const Blog = ({ blog }) => {

  return (
    
    <li className='blog'>
      {blog.title}, {blog.author}, <a href={blog.url}>{blog.url}</a>
    </li>
  )
}

export default Blog