import { useState } from 'react' // 5.7 (5b): for the view button
import LikeButton from './LikeButton'
import blogService from '../services/blogs'

const Blog = ({blog, prelikes}) => {
  const [showAll, setShowAll] = useState(false) // 5.7
  const [buttonText, setButtonText] = useState('show more')
  const [likes, setLikes] = useState(prelikes) // so each button has its own this way
  const [liked, setLiked] = useState(false)
  //let reallyLiked = false
  const ogLikes = prelikes

  const handleClick = () => {
    setShowAll(!showAll)
    if(buttonText === 'show more') {
      setButtonText('less')
    } else {
      setButtonText('show more')
    }
  }

  const handleLikeButtonClick = () => {
    //reallyLiked = !reallyLiked
    const blogCopy = { ...blog }
    liked
      ? blogCopy.likes = ogLikes
      : blogCopy.likes = ogLikes+1 // since state is always 1 round late, this makes sure it's up to date! c:
    setLiked(!liked)
    console.log('blog.title and likes that handleLikeButtonClick is referring to:', blog.title, blog.likes)
    //reallyLiked ? blogCopy.likes = ogLikes +1 : blogCopy.likes = ogLikes
    blogService.update(blogCopy.id, blogCopy) // takes god-knows how long!
      .then(response => {
        console.log('updated! status:', response.status)
      })
      .catch(error => console.error(error))
    setLikes(liked ? ogLikes+1 : ogLikes)
  }

  return (

    <li className='blog'>
      {blog.title}, {''}
      {blog.author}
      {showAll
        ? <>
          {', '}
          <a id='url' href={blog.url}>{blog.url}</a>
          <LikeButton id='like-button' handleLikeButtonClick={handleLikeButtonClick} liked={liked} ogLikes={ogLikes} likes={likes}/>
        </>
        : null
      }
      <button onClick={handleClick}>{buttonText}</button>

    </li>
  )
}

Blog.displayName = 'Blog'

export default Blog