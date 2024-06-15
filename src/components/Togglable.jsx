import PropTypes from 'prop-types' //5b end, 5.12. For checking props; if monitored props are of correct type / exists when needed during development
import { useState, forwardRef, useImperativeHandle } from 'react' // 5b, 5.5 "To recap, the useImperativeHandle function is a React hook, that is used for defining functions in a component, which can be invoked from outside of the component."

const Togglable = forwardRef( (props, refs) => { // 5b, 5.5 upgraded version
  const [visible, setVisible] = useState(false) // 5b, 5.5 by default, the BlogForm is not visible

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => { // ref blogFormRef was fed here from the App.jsx. Using this, App.jsx can use toggleVisibility now c:
    return {
      toggleVisibility
    }
  })

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
})

Togglable.propTypes = { // 5b, 5.12
  buttonLabel: PropTypes.string.isRequired
}

Togglable.displayName = 'Togglable'

export default Togglable