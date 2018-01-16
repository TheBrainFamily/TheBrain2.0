// import Separator from '../components/Separator'
// import { AppInternal } from '../AppInternal'

// import ApolloProvider from 'react-apollo'
// import store, { client } from '../mobileClient/store'
// import Contact from '../components/Contact'

// import ApolloProvider from 'react-apollo/ApolloProvider'

import { CoursesRepository } from '../../server/src/api/repositories/CoursesRepository'
import { LessonsRepository } from '../../server/src/api/repositories/LessonsRepository'
import {
  makeExecutableSchema
} from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils-with-context';
import { typeDefs } from '../../server/src/api/schema'
import resolvers from '../../server/src/api/resolvers'
import { ApolloClient } from 'apollo-client'
import flushAllPromises from '../testHelpers/flushAllPromises'

const schema = makeExecutableSchema({typeDefs, resolvers});


const {React ,Enzyme, ApolloProvider } =require('../../mobileClient/tests/helpers/setup')
// const React = require('react')
// const Enzyme = require('enzyme');
// const ApolloProvider = require('react-apollo').default
const {returnStore} = require('../../mobileClient/store')


// const Separator = require('../mobileClient/components/Separator').default
const { AppInternal } = require('../../mobileClient/AppInternal')
// console.log("Gandecki AppInternal", AppInternal);
// const store = require('../store').default

it('renders without crashing', () => {
  // const wrapper = Enzyme.mount(<Separator/>)
  //
  // expect(wrapper.html()).toMatchSnapshot()
  // const rendered = renderer.create(<App />).toJSON();
  // expect(rendered).toBeTruthy();
});


const returnContext = async function () {
  const coursesRepository = new CoursesRepository()
  await coursesRepository.coursesCollection.insert({_id: 'testCourseId', name: 'Chemistry'})
  await coursesRepository.coursesCollection.insert({_id: 'testCourse2Id', name: 'Biology'})

  const lessonsRepository = new LessonsRepository()
  await lessonsRepository.lessonsCollection.insert(
    {
      _id: 'lessonId',
      position: 1,
      description: 'first lesson',
      flashcardIds: [],
      youtubeId: 'QnQe0xW_JY4',
      courseId: 'testCourseId'
    }
  )
  const context = {
    Courses: coursesRepository,
    Lessons: lessonsRepository,
    req: {
      logIn: (user) => {
        console.log("Gandecki user", user);
        context.user = user
      }
    }
  }
  return context
}



it('renders the whole app without crashing',async () => {
  // console.log("Gandecki store", store);
  // console.log("Gandecki client", client);
  const context = await returnContext()
  const networkInterface = mockNetworkInterfaceWithSchema({schema, context});

  const client = new ApolloClient({networkInterface})
  const store = returnStore(client)
  const wrapper = Enzyme.mount(<ApolloProvider client={client} store={store}><AppInternal fontLoaded/></ApolloProvider>)

  console.log("Gandecki wrapper.html() 1", wrapper.html());

  console.log("how many wrappers 1", wrapper.find({testID: "skip_intro_button"}))
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()

  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  console.log("Gandecki wrapper.html() 2", wrapper.html());

  console.log("how many wrappers 2", wrapper.find({testID: "skip_intro_button"}))

  wrapper.update()
  wrapper.mount()
  const allTestId = wrapper.find({testID: "skip_intro_button"})
  console.log("Gandecki ", allTestId);

  const firstTestId = wrapper.find({testID: "skip_intro_button"}).first()
  firstTestId.props().onPress()



  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  wrapper.update()
  wrapper.mount()

  console.log("reload!!!!!!")

  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  wrapper.update()
  wrapper.mount()

  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  await flushAllPromises()
  wrapper.update()
  wrapper.mount()

  const newTestId = wrapper.find({testID: "skip_intro_button"})
  console.log("Gandecki after", newTestId);

  console.log("Gandecki wrapper.html()", wrapper.html());
  expect(wrapper.html()).toMatchSnapshot()
})


// try to make a test that imports only react-native. Maybe the apollo library is the culprit