import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./modules/auth/routes/auth.routes";
import slotRoutes from "./modules/slot/routes/slot.routes";
import trainerRoutes from "./modules/trainer/routes/trainer.routes";
import bookingRoutes from "./modules/booking/routes/booking.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// Routes
app.use("/auth", authRoutes);

app.use("/trainer", trainerRoutes);

app.use("/slots", slotRoutes);

app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
