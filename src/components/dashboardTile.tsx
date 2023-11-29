import React from 'react';
import Col from 'react-bootstrap/Col';
import { Container, Image } from 'react-bootstrap';

interface TileProps {
    id: number;
    content: string;
    author: string
}

const TileComponent: React.FC<TileProps> = ({ id, content, author }) => {
  const imageUrl = `src/assets/tile_images/tile${id}.png`;

  return (
    <Col md={4} className='dashboardTile mb-3 mr-md-3'>
      <Container style={{ width: '100%', height: '80%'}}>
        <div className='text-center' style={{ width: '100%', height: '100%', overflow: 'hidden' , borderRadius: '7px'}}>
          <Image
            src={imageUrl}
            alt='Tile Image'
            fluid
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <div className='text-center d-flex align-items-center justify-content-center mt-2' style={{ height: '30%' }}>
          <Col>
            <p style={{ margin: '0', fontWeight:'bold', fontSize: '120%'}}>{content}</p>
            <p>Author: {author}</p>
          </Col>
        </div>
      </Container>
    </Col>
  );
};

export default TileComponent;
