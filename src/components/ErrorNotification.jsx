const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className='error'> {/** for correct css shaping, className is set to 'error' */}
        {message}
      </div>
    )
  }
export default ErrorNotification