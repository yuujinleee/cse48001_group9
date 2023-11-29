import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import LogoSVG from '../../assets/Pixey3D_logo.svg';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className='content'>
      <Container>
        <Button variant='primary' className='buttonTopRight'>Home Screen</Button>
        <Row className='logoBoxContainer'>
          <img src={LogoSVG} style={{ width: '350px', height: '175px' }} alt="Logo" />
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard;
