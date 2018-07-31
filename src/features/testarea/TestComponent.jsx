import React, { Component } from 'react';
import { connect } from 'react-redux';

class TestComponent extends Component {
  render() {
    return (
      <div>
        <h1>Test Component</h1>
        <h3>The answer is {this.props.data}</h3>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.test.data
});

export default connect(mapStateToProps)(TestComponent);
