import { ObjectId } from 'mongodb'

export const slugify = (text) => {
  if (!text) return ''
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\w-]+/g, '')
}

export const fixObjectId = (id) => {
  // if (typeof id !== 'string') return id
  if (!ObjectId.isValid(id)) return id
  // if (id.length !== 24) return id
  return new ObjectId(id)
}
