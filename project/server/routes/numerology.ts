import express from 'express';
import { saveReading, getUserReadings, deleteReading } from '../controllers/numerologyController';
import auth from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/readings', saveReading);
router.get('/readings', getUserReadings);
router.delete('/readings/:id', deleteReading);

export default router;