import React from 'react'
import { useAuth } from '../auth/useAuth'
import { Container } from 'react-bootstrap'

const Dashboard = () => {
  return (
    <div id="app" className="bg-beige">
      <Container fluid className="h-100 py-3">
        <h1>Test</h1>
        <div>Signed In</div>
      </Container>
    </div>
  )
}

export default Dashboard