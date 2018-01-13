// @flow
import bcrypt from 'bcrypt'
import urlencode from 'urlencode'
import moment from 'moment'
import { Collection, ObjectId } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import { tokenExpirationPeriod } from '../../configuration/common'

const SALT_WORK_FACTOR = 10

export class UsersRepository extends MongoRepository {
  userCollection: Collection
  authTokenCollection: Collection

  init () {
    this.userCollection = this.db.collection('users')
    this.authTokenCollection = this.db.collection('authtoken')
  }

  async createGuest (courseId: string, deviceId: string) {
    const newUser = {
      _id: (new ObjectId()).toString(),
      username: 'guest',
      password: 'notSet',
      activated: false,
      createdAt: moment().unix()
    }

    const insertedUser = await this.userCollection.insert(newUser)
    const addedUser = insertedUser.ops[0]

    const newUserId = addedUser._id.toString()

    if (deviceId) {
      addedUser.currentAccessToken = await this.insertNewUserToken(newUserId, deviceId)
    }
    return addedUser
  }

  async updateUser (userId: string, username: string, password: string) {
    const userToBeUpdated = await this.userCollection.findOne({_id: userId})

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hash = await bcrypt.hash(password, salt)

    userToBeUpdated.username = username
    userToBeUpdated.password = hash
    userToBeUpdated.activated = true

    await this.userCollection.save(userToBeUpdated)
    return userToBeUpdated
  }

  async updateFacebookUser (userId: string, facebookId: string, username: string, email: string) {
    const userToBeUpdated = await this.userCollection.findOne({_id: userId})
    userToBeUpdated.facebookId = facebookId
    userToBeUpdated.username = username
    userToBeUpdated.email = email
    userToBeUpdated.activated = true

    await this.userCollection.save(userToBeUpdated)
    return userToBeUpdated
  }

  async findByUsername (username: string) {
    return this.userCollection.findOne({username})
  }

  async getById (userId: string) {
    return this.userCollection.findOne({_id: userId})
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

    return this.userCollection.update({_id: userId}, {$set: { password }})
  }

  static async comparePassword (passA, passB) {
    return bcrypt.compare(passB, passA)
  }

  async insertNewUserToken (userId: string, deviceId: string) {
    const timestamp = moment().unix()
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const random = Math.random() * Math.random()
    const rawToken = `${userId}_!s@eVc&uM%fG#D$G#$@<D@^H&&;_${timestamp}_${random}_${deviceId}`
    const token = await bcrypt.hash(rawToken, salt)
    await this.authTokenCollection.insert({
      _id: (new ObjectId()).toString(),
      userId,
      token,
      deviceId,
      createdAt: timestamp
    })
    return token
  }

  async findActiveToken (userId: string, token: string, deviceId: string) {
    const timestamp = moment().unix()
    const tokenFound = await this.authTokenCollection.findOne({
      userId,
      token,
      deviceId,
      createdAt: { $gte: timestamp - tokenExpirationPeriod }
    })
    return tokenFound
  }

  async removeToken (userId: string, token: string) {
    await this.authTokenCollection.removeOne({
      userId,
      token
    })
  }

  async removeExpiredTokens () {
    console.log('### EXPIRED TOKENS REMOVAL STARTING ###', moment().format())
    const timestamp = moment().unix()
    const result = await this.authTokenCollection.removeMany({createdAt: {$lt: timestamp - tokenExpirationPeriod}})
    console.log(result.result)
    console.log('### EXPIRED TOKENS REMOVAL ENDED ###', moment().format())
  }
}

const generateResetPasswordToken = async (userId) => {
  const rawToken = `${userId}_W3GojrLkVLKH9l`
  // we are using hashing function as a clean way to generate a random string
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  return urlencode.encode(await bcrypt.hash(rawToken, salt))
}

export const usersRepository = new UsersRepository()
