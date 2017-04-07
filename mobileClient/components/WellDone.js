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


export class WellDone extends React.Component {
    componentDidMount() {
        this.props.lessonWatchedMutation();
    }

    render() {
        return <View style={{width: 1000, height: 1000, backgroundColor: 'powderblue', marginTop:20}}>
                <Text>First video done! Click:</Text><Link to="/Questions"><Text>to answer</Text></Link><Text> some questions about the video</Text>
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
