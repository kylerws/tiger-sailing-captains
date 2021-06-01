import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { Container, Row, Col, Button } from 'react-bootstrap';

import AvailForm from './AvailabilityForm';

const Dashboard = () => {
  const { loading, user } = useAuth();
  const { addAvailability, getAvailability } = useAPI();

  return loading ? (
    <div id="app">
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div>Loading ...</div>
      </div>
    </div>
  ) : (
    <div id="app" className="bg-beige">
      <Container fluid className="h-100 py-3">
        <Row className="justify-content-between align-items-baseline">
          <Col xs={12} md={"auto"}>
            <h1>Dashboard</h1>
          </Col>
          <Col xs={12} md={"auto"}>
            <h2><small>Welcome back, {user.attributes.name}</small></h2>
          </Col>
        </Row>
        
        <AvailForm
          fieldData={availFieldData}
          submit={addAvailability}
        />
        
        <Button onClick={getAvailability}>GET</Button>
      </Container>
    </div>
  )
}

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