import express from "express";
import * as data from "../data/data.js";
const router = express.Router();

router.get("/", (req,res)=>{
  const reservations = data.getAllReservations();
  res.render("reservaciones", { titulo: "Reservaciones", reservations });
});

router.get("/nueva", (req,res)=>{
  const flights = data.getAllFlights();
  res.render("nueva_reservacion", { titulo: "Nueva Reservación", flights });
});

router.post("/nueva", (req,res)=>{
  const { flight_id, passenger_name, passenger_email } = req.body;
  const result = data.createReservation({ flight_id, passenger_name, passenger_email });
  if(result && result.error){
    // show simple error page or redirect with query (keeping simple)
    return res.render("error", { message: result.error });
  }
  res.redirect("/reservaciones");
});

router.get("/editar/:id", (req,res)=>{
  const reservation = data.findReservationById(req.params.id);
  const flights = data.getAllFlights();
  if(!reservation) return res.redirect("/reservaciones");
  res.render("editar_reservacion", { titulo: "Editar Reservación", reservation, flights });
});

router.post("/editar/:id", (req,res)=>{
  const updated = data.updateReservation(req.params.id, req.body);
  if(updated && updated.error) return res.render("error", { message: updated.error });
  res.redirect("/reservaciones");
});

router.get("/cancelar/:id", (req,res)=>{
  data.cancelReservation(req.params.id);
  res.redirect("/reservaciones");
});

export default router;
