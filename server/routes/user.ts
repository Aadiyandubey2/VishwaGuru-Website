import express from 'express';
import { updateProfile, changePassword, deleteAccount } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/account', deleteAccount);

export default router;