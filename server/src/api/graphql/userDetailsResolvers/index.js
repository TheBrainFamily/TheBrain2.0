import { usersRepository } from '../../repositories/UsersRepository'
import { userDetailsRepository } from '../../repositories/UserDetailsRepository'

const repositoriesContext = {
  Users: usersRepository,
  UserDetails: userDetailsRepository
}

export const userDetailsResolvers = {
  Query: {
    async UserDetails (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}
      let userId = context.user && context.user._id
      if (!userId) {
        return {}
      }
      return context.UserDetails.getById(context.user._id)
    }
  },
  Mutation: {
    async confirmLevelUp (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.resetLevelUpFlag(context.user._id)
    },
    async switchUserIsCasual (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.switchUserIsCasual(context.user._id)
    },
    async setUserIsCasual (root: ?string, args: { isCasual: boolean }, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.setUserIsCasual(context.user._id, args.isCasual)
    },
    async hideTutorial (root: ?string, args: ?Object, passedContext: Object) {
      const context = {...repositoriesContext, ...passedContext}

      return context.UserDetails.disableTutorial(context.user._id)
    }
  }
}
