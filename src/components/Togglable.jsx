import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false) // 5b, 5.5 by default, the BlogForm is not visible

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children} {/** BlogForm is .children (at least that's One way that this Togglable is used in App.jsx atm c:) */}
        <button onClick={toggleVisibility}>hide</button>
      </div>
    </div>
  )
}

export default Togglable