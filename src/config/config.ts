import dotenv from 'dotenv';

dotenv.config();

const { PORT, MONGO_URI, JWT_SECRET} = process.env;

export default {
    port: PORT,
    dbUri: MONGO_URI,
    jwtSecret: JWT_SECRET || 'your2025@25454jnjjhbxxxew324bm_jwt_secret',
};