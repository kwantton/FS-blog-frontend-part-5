import PropTypes from 'prop-types'

const LoginForm = ( { username, password, handleLogin, setUsername, setPassword } ) => ( // 5a TO-DO: copy-pasted
  <form onSubmit={handleLogin}>
    <div>
        username
      <input
        data-testid='username'
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
        password
      <input
        data-testid='password'
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
)


LoginForm.propTypes = { // if you change these the other way around and "npm run dev" in the FRONT (not in the back!!! the "dist" in back comes from production build (npm run build) from the frontend, so after that you don't have a dev build any longer from the frontend - proptypes only works in dev build, not in production build!)
  username: PropTypes.func.isRequired,
  password: PropTypes.func.isRequired,
  handleLogin: PropTypes.string.isRequired,
  setUsername: PropTypes.string.isRequired,
  setPassword: PropTypes.string.isRequired
}

LoginForm.displayName = 'LoginForm'

export default LoginForm