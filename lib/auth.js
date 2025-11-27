import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const TOKEN_EXPIRY = '7d'

const users = [
    {
        id: '1',
        email: 'admin@dc.ca',
        // password: admin123
        password: '$2b$10$7SgR6rMFkpu8itl0pVjDIumG.0bQGTptvJdyJNUL5Vq0djL4eWfHK',
        role: 'admin'
    },
    {
        id: '2',
        email: 'author@dc.ca',
        password: '$2b$10$D83hpPNK0KU3.U2vDQOQ8e2R.d3vjIUS.wQrRoQAsasoc8yuyncNG',
        role: 'author'
    }
]

export function hashPassword(password){
    return bcrypt.hashSync(password, 10)
}

export function verifyPassword(input, hashed){
    return bcrypt.compareSync(input, hashed)
}

export function generateToken(user){
    return jwt.sign(
        {userId: user.id, email: user.email, role: user.role},
        JWT_SECRET,
        {expiresIn: TOKEN_EXPIRY}
    )
}

export function verifyToken(token){
    try{
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null;
    }
}

export function findUserByEmail(email){
    return users.find(user => user.email === email)
}