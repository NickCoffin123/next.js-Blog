import * as cookie from "cookie";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export default function handler(req, res){

    res.setHeader('Set-Cookie', cookie.serialize('token', '',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: "/"
    }))

    res.status(200).json({message: 'Logout successful'})
}