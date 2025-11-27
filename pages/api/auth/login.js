import { findUserByEmail, generateToken, verifyPassword } from "@/lib/auth";
const cookie = require("cookie");

export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (!user || !verifyPassword(password, user.password)) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        })
    );

    return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, email: user.email, role: user.role },
    });
}
