import express from "express";
import { seedData, getAllFlights } from "../data/data.js";
const router = express.Router();

router.get("/", (req,res)=>{
  seedData();
  res.render("index", { titulo: "Inicio" });
});

export default router;
