import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  List,
  Menu,
  Segment
} from 'semantic-ui-react';
import differenceInYears from 'date-fns/difference_in_years';
import moment from 'moment';
import LazyLoad from 'react-lazyload';
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';

class UserDetailedPage extends Component {
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
    const { profile, photos, auth, match, requesting } = this.props;
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

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="calendar" content="Events" />
            <Menu secondary pointing>
              <Menu.Item name="All Events" active />
              <Menu.Item name="Past Events" />
              <Menu.Item name="Future Events" />
              <Menu.Item name="Events Hosted" />
            </Menu>

            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src={'/assets/categoryImages/drinks.jpg'} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>

              <Card>
                <Image src={'/assets/categoryImages/drinks.jpg'} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }

  return {
    profile,
    userUid,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting
  };
};

const actions = {};

export default compose(
  connect(
    mapStateToProps,
    actions
  ),
  firestoreConnect(props => {
    return userDetailedQuery(props);
  })
)(UserDetailedPage);
