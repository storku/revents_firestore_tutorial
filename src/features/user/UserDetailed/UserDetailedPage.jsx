import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  List,
  Segment
} from 'semantic-ui-react';
import differenceInYears from 'date-fns/difference_in_years';
import moment from 'moment';
import LazyLoad from 'react-lazyload';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents } from '../userActions';
import UserDetailedEvents from './UserDetailedEvents';

class UserDetailedPage extends Component {
  async componentDidMount() {
    let events = await this.props.getUserEvents(this.props.userUid);
  }

  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };

  dateOfBirth = () => {
    if (this.props.profile.dateOfBirth) {
      return differenceInYears(
        Date.now(),
        this.props.profile.dateOfBirth.toDate()
      );
    } else {
      return 'unknown age';
    }
  };

  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      events,
      eventsLoading
    } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const loading = Object.values(requesting).some(a => a === true);
    const {
      displayName,
      occupation,
      city,
      origin,
      photoURL,
      interests,
      about,
      createdAt
    } = profile;

    if (loading) {
      return <LoadingComponent inverted={true} />;
    }

    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Item.Group>
              <Item>
                {photoURL && (
                  <Item.Image
                    avatar
                    size="small"
                    src={photoURL || '/assets/user.png'}
                  />
                )}
                <Item.Content verticalAlign="bottom">
                  <Header as="h1">{displayName}</Header>
                  <br />
                  <Header as="h3">{occupation}</Header>
                  <br />
                  <Header as="h3">
                    {this.dateOfBirth()}, Lives in {city}, {origin}
                  </Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header icon="smile" content={`About ${displayName}`} />
                <p>
                  I am a: <strong>{occupation || 'tbn'}</strong>
                </p>
                <p>
                  Originally from <strong>{origin || 'tbn'}</strong>
                </p>
                <p>
                  Member Since:{' '}
                  <strong>
                    {createdAt &&
                      moment.unix(createdAt.seconds).format('Do MMMM YYYY')}
                  </strong>
                </p>
                <p>{about}</p>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header icon="heart outline" content="Interests" />
                <List>
                  {interests
                    ? interests.map((interest, index) => {
                        return (
                          <Item key={index}>
                            <Icon
                              name={
                                interest === 'culture' ? 'picture' : interest
                              }
                            />
                            <Item.Content>{interest}</Item.Content>
                          </Item>
                        );
                      })
                    : 'No interest'}
                </List>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment>
            {isCurrentUser ? (
              <Button
                as={Link}
                to="/settings/basic"
                color="teal"
                fluid
                basic
                content="Edit Profile"
              />
            ) : (
              <Button color="teal" fluid basic content="Follow User" />
            )}
          </Segment>
        </Grid.Column>

        {photos &&
          (photos.length > 0 && (
            <Grid.Column width={12}>
              <Segment attached>
                <Header icon="image" content="Photos" />

                <Image.Group size="small">
                  {photos.map(photo => {
                    return (
                      <LazyLoad
                        key={photo.id}
                        height={150}
                        placeholder={<Image src="/assets/user.png" />}
                      >
                        <Image src={photo.url} />
                      </LazyLoad>
                    );
                  })}
                </Image.Group>
              </Segment>
            </Grid.Column>
          ))}
        <UserDetailedEvents
          changeTab={this.changeTab}
          events={events}
          eventsLoading={eventsLoading}
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  //teacher is wrong about below
  // if (ownProps.match.params.id === state.auth.uid) {
  //   profile = state.firebase.profile;
  // } else {
  //   profile =
  //     !isEmpty(state.firestore.ordered.profile) &&
  //     state.firestore.ordered.profile[0];
  //   userUid = ownProps.match.params.id;
  // }

  //my own creation, removing some stuff
  profile =
    !isEmpty(state.firestore.ordered.profile) &&
    state.firestore.ordered.profile[0];
  userUid = ownProps.match.params.id;

  return {
    profile,
    userUid,
    events: state.events,
    eventsLoading: state.async.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting
  };
};

const actions = { getUserEvents };

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  firestoreConnect(props => {
    return userDetailedQuery(props);
  })
)(UserDetailedPage);
