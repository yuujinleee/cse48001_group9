import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import LogoSVG from '../../assets/Pixey3D_logo.svg'

import './Home.css'


function Home() {

  return (
        <div className='content'>
            <Container>
                <Button variant='primary' className='buttonTopRight'>Dashboard</Button>
                <Row className='logoBoxContainer'>
                    <img src={LogoSVG} style={{ width: '350px', height: '175px' }} alt="Logo" />
                </Row>
                <Row className='sessionNameInputBoxContainer'>
                    <input type="text" placeholder="Enter session name" className='sessionInputBox'/>
                </Row>
                <Row className='dragAndDropInputBoxContainer'>
                    Drag and drop to upload file
                </Row>
                <Row className='createSessionButtonContainer'>
                    <Button variant='primary' size='lg' className='createSessionButton' >Create a session</Button>
                </Row>
            </Container>
        </div>
  )
}

export default Home