import axios from 'axios'
const baseUrl = '/api/blogs' // https://fullstackopen.com/en/part3/deploying_app_to_internet "serving static files" -section

let token = null // part 5a; "--private variable called token. Its value can be changed with the setToken function, which is exported by the module. create, now with async/await syntax, sets the token to the Authorization header. The header is given to axios as the third parameter of the post method."

const setToken = newToken => { // 5a
  token = `Bearer ${newToken}`
}

const getAll = () => {
  return axios.get(baseUrl).
    then(response => response.data) // returns a promise with JUST the data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },  // 5a
  }

  const response = await axios.post(baseUrl, newObject, config) // the config part is since part 5a
  return response.data // returns a promise with JUST the data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data // returns a promise with JUST the data
}

const remove = async (id) => {
  const config = {                      // 5a own attempt
    headers: { Authorization: token },  // 5a own attempt
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config) // 5a own attempt: will this work?? delete needs the url AND now also the token
  console.log('blogService remove: response after axios.DELETE:', response)
  return response
}

export default { getAll, create, update, remove, setToken } // object!