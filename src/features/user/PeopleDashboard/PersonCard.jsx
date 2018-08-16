import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const PersonCard = ({ user }) => {
  const { id, displayName, city, photoURL } = user;
  return (
    <Card as={Link} to={`/profile/${id}`}>
      <Image src={photoURL} />
      <Card.Content textAlign="center">
        <Card.Header content={displayName} />
      </Card.Content>
      <Card.Meta textAlign="center">
        <span>{city}</span>
      </Card.Meta>
    </Card>
  );
};

export default PersonCard;
