const APP_ROOT = '../../'
import _ from 'lodash'


// if the mode variable is "handler", then we'll invoke the functions locally, otherwise, 
// if it's "http", then we'll call the deploy API endpoint.
const mode = process.env.TEST_MODE;

const viaHandler = async (event, functionName) => {
  const { handler, restaurantsApiRoot } = await import(`${APP_ROOT}/functions/${functionName}.mjs`)
  if (restaurantsApiRoot) {
  }
  console.log('***navid handler=',Object.keys(handler))

  const context = {}
  const response = await handler(event, context)
  const contentType = _.get(response, 'headers.Content-Type', 'application/json');
  if (response.body && contentType === 'application/json') {
    response.body = JSON.parse(response.body);
  }
  return response
}

export const we_invoke_get_index = async () => {
  switch (mode) {
    case 'handler':
      return await viaHandler({}, 'get-index')
    case 'http':
      return await viaHttp('', 'GET')
    default:
      throw new Error(`unsupported mode: ${mode}`)
  }
}
export const we_invoke_get_restaurants = () => viaHandler({}, 'get-restaurants')
export const we_invoke_search_restaurants = theme => {
    let event = { 
      body: JSON.stringify({ theme })
    }
    return viaHandler(event, 'search-restaurants')
  }
  
