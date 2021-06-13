import { Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router';

export const Menu = withRouter(function Menu(props) {
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Navbar.Brand data-testid='brand' onClick={() => props.history.push('/')}>
        Expense Reports
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='navigation-menu' />
      <Navbar.Collapse id='navigation-menu'>
        <Nav className='mr-auto'>
          <Nav.Link data-testid='home' onClick={() => props.history.push('/')}>
            Home
          </Nav.Link>
          <Nav.Link data-testid='login' onClick={() => props.history.push('/login')}>
            Sign In
          </Nav.Link>
          <Nav.Link data-testid='register' onClick={() => props.history.push('/register')}>
            Sign Up
          </Nav.Link>
          <Nav.Link data-testid='logout' onClick={() => props.history.push('/logout')}>
            Sign Out
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
});
