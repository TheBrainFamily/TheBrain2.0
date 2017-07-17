// @flow
import bcrypt from 'bcrypt'
import urlencode from 'urlencode'
import moment from 'moment'
import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import { userDetailsRepository } from './UserDetailsRepository'

class UsersRepository extends MongoRepository {
  userCollection: Collection

  init () {
    this.userCollection = this.db.collection('users')
  }

  async createGuest (courseId: string) {
    const newUser = {
      username: 'guest',
      password: 'notSet',
      activated: false,
      createdAt: moment().unix()
    }

    const addedUser = (await this.userCollection.insertOne(newUser)).ops[0]

    console.log("JMOZGAWA: addedUser",addedUser);
    const newUserId = addedUser._id.toString()
    await new userDetailsRepository.create(newUserId, courseId)

    return addedUser
  }

  async updateUser (userId: string, username: string, password: string) {
    const userToBeUpdated = await this.userCollection.findOne({_id: new ObjectId(userId)})
    userToBeUpdated.username = username
    userToBeUpdated.password = password
    userToBeUpdated.activated = true

    const _id = userToBeUpdated._id
    delete userToBeUpdated._id
    const updatedUser = (await this.userCollection.findOneAndUpdate({_id}, {$set: {...userToBeUpdated}}, {
      upsert: true,
      returnNewDocument: true
    })).value

    return updatedUser
  }

  async updateFacebookUser (userId: string, facebookId: string) {
    const userToBeUpdated = await this.userCollection.findOne({_id: new ObjectId(userId)})
    userToBeUpdated.facebookId = facebookId
    userToBeUpdated.activated = true
    await userToBeUpdated.save()
    return userToBeUpdated
  }

  async findByUsername (username: string) {
    return this.userCollection.findOne({username})
  }

  async findByFacebookId (facebookId: string) {
    return this.userCollection.findOne({facebookId})
  }

  async resetUserPassword (username: string) {
    const userToBeUpdated = await this.findByUsername(username)
    if (userToBeUpdated) {
      userToBeUpdated.resetPasswordToken = await generateResetPasswordToken(userToBeUpdated._id)
      await userToBeUpdated.save()
      return userToBeUpdated
    } else {
      return null
    }
  }
}

const generateResetPasswordToken = async (userId) => {
  const rawToken = `${userId}_W3GojrLkVLKH9l`
  // we are using hashing function as a clean way to generate a random string
  const salt = await bcrypt.genSalt(Math.random())
  return urlencode.encode(await bcrypt.hash(rawToken, salt))
}

export const usersRepository = new UsersRepository()
