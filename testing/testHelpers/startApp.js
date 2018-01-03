import {
  addMockFunctionsToSchema,
  makeExecutableSchema
} from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';


const typeDefs = `
  type Class {
    uuid: String
    name: String!
    grade: String!
    section: String!
    enabled: Boolean!
    school: School!
  }

  type School {
    uuid: String
    name: String!
    utcOffset: String!
  }

  type User {
    uuid: String!
    name: String!
    grades: [Grade]
  }

  type Grade {
    id: Int!
    uuid: String!
    grade: String!
  }

  type Query {
    classes: [Class]!
    currentUser: User
  }

  input LogInInput {
    username: String!
    password: String!
  }

  type Status {
    success: Boolean!
    message: String
  }

  type Mutation {
    logIn(input: LogInInput): User
    addClass(input: AddEditClass!): Class!
    editClass(input: AddEditClass!): Class!
    deleteClass(input: deleteClassInput!): Class!
  }

  input AddEditClass {
    uuid: String
    name: String!
    grade: String!
    section: String!
    enabled: Boolean!
    school: AddEditSchool!
  }

  input deleteClassInput {
    uuid: String!
  }

  input AddClassSchoolInput {
    uuid: String!
  }

  input AddEditSchool {
    uuid: String!
    name: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;


const isEnzyme = process.env.ENZYME
const isTestCafe = process.env.TESTCAFE
let startApp = async function (resolvers = {}, path = '/', testCafe) {
  const schema = makeExecutableSchema({typeDefs, resolvers, resolverValidationOptions: {allowResolversNotInSchema: true}});
  addMockFunctionsToSchema({schema, preserveResolvers: true});
  path = `#${path}`
  const networkInterface = mockNetworkInterfaceWithSchema({schema});
  if (global.cy) {
    const { startAppCypress } = require('./startAppCypress')
    return startAppCypress(path, networkInterface)
  } else if (isEnzyme) { // TODO better check for jest ;-)
    const startAppEnzyme = require('./startAppEnzyme').startAppEnzyme
    return startAppEnzyme(path, networkInterface)
  } else if (isTestCafe) {
    //For some reason if I put this inside startAppTestCafe I get
    // Cannot implicitly resolve the test run in the context of which the test controller action should be executed. Use test function's 't' argument instead.
    // whatever that means :)
    const newT = require('testcafe').t
    await newT.navigateTo(`http://localhost:8080${path}`)
    const startAppTestCafe = require('./startAppTestCafe').startAppTestCafe
    return startAppTestCafe(path, typeDefs, resolvers)
  }
  else { //TODO better check for chromeless
    const startAppChromeless = require('./startAppChromeless').startAppChromeless
    return startAppChromeless(path, typeDefs, resolvers)
  }
};

export default startApp;

