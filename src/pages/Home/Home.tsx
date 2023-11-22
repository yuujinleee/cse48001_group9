import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import './Home.css'


function Home() {

  return (
    <Container>
        <Row className='logoBoxContainer'>
            LOGO
        </Row>
        <Row className='sessionNameInputBoxContainer'>
            Session name
        </Row>
        <Row className='dragAndDropInputBoxContainer'>
            Drag and drop to upload file
        </Row>
        <Row className='createSessionButtonContainer'>
            <Button variant='primary' size='lg' className='createSessionButton' >Create a session</Button>
        </Row>
    </Container>
  )
}

export default Home