// models/carModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Booking sub-schema
const carBookingSubSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled', 'upcoming'],
      default: 'pending',
    },
  },
  { _id: false }
);

// Car schema
const carSchema = new Schema({
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  color: { type: String, default: '' },
  category: { type: String, default: 'Sedan' },
  seats: { type: Number, default: 4 },
  transmission: { type: String, default: 'Automatic' },
  fuelType: { type: String, default: 'Gasoline' },
  mileage: { type: Number, default: 0 },
  dailyRate: { type: Number, required: true },
  status: { type: String, enum: ['available','rented','maintenance'], default: 'available' },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  bookings: { type: [carBookingSubSchema], default: [] },
});

// Helper: check date overlap
function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

// Check availability for a range
carSchema.methods.isAvailableForRange = function(requestedPickup, requestedReturn, blockingStatuses = ['pending','active','upcoming']) {
  if (!requestedPickup || !requestedReturn) return false;

  const start = new Date(requestedPickup);
  const end = new Date(requestedReturn);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) return false;

  for (const b of this.bookings || []) {
    try {
      if (!blockingStatuses.includes(b.status)) continue;
      const bStart = new Date(b.pickupDate);
      const bEnd = new Date(b.returnDate);
      if (Number.isNaN(bStart.getTime()) || Number.isNaN(bEnd.getTime())) continue;
      if (rangesOverlap(start, end, bStart, bEnd)) return false;
    } catch {
      continue;
    }
  }
  return true;
};

// Get availability summary
carSchema.methods.getAvailabilitySummary = function(nowDate = new Date()) {
  const now = new Date(nowDate);

  const blockable = (this.bookings || [])
    .filter(b => ['pending','active','upcoming'].includes(b.status))
    .map(b => {
      try { return { ...b, pickupDate: new Date(b.pickupDate), returnDate: new Date(b.returnDate) }; }
      catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => a.pickupDate - b.pickupDate);

  const active = blockable.find(b => b.pickupDate <= now && now <= b.returnDate);
  if (active) {
    const msLeft = active.returnDate - now;
    const daysRemaining = Math.ceil(msLeft / (1000*60*60*24));
    return { state: 'booked', daysRemaining: Math.max(daysRemaining,0), until: active.returnDate, bookingId: active.bookingId };
  }

  const next = blockable.find(b => b.pickupDate > now);
  if (next) {
    const msAvailable = next.pickupDate - now;
    const daysAvailable = Math.floor(msAvailable / (1000*60*60*24));
    return { state: 'available_until_reservation', daysAvailable: Math.max(daysAvailable,0), nextBookingStarts: next.pickupDate, bookingId: next.bookingId };
  }

  return { state: 'fully_available' };
};

// Compute availability for multiple cars
carSchema.statics.computeAvailabilityForCars = function(cars, nowDate = new Date()) {
  const now = new Date(nowDate);

  return cars.map(car => {
    const blockable = (car.bookings || [])
      .filter(b => ['pending','active','upcoming'].includes(b.status))
      .map(b => {
        try { return { ...b, pickupDate: new Date(b.pickupDate), returnDate: new Date(b.returnDate) }; }
        catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => a.pickupDate - b.pickupDate);

    const active = blockable.find(b => b.pickupDate <= now && now <= b.returnDate);
    if (active) {
      const msLeft = active.returnDate - now;
      const daysRemaining = Math.ceil(msLeft / (1000*60*60*24));
      car.availability = { state: 'booked', daysRemaining: Math.max(daysRemaining,0), until: active.returnDate, bookingId: active.bookingId };
      return car;
    }

    const next = blockable.find(b => b.pickupDate > now);
    if (next) {
      const msAvailable = next.pickupDate - now;
      const daysAvailable = Math.floor(msAvailable / (1000*60*60*24));
      car.availability = { state: 'available_until_reservation', daysAvailable: Math.max(daysAvailable,0), nextBookingStarts: next.pickupDate, bookingId: next.bookingId };
      return car;
    }

    car.availability = { state: 'fully_available' };
    return car;
  });
};

carSchema.index({ 'bookings.bookingId': 1 });

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
export default Car;
