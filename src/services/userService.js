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
      if (user.boardJoinIds) delete user.boardJoinIds
      if (board.members.find((member) => member._id === user._id)) throw new Error('User already in board')

      return await Promise.all([AuthModel.pushBoardJoinIds(user._id, board._id), BoardModel.pushMembers(board._id, user)])
    }
    catch (error) {
      throw error
    }
  }

  static async removeMemberService(userId, board, user) {
    try {
      if (userId !== board.userId) throw new Error('Only board owner can remove member')
      if (userId === user._id) throw new Error('Can not remove yourself')

      return await Promise.all([AuthModel.pullBoardJoinIds(user._id, board._id), BoardModel.pullMembers(board._id, user._id)])
    }
    catch (error) {
      throw error
    }
  }
}
