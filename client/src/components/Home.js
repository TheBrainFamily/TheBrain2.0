import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'

import store from '../store'

class Home extends React.Component {


    render() {

        if (this.props.data.loading) {
            return (<p>Loading...</p>)
        }

        if (this.props.data.error) {
            return (<p>Error...</p>)
        }
        if (this.props.data.ItemsWithFlashcard.length > 0) {
            store.dispatch(push("/questions"));
        } else {
            store.dispatch(push("/lecture"))
        }
        return <div></div>
    }
}

const query = gql`
    query CurrentItemsExist {
        ItemsWithFlashcard {
            item {
                _id
            }
        }
    }
`;
export default withRouter(graphql(query)(Home));

