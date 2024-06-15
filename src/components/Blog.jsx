import { useState, forwardRef, useImperativeHandle } from "react" // 5.7 (5b): for the view button
import LikeButton from "./LikeButton"

const Blog = forwardRef( (props,ref) => {
  const [showAll, setShowAll] = useState(false) // 5.7
  const [buttonText, setButtonText] = useState("show more")

  const handleClick = () => {
    setShowAll(!showAll)
    if(buttonText == "show more") {
      setButtonText("less")
    } else {
      setButtonText("show more")
    }
  }

  const showMore = () => {
    return showAll
  }

  useImperativeHandle(ref, () => {
    return {
      showMore
    }
  })
  
  return (
    
    <li className='blog'>
      {props.blog.title}, {""}
      {props.blog.author}
      {showAll 
        ? <>
            {", "}
            <a href={props.blog.url}>{props.blog.url}</a>
            <LikeButton blog={props.blog} prelikes={props.likes}/>
          </>
        : null
      }
      <button onClick={handleClick}>{buttonText}</button>
      
    </li>
  )
})

export default Blog