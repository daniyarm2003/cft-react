import 'bootstrap/dist/css/bootstrap.css'
import './MainNavbar.css'

import cftImage from '../../assets/CFT3.png'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom'

function MainNavbar() {
    return (
        <Navbar className='main-navbar' expand='lg' sticky='top'>
            <Container fluid>
                <Navbar.Toggle aria-controls='main-navbar-nav' className='ms-auto' />
                <Navbar.Collapse id='main-navbar-nav' className='justify-content-center'>
                    <Navbar.Brand><Link to='/'><img src={cftImage} alt='CFT' width='80' height='42'></img></Link></Navbar.Brand>
                    <Nav>
                        <Nav.Link className='main-navbar-link' color='white' href='/events'>Events</Nav.Link>
                        <Nav.Link className='main-navbar-link' href='/fighters'>Fighters</Nav.Link>
                        <Nav.Link className='main-navbar-link' href='/stats'>Statistics</Nav.Link>
                        <Nav.Link className='main-navbar-link' href='/settings'>Settings</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default MainNavbar