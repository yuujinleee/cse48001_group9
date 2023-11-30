import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LogoSVG from '../../assets/Pixey3D_logo.svg'

import './Home.css'


function Home() {

  return (
        <div className='content'>
            <Container>
                <Button variant='primary' className='buttonTopRight'>Login</Button>
                <Row className='logoBoxContainer'>
                    <img src={LogoSVG} style={{ width: '350px', height: '175px' }} alt="Logo" />
                </Row>
                <Row className='sloganBox'>
                        The web application to support feedback interaction in 3D-modeling.
                </Row>
                <Row>
                    <Col className='textBox'>
                        PUT TEXT HERE
                    </Col>
                    <Col className='videoBox'>
                        PUT video HERE
                    </Col>
                </Row>

                <Row style={{marginTop: '100px'}}>
                    <Col className='videoBox'>
                        PUT TEXT HERE
                    </Col>
                    <Col className='textBox'>
                        PUT video HERE
                    </Col>
                </Row>

            </Container>
        </div>
  )
}

export default Home