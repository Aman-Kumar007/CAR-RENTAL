import express from 'express';
import {
  createBooking,
  getBookings,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  getMyBookings,

} from '../controllers/bookingController.js';
import { upload } from '../middlewares/upload.js';
import authMiddleware from '../middlewares/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/',authMiddleware, upload.single('carImage'), createBooking);
bookingRouter.get('/', getBookings);
bookingRouter.get('/mybooking',authMiddleware,getMyBookings);
bookingRouter.put('/:id', upload.single('carImage'), updateBooking);
bookingRouter.patch('/:id/status', updateBookingStatus);
bookingRouter.delete('/:id', deleteBooking);


export default bookingRouter;
