import express from 'express';
import { allUsers, createuser, deleteusers, edit, filter, getUser, Login, registerStudent, sendmessage, signout, test, updateuser, userdetails } from '../controllers/user.controller.js';
const router=express.Router();
router.get('/test',test);
router.post('/students', registerStudent);
router.get('/me/:id', getUser);

router.post('/login', Login);
router.post('/signout', signout);

router.get('/users/:name', userdetails);
router.put('/users/:name', edit);

router.post('/all', allUsers);
router.delete('/delete/:id', deleteusers);

router.put('/update/:id',updateuser);
router.post('/create',createuser);

router.get('/',filter);

router.post('/message/send', sendmessage);
       
export default router;