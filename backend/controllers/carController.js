// controllers/carController.js
import Car from "../models/carModel.js";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Helper to delete old images safely
const deleteLocalFileIfPresent = (filePath) => {
  if (!filePath) return;
  const filename = filePath.replace(/^\/uploads\//, "");
  const fullPath = path.join(UPLOADS_DIR, filename);
  fs.unlink(fullPath, (err) => {
    if (err) console.warn("Failed to delete file:", fullPath, err);
  });
};

// ------------------ CREATE CAR ------------------
export const createCar = async (req, res, next) => {
  try {
    const {
      make, model, dailyRate, category, description,
      year, color, seats, transmission, fuelType, mileage, status
    } = req.body;

    if (!make || !model || !dailyRate) {
      return res.status(400).json({ message: 'make, model and dailyRate are required' });
    }

    let imageFilename = req.body.image || '';
    if (req.file) imageFilename = req.file.filename;

    const car = new Car({
      make,
      model,
      year: year ? Number(year) : undefined,
      color: color || '',
      category: category || 'Sedan',
      seats: seats ? Number(seats) : 4,
      transmission: transmission || 'Automatic',
      fuelType: fuelType || 'Gasoline',
      mileage: mileage ? Number(mileage) : 0,
      dailyRate: Number(dailyRate),
      status: status || 'available',
      image: imageFilename,
      description: description || ''
    });

    const saved = await car.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// ------------------ GET ALL CARS (Safe availability) ------------------
export const getCars = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const status = req.query.status || '';

    const query = {};
    if (search) {
      query.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (status) query.status = status;

    const total = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Safely attach availability
    const carsWithAvailability = cars.map(c => {
      const plain = c.toObject ? c.toObject() : c;
      try {
        plain.availability = c.getAvailabilitySummary();
      } catch (err) {
        console.warn('Availability error for car', c._id, err.message);
        plain.availability = { state: 'unknown' };
      }
      return plain;
    });

    res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      data: carsWithAvailability
    });
  } catch (err) {
    console.error('getCars failed:', err);
    next(err);
  }
};

// ------------------ GET CAR BY ID ------------------
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    const plain = car.toObject ? car.toObject() : car;
    try {
      plain.availability = car.getAvailabilitySummary();
    } catch (err) {
      console.warn('Availability error for car', car._id, err.message);
      plain.availability = { state: 'unknown' };
    }

    res.json(plain);
  } catch (err) {
    next(err);
  }
};

// ------------------ UPDATE CAR ------------------
export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    // Handle new image upload
    if (req.file) {
      if (car.image) deleteLocalFileIfPresent(car.image);
      car.image = req.file.filename;
    } else if (req.body.image !== undefined) {
      if (!req.body.image && car.image) deleteLocalFileIfPresent(car.image);
      car.image = req.body.image || car.image;
    }

    // Update fields
    const fields = ['make','model','year','color','category','seats','transmission','fuelType','mileage','dailyRate','status','description'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        if (['year','seats','mileage','dailyRate'].includes(f)) car[f] = Number(req.body[f]);
        else car[f] = req.body[f];
      }
    });

    const updated = await car.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// ------------------ DELETE CAR ------------------
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });

    if (car.image) deleteLocalFileIfPresent(car.image);
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    next(err);
  }
};
