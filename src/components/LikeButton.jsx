import { useState } from 'react'
import blogService from '../services/blogs'

const LikeButton = ({ blog, prelikes }) => {
  const [likes, setLikes] = useState(prelikes) // so each button has its own this way
  const [liked, setLiked] = useState(false)
  //let reallyLiked = false
  const ogLikes = prelikes

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
    <button onClick = {handleLikeButtonClick}>{liked ? 'nah' : 'like'} {liked ? ogLikes +1 : ogLikes}👍</button>
  )}

export default LikeButton