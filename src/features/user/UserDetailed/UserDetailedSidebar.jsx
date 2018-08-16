import React from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const UserDetailedSidebar = ({
  isCurrentUser,
  handleFollowButton,
  handleUnfollowButton,
  renderFollowUserButton
}) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {isCurrentUser ? (
          <Button
            as={Link}
            to="/settings"
            color="teal"
            fluid
            basic
            content="Edit Profile"
          />
        ) : renderFollowUserButton ? (
          <Button
            onClick={handleUnfollowButton}
            color="red"
            fluid
            basic
            content="Unfollow user"
          />
        ) : (
          <Button
            onClick={handleFollowButton}
            color="teal"
            fluid
            basic
            content="Follow user"
          />
        )}
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
