import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import LogoSVG from '../../assets/Pixey3D_logo.svg';
import './Dashboard.css';
import TileComponent from '../../components/dashboardTile'; 

function Dashboard() {
  return (
    <div className='content'>
      <Container>
        <Button variant='primary' className='buttonTopRight'>Home Screen</Button>
        <Row className='logoBoxContainer'>
          <img src={LogoSVG} style={{ width: '350px', height: '175px' }} alt="Logo" />
        </Row>
        <Row className='dashboardTiles'>
          <TileComponent id={3} content='Robot' author='J. D. Nejal' />
          <TileComponent id={5} content='House' author='Y. J. Lee' />
        </Row>
        <Row className='dashboardTiles'>
          <TileComponent id={6} content='Island crib' author='J. D. Nejal' />
          <TileComponent id={7} content='Forest hut' author='Y. J. Lee' />
        </Row>
        <Row className='dashboardTiles'>
          <TileComponent id={7} content='Robot' author='J. D. Nejal' />
          <TileComponent id={5} content='House' author='Y. J. Lee' />
        </Row>
        <Row className='dashboardTiles'>
          <TileComponent id={6} content='Island crib' author='J. D. Nejal' />
          <TileComponent id={7} content='Forest hut' author='Y. J. Lee' />
        </Row>
        <Row className='dashboardTiles'>
          <TileComponent id={3} content='Robot' author='J. D. Nejal' />
          <TileComponent id={5} content='House' author='Y. J. Lee' />
        </Row>
        <Row className='dashboardTiles'>
          <TileComponent id={6} content='Island crib' author='J. D. Nejal' />
          <TileComponent id={7} content='Forest hut' author='Y. J. Lee' />
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard;
