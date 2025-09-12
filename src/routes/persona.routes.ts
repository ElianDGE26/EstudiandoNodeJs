

import { Router } from "express";
import { getUsers, getUserById, postUser, putUser, deleteUser, loginUser } from "../controllers/user.controller"; 
import { validetoken, isOwner  } from "../helpers/authentication";
const router = Router();



router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id',validetoken, getUserById);
router.post('/register', postUser);
router.put('/:id',validetoken,isOwner, putUser);
router.delete('/:id',validetoken,isOwner, deleteUser);

export default router;