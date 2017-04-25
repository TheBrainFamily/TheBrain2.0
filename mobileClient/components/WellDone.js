import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import {Link} from 'react-router-native';
import {
    Text,
    View,
    Button
} from 'react-native';
import styles from '../styles/styles';

export class WellDone extends React.Component {
    componentDidMount() {
        this.props.lessonWatchedMutation();
    }

    render() {
        return <View style={styles.wellDonePage}>
            <Link to="/Questions">
                <View style={styles.wellDoneContainer}>
                    <Text style={[styles.primaryHeader, styles.wellDoneHeader]}>FIRST VIDEO DONE!</Text>
                    <Text style={[styles.primaryHeader, styles.wellDoneContent]}>Tap anywhere to answer some questions about the video</Text>
                </View>
            </Link>
        </View>
    }
}

const lessonWatchedMutationSchema = gql`
    mutation createItemsAndMarkLessonAsWatched{
        createItemsAndMarkLessonAsWatched{
            _id, position, description, flashcardIds, youtubeId
        }
    }
`;


export default graphql(lessonWatchedMutationSchema, {
    props: ({ownProps, mutate}) => ({
        lessonWatchedMutation: () => mutate({
            updateQueries: {
                Lesson: (prev, {mutationResult}) => {
                    const updateResults = update(prev, {
                        Lesson: {
                            $set: mutationResult.data.createItemsAndMarkLessonAsWatched
                        }
                    });
                    return updateResults;
                }
            }
        })
    })
})(WellDone);
