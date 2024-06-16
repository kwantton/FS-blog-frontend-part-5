import { useState } from 'react'
import blogService from '../services/blogs'

const LikeButton = ({ handleLikeButtonClick, ogLikes,liked }) => {
  

  

  return (
    <button onClick = {handleLikeButtonClick}>{liked ? 'nah' : 'like'} {liked ? ogLikes +1 : ogLikes}👍</button>
  )}

export default LikeButton