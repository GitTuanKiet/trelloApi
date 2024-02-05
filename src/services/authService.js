/* eslint-disable no-useless-catch */
import { AuthModel } from '~/models/authModel'
import Jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ENV } from '~/config/environment'
const { SECRET_KEY, EXPIRES_IN } = ENV

const InvalidAuth = ['_id', 'password', 'createAt', '_destroy']

export class AuthService {
  static async registerService(data) {
    try {
      const { email, password } = data
      const check = await AuthModel.findOneByEmail(email)
      if (check) {
        throw new Error('Email already exists')
      }
      const hashPassword = await bcrypt.hash(password, 10)
      const dataCreate = { ...data, password: hashPassword }
      const result = await AuthModel.createAuth(dataCreate)
      const token = Jwt.sign({ _id: result.insertedId }, SECRET_KEY, { expiresIn: EXPIRES_IN })
      const user = await AuthModel.findOneById(result.insertedId)
      InvalidAuth.forEach((item) => delete user[item])
      return { token, user }
    }
    catch (error) {
      throw error
    }
  }

  static async loginService(data) {
    try {
      const { email, password } = data
      const check = await AuthModel.findOneByEmail(email)
      if (!check) {
        throw new Error('Email not found')
      }
      const isMatch = await bcrypt.compare(password, check.password)
      if (!isMatch) {
        throw new Error('Password is incorrect')
      }
      const token = Jwt.sign({ _id: check._id }, SECRET_KEY, { expiresIn: EXPIRES_IN })
      const user = await AuthModel.findOneByEmail(email)
      InvalidAuth.forEach((item) => delete user[item])
      return { token, user }
    }
    catch (error) {
      throw error
    }
  }

  static async forgotPasswordService(data) {
    try {
      const { email } = data
      const check = await AuthModel.findOneByEmail(email)
      if (!check) {
        throw new Error('Email not found')
      }
      const token = Jwt.sign({ _id: check._id }, SECRET_KEY, { expiresIn: EXPIRES_IN })
      const newPassword = '123456'
      const hashPassword = await bcrypt.hash(newPassword, 10)
      await AuthModel.updateAuth(check._id, { password: hashPassword })
      const user = await AuthModel.findOneByEmail(email)
      InvalidAuth.forEach((item) => delete user[item])
      user.password = newPassword
      return { token, user }
    }
    catch (error) {
      throw error
    }
  }

  static async updateAuthService(id, data) {
    try {
      InvalidAuth.forEach((item) => delete data[item])
      const newData = { ...data, updateAt: Date.now() }
      const result = await AuthModel.updateAuth(id, newData)
      let newResult = {}
      if (result) {
        Object.keys(data).forEach((key) => {
          newResult[key] = result[key]
        })
      }
      return newResult
    } catch (error) {
      throw error
    }
  }

  static async updatePasswordService(id, data) {
    try {
      const { oldPassword, newPassword } = data
      const user = await AuthModel.findOneById(id)
      if (!user) {
        throw new Error('User not found')
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password)
      if (!isMatch) {
        throw new Error('Old Password is incorrect')
      }
      const hashPassword = await bcrypt.hash(newPassword, 10)
      await AuthModel.updateAuth(id, { password: hashPassword })
      return { message: 'Update password success! New Password: '+ newPassword }
    } catch (error) {
      throw error
    }
  }

  static async getListBoardService(id) {
    try {
      const data = await AuthModel.fetchBoardOwnerIds(id)
      if (!data) return []
      return data.listBoard
    } catch (error) {
      throw error
    }
  }
}