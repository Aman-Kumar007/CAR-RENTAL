// routes/carRoutes.js
import express from 'express';
import {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar
} from '../controllers/carController.js';
import { upload } from '../middlewares/upload.js';
import authMiddleware from '../middlewares/auth.js';

const carRouter = express.Router();

// ----------------------
// Public routes (no JWT required)
// ----------------------
carRouter.get('/', getCars);       // fetch list of cars
carRouter.get('/:id', getCarById); // fetch single car

// ----------------------
// Protected routes (JWT required)
// ----------------------
carRouter.post('/', authMiddleware, upload.single('image'), createCar);
carRouter.put('/:id', authMiddleware, upload.single('image'), updateCar);
carRouter.delete('/:id', authMiddleware, deleteCar);

export default carRouter;
