import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "../models/carModel.js"; 

dotenv.config();




const rawCars = [
    { id: 1, name: "Toyota Corolla", type: "Compact Sedan", price: 3000, image: "HC1.png", description: "Reliable, fuel-efficient commuter.", seats: 5, fuel: "Gasoline", mileage: "30 MPG", transmission: "Automatic" },
    { id: 2, name: "Honda Civic", type: "Compact Sedan", price: 2500, image: "HC2.png", description: "Sporty handling with modern tech.", seats: 5, fuel: "Gasoline", mileage: "32 MPG", transmission: "Automatic" },
    { id: 3, name: "Volkswagen Golf", type: "Hatchback", price: 5000, image: "HC3.png", description: "Practical hatch with punchy engine.", seats: 5, fuel: "Gasoline", mileage: "29 MPG", transmission: "Manual" },
    { id: 4, name: "Hyundai Elantra", type: "Compact Sedan", price: 2000, image: "HC4.png", description: "Smooth ride, lots of tech features.", seats: 5, fuel: "Gasoline", mileage: "33 MPG", transmission: "Automatic" },
    { id: 5, name: "Nissan Altima", type: "Midsize Sedan", price: 7000, image: "HC5.png", description: "Comfortable and spacious daily driver.", seats: 5, fuel: "Gasoline", mileage: "31 MPG", transmission: "Automatic" },
    { id: 6, name: "Chevrolet Cruze", type: "Compact Sedan", price: 10000, image: "HC6.png", description: "Efficient cruiser with solid handling.", seats: 5, fuel: "Diesel", mileage: "34 MPG", transmission: "Manual" },
    { id: 7, name: "Tesla Model S", type: "Luxury Electric", price: 30000, image: "C1.png", seats: 5, fuel: "Electric", mileage: "Unlimited", transmission: "Automatic" },
    { id: 8, name: "BMW M5", type: "Sports Sedan", price: 24000, image: "C2.png", seats: 5, fuel: "Premium", mileage: "22 MPG", transmission: "Automatic" },
    { id: 9, name: "Mercedes G-Class", type: "Luxury SUV", price: 35000, image: "C3.png", seats: 5, fuel: "Diesel", mileage: "18 MPG", transmission: "Automatic" },
    { id: 10, name: "Audi R8", type: "Sports Car", price: 50000, image: "C4.png", seats: 2, fuel: "Premium", mileage: "15 MPG", transmission: "Automatic" },
    { id: 11, name: "Range Rover Velar", type: "Premium SUV", price: 40000, image: "C5.png", seats: 5, fuel: "Diesel", mileage: "28 MPG", transmission: "Automatic" },
    { id: 12, name: "Porsche 911", type: "Sports Car", price: 42500, image: "C6.png", seats: 4, fuel: "Premium", mileage: "23 MPG", transmission: "Automatic" },
    { id: 13, name: "Lamborghini Huracán", type: "Supercar", price: 100000, image: "C7.png", seats: 2, fuel: "Premium", mileage: "13 MPG", transmission: "Automatic" },
    { id: 14, name: "Ferrari F8 Tributo", type: "Supercar", price: 150000, image: "C8.png", seats: 2, fuel: "Premium", mileage: "15 MPG", transmission: "Automatic" },
    { id: 15, name: "McLaren 720S", type: "Supercar", price: 90000, image:"C9.png", seats: 2, fuel: "Premium", mileage: "14 MPG", transmission: "Automatic" },
    { id: 16, name: "Jaguar F-Type", type: "Sports Car", price: 50000, image: "C10.png", seats: 2, fuel: "Gasoline", mileage: "21 MPG", transmission: "Automatic" },
    { id: 17, name: "Chevrolet Corvette", type: "Sports Car", price: 150000, image: "C11.png", seats: 2, fuel: "Premium", mileage: "19 MPG", transmission: "Automatic" },
    { id: 18, name: "Ford Mustang GT", type: "Muscle Car", price: 200000, image:"C12.png", seats: 4, fuel: "Gasoline", mileage: "18 MPG", transmission: "Manual" }
];

const mappedCars = rawCars.map(c => {
  let mileage = 0;
  if (typeof c.mileage === "string") {
    const digits = c.mileage.replace(/\D/g, "");
    mileage = digits ? Number(digits) : 0;
  } else if (typeof c.mileage === "number") mileage = c.mileage;

  const [make, ...modelParts] = c.name.split(" ");
  const model = modelParts.join(" ") || "Unknown";

  return {
    make: make || "Unknown",
    model,
    year: 2020,
    category: c.type || "Sedan",
    seats: c.seats || 4,
    transmission: c.transmission || "Automatic",
    fuelType: c.fuel || "Gasoline",
    mileage,
    dailyRate: c.price || 1000,
    status: "available",
    image: c.image || "",
    description: c.description || "",
    bookings: [],
  };
});

const seedCars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete old cars
    const deleted = await Car.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.deletedCount} old cars`);

    // Insert new cars
    const inserted = await Car.insertMany(mappedCars);
    console.log(`🥳 Inserted ${inserted.length} new cars`);

    process.exit();
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
};


seedCars();

