import React from 'react';
// import { useAuth } from '../hooks/useAuth'
import { Container, Button } from 'react-bootstrap';
import { API } from 'aws-amplify';

import AvailForm from './AvailabilityForm';

const Dashboard = () => {
  return (
    <div id="app" className="bg-beige">
      <Container fluid className="h-100 py-3">
        <h1>Dashboard</h1>
        <div>Signed In</div>
        <AvailForm
          fieldData={availFieldData}
          submit={addAvailability}
        />
        <Button onClick={getAvailability}>GET</Button>
        {/* <Button onClick={addAvailability}>Add Availability</Button> */}
      </Container>
    </div>
  )
}

const apiName = 'tigerSailingApi'
// const endpoints = '/times'
const endpoints = {
  times: '/times',
  avail: '/availability'
}

const getAvailability = () => {
  API.get(apiName, endpoints.avail + '/mine/' + new Date().toISOString(), {})
    .then(result => {
      console.log(result)
    }).catch(err => {
      console.log(err)
      console.log(err.message)
      console.log(err.response)
    })
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
  }).catch(err => {
    console.log(err.message)
  })
}

// function get() {
//   API.get('tigerSailingApi', `/times/1`, {}).then((result) => {
//     console.log(result);
//   }).catch(err => {
//     console.log(err);
//   })
// }

// const postTime = () => {
//   API.post(apiName, endpoint, {
//     body: {
//       captainID: 1,
//       start: '12PM',
//       end: '4PM',
//       reserved: false,
//       booked: false
//     }
//   }).then(result => {
//     console.log(result);
//   }).catch(err => {
//     console.log(err);
//   })
// }

const availFieldData = [
  {
    key: 'month',
    type: 'text',
    label: 'Month',
    placeholder: 'MM',
    subtext: [
      ''
    ],
    initial: '',
    rules: {
      required: 'Please enter a month'
    }
    
  }, {
    key: 'day',
    label: 'Day',
    placeholder: `DD`,
    subtext: [
      ''
    ],
    type: 'text',
    initial: '',
    rules: {
      required: 'Please enter a day'
    }
  }, {
    key: 'year',
    label: 'Year',
    placeholder: 'YYYY',
    subtext: [
      ''
    ],
    type: 'text',
    initial: '',
    rules: {
      required: 'Please enter a year'
    }
  }
]

export default Dashboard