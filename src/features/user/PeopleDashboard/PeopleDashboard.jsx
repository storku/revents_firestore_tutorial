import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import PersonCard from './PersonCard';

class PeopleDashboard extends Component {
  render() {
    const { following, followers } = this.props;

    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Header dividing content="People following me" />
            <Card.Group itemsPerRow={8} stackable>
              {followers &&
                followers.length > 0 &&
                followers.map(user => <PersonCard user={user} key={user.id} />)}
            </Card.Group>
          </Segment>
          <Segment>
            <Header dividing content="People I'm following" />
            <Card.Group itemsPerRow={8} stackable>
              {following &&
                following.length > 0 &&
                following.map(user => <PersonCard user={user} key={user.id} />)}
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    following: state.firestore.ordered.following,
    followers: state.firestore.ordered.followers
  };
};

const actions = {};

const query = props => {
  const { auth } = props;
  return [
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'following' }],
      storeAs: 'following'
    },
    {
      collection: 'users',
      doc: auth.uid,
      subcollections: [{ collection: 'followers' }],
      storeAs: 'followers'
    }
  ];
};

const enhancer = compose(
  connect(
    mapStateToProps,
    actions
  ),
  firestoreConnect(props => query(props))
);

export default enhancer(PeopleDashboard);
