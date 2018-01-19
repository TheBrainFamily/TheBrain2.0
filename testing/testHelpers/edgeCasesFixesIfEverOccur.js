// import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools/dist/index'
// import { history } from '../../src/store/configureStore'
// import { ApolloClient } from 'apollo-client/index'
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils/dist/src/index'
// import { EnzymeDriver } from './EnzymeDriver'
// import { mount } from 'enzyme/build/index'
// import flushAllPromises from '../flushAllPromises'
//
// let startApp = async function (resolvers = {}, path = '/') {
//   const schema = makeExecutableSchema({typeDefs, resolvers})
//
//   const networkInterface = mockNetworkInterfaceWithSchema({schema})
//
//   addMockFunctionsToSchema({schema, preserveResolvers: true})
//
//   if (window._apolloClient) {
//     Object.assign(window._apolloClient, new ApolloClient({networkInterface}))
//   } else {
//     window._apolloClient = new ApolloClient({networkInterface})
//   }
//   history.push(path)
//
//   //! !!!!!!!!!
//   //! !!!!!!!!!!! This was removed, it basically removes nodes from the dom
//   const remove = document.getElementsByTagName('div')
//   if (remove[0]) {
//     let counter = 0
//     const parent = remove[0].parentNode
//     while (parent.hasChildNodes()) {
//       parent.removeChild(remove[counter++])
//     }
//   }
//
//   // const randomPrefix = Math.random().toString( 36).substring(2, 15)
//   const div = document.createElement('div')
//   document.body.appendChild(div)
//
//   // const className = `${getRandomPrefix()}swal25`
//   // swal.setDefaults({target: `.${className}`})
//
//   const wrapper = mount(<ErrorBoundary><WithApollo client={window._apolloClient} history={history} /></ErrorBoundary>, { attachTo: div })
//   await flushAllPromises()
//   //
//
//   // This was also removed
//   if (!global.wrappers) {
//     console.log('creatig new one')
//     global.wrappers = []
//   } else {
//     // this might break if I'm detaching before previous test is done
//     // I guess same for removing the parents above. We are sharing state now...
//     console.log('Gandecki global.wrappers.length', global.wrappers.length)
//     global.wrappers.forEach(oldWrapper => {
//       oldWrapper.detach()
//     })
//   }
//
//   global.wrappers.push(wrapper)
//
//   wrapper.update()
//   wrapper.mount()
//   console.log('Gandecki wrapper in before', wrapper)
//   console.log(wrapper.find)
//   const enzymePageObject = new EnzymeDriver(wrapper)
//   return enzymePageObject
// }
