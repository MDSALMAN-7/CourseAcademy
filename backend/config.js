import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET
const JWT_ADMIN_SECRET=process.env.JWT_ADMIN_SECRET

export default{
    JWT_SECRET,
    JWT_ADMIN_SECRET,
}