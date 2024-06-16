const LikeButton = ({ handleLikeButtonClick, likes,liked }) => {
  return (
    <button onClick = {handleLikeButtonClick}>{liked ? 'nah' : 'like'} {liked ? likes +1 : likes}👍</button>
  )}

export default LikeButton