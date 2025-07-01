import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'wonder-wo-secret-key-dev'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'

// Stockage simple en mémoire (remplacera la DB plus tard)
const users: Array<{ id: number; email: string; password: string }> = []
let nextUserId = 1

// Hasher un mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// Vérifier un mot de passe
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// Générer un token JWT
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

// Vérifier un token JWT
export const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    return decoded
  } catch (error) {
    return null
  }
}

// Fonctions CRUD simples pour les utilisateurs
export const createUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password)
  const user = {
    id: nextUserId++,
    email,
    password: hashedPassword
  }
  users.push(user)
  return { id: user.id, email: user.email }
}

export const findUserByEmail = async (email: string) => {
  return users.find(user => user.email === email) || null
}

export const findUserById = async (id: number) => {
  const user = users.find(user => user.id === id)
  return user ? { id: user.id, email: user.email } : null
} 