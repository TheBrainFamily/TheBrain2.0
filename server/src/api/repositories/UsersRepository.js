// @flow
import bcrypt from 'bcrypt'
import urlencode from 'urlencode'
import moment from 'moment'
import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import { userDetailsRepository } from './UserDetailsRepository'

const SALT_WORK_FACTOR = 1034

export class UsersRepository extends MongoRepository {
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

    const newUserId = addedUser._id.toString()
    await new userDetailsRepository.create(newUserId, courseId)

    return addedUser
  }

  async updateUser (userId: string, username: string, password: string) {
    const userToBeUpdated = await this.userCollection.findOne({_id: new ObjectId(userId)})

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(password, salt)

    userToBeUpdated.username = username
    userToBeUpdated.password = hash
    userToBeUpdated.activated = true

    await this.userCollection.save(userToBeUpdated)
    return userToBeUpdated
  }

  async updateFacebookUser (userId: string, facebookId: string) {
    const userToBeUpdated = await this.userCollection.findOne({_id: new ObjectId(userId)})
    userToBeUpdated.facebookId = facebookId
    userToBeUpdated.activated = true

    await this.userCollection.save(userToBeUpdated)
    return userToBeUpdated
  }

  async findByUsername (username: string) {
    return this.userCollection.findOne({username})
  }

  async getById (userId: string) {
    return this.userCollection.findOne({_id: new ObjectId(userId)})
  }

  async findByFacebookId (facebookId: string) {
    return this.userCollection.findOne({facebookId})
  }

  async resetUserPassword (username: string) {
    const userToBeUpdated = await this.findByUsername(username)
    if (userToBeUpdated) {
      userToBeUpdated.resetPasswordToken = await generateResetPasswordToken(userToBeUpdated._id)
      await this.userCollection.save(userToBeUpdated)
      return userToBeUpdated
    } else {
      return null
    }
  }

  async changePassword (userId: string, newPassword: string) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const password = await bcrypt.hash(newPassword, salt)

    return this.userCollection.update({_id: new ObjectId(userId)}, {$set: { password }})
  }

  static async comparePassword (passA, passB) {
    return bcrypt.compare(passB, passA)
  }
}

const generateResetPasswordToken = async (userId) => {
  const rawToken = `${userId}_W3GojrLkVLKH9l`
  // we are using hashing function as a clean way to generate a random string
  const salt = await bcrypt.genSalt(Math.random())
  return urlencode.encode(await bcrypt.hash(rawToken, salt))
}

export const usersRepository = new UsersRepository()
