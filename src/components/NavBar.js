import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navbar, Row, Col, Button } from 'react-bootstrap'

const NavBar = ({scrollTop}) => {
  
  scrollTop = scrollTop ? scrollTop : false

  return (
    <Navbar id="nav"
      bg={`${scrollTop ? "trans" : "ultra-blue"}`}
      variant={`${scrollTop ? "light" : "dark"}`}
      expand="md"
      fixed="top"
      className={`${scrollTop ? "test" : "blur"}`}>
      <Navbar.Brand href="/" id="brand" className="">Captain Console</Navbar.Brand>
      <ProfileButtons />
    </Navbar>
  )
}

const ProfileButtons = () => {
  let auth = useAuth()

  const viewProfile = e => {
    e.preventDefault()
    console.log("View profile clicked")
  }

  return (
    <Row className="ml-auto">
      <Col className="d-flex align-items-center pr-0">
        <Button size="sm" variant="outline-golden"
          onClick={viewProfile}>Profile</Button>
      </Col>
      <Col className=" align-items-center">
        <Button size="sm" variant="outline-dark-red"
          onClick={auth.signOut}>SignOut</Button>
      </Col>
    </Row>
  )
}

export default NavBar
