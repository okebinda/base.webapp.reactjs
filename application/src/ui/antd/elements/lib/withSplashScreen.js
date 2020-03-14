import React, {Component} from 'react';

import Loading from '../../elements/components/Loading';
import Auth from '../../../../lib/Auth';

function LoadingMessage() {
  return (<Loading />);
}

function withSplashScreen(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
      };
    }

    async componentDidMount() {
      try {

        const sessionData = Auth.getSession();
        const authToken = sessionData.authToken;
        const authExpires = sessionData.authExpires;

        // check if auth token has exipred
        if (Auth.isAuthTokenValid(authToken, authExpires)) {
          this.props.sessionHydrate(sessionData);
        }

        this.setState({
          loading: false,
        });
        
      } catch (err) {
        console.log(err);
        this.setState({
          loading: false,
        });
      }
    }

    render() {
      // while checking user session, show "loading" message
      if (this.state.loading) return LoadingMessage();

      // otherwise, show the desired route
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withSplashScreen;
