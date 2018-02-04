import { withRepositories } from '../withRepositories'

export const userDetailsResolvers = {
  Query: {
    UserDetails: withRepositories((root: ?string, args: ?Object, context: Object) => {
      let userId = context.user && context.user._id
      if (!userId) {
        return {}
      }
      return context.UserDetails.getById(context.user._id)
    })
  },
  Mutation: {
    confirmLevelUp: withRepositories((root: ?string, args: ?Object, context: Object) =>
      context.UserDetails.resetLevelUpFlag(context.user._id)),
    switchUserIsCasual: withRepositories((root: ?string, args: ?Object, context: Object) =>
      context.UserDetails.switchUserIsCasual(context.user._id)),
    setUserIsCasual: withRepositories((root: ?string, args: { isCasual: boolean }, context: Object) =>
      context.UserDetails.setUserIsCasual(context.user._id, args.isCasual)),
    hideTutorial: withRepositories((root: ?string, args: ?Object, context: Object) =>
      context.UserDetails.disableTutorial(context.user._id))
  }
}
