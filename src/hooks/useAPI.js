import { API } from 'aws-amplify';

// API Config
const apiName = 'tigerSailingApi'
const endpoints = {
  times: '/times',
  avail: '/availability'
}
export const useAPI = () => {

  const getAvailability = () => {
    API.get(apiName, endpoints.avail + '/mine/' + new Date().toISOString(), {})
      .then(result => {
        console.log(result)
      }).catch(handleError)
  }
  
  const addAvailability = ({ year, month, day }) => {
    API.put(apiName, endpoints.avail, {
      body: {
        startTime: new Date(year, month - 1, day).toISOString(),
        duration: 30,
        available: true,
        reserved: false,
      }
    }).then(resp => {
      console.log(resp)
    }).catch(handleError)
  }

  const handleError = err => {
    console.log(err.message);
    console.log(err.response);
  }

  return {
    getAvailability,
    addAvailability
  }
}