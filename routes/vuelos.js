import express from "express";
import * as data from "../data/data.js";
const router = express.Router();

router.get("/", (req,res)=>{
  const flights = data.getAllFlights();
  res.render("vuelos", { titulo: "Vuelos", flights });
});

router.get("/nuevo", (req,res)=>{
  res.render("nuevo_vuelo", { titulo: "Nuevo Vuelo" });
});

router.post("/nuevo", (req,res)=>{
  const { code, origin, destination, departure, seats_total } = req.body;
  data.createFlight({ code, origin, destination, departure, seats_total });
  res.redirect("/vuelos");
});

router.get("/editar/:id", (req,res)=>{
  const flight = data.findFlightById(req.params.id);
  if(!flight) return res.redirect("/vuelos");
  res.render("editar_vuelo", { titulo: "Editar Vuelo", flight });
});

router.post("/editar/:id", (req,res)=>{
  data.updateFlight(req.params.id, req.body);
  res.redirect("/vuelos");
});

router.get("/borrar/:id", (req,res)=>{
  data.deleteFlight(req.params.id);
  res.redirect("/vuelos");
});

export default router;
