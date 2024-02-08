/* eslint-disable no-useless-catch */
import { AuthModel } from '~/models/authModel'
import { BoardModel } from '~/models/boardModel'

const InvalidUser = ['password', 'createAt', '_destroy', 'updateAt']
export class UserService {
  static async getListUserService() {
    try {
      const listUser = await AuthModel.getListUser()
      listUser.forEach((user) => {
        InvalidUser.forEach((item) => delete user[item])
      })
      return listUser
    }
    catch (error) {
      throw error
    }
  }

  static async inviteMemberService(userId, board, user) {
    try {
      if (board.userId === user._id) throw new Error('Can not invite board owner')
      if (userId === user._id) throw new Error('Can not invite yourself')
      if (user.boardOwnerIds) delete user.boardOwnerIds
      if (board.members.find((member) => member._id === user._id)) throw new Error('User already in board')

      return await BoardModel.pushMembers(board._id, user)
    }
    catch (error) {
      throw error
    }
  }

  static async removeMemberService(userId, board, user) {
    try {
      if (userId !== board.userId) throw new Error('Only board owner can remove member')
      if (userId === user._id) throw new Error('Can not remove yourself')

      return await BoardModel.pullMembers(board._id, user._id)
    }
    catch (error) {
      throw error
    }
  }
}
