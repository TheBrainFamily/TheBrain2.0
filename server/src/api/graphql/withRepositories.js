import repositoriesContext from './repositoriesContext'

export const withRepositories = (cb) => async (root: ?string, args: Object, passedContext: Object) => {
  const context = {...repositoriesContext, ...passedContext}
  return cb(root, args, context)
}
