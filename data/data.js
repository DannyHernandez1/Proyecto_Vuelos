/*
In-memory storage for Flights and Reservations.
Provides functions for CRUD and business logic.
*/
import { randomUUID } from "crypto";

const flights = [];
const reservations = [];

// seed 10 flights
export function seedData(){
  if(flights.length>0) return;
  const sample = [
    ["MX100","Ciudad de Mexico","Guadalajara","2025-11-01 08:00",60],
    ["MX101","Ciudad de Mexico","Monterrey","2025-11-01 09:30",50],
    ["MX102","Guadalajara","Cancun","2025-11-02 07:00",80],
    ["MX103","Monterrey","Ciudad de Mexico","2025-11-03 12:00",70],
    ["MX104","Cancun","Guadalajara","2025-11-04 15:45",90],
    ["MX105","Ciudad de Mexico","Tijuana","2025-11-05 06:20",40],
    ["MX106","Tijuana","Ciudad de Mexico","2025-11-06 11:00",55],
    ["MX107","Monterrey","Cancun","2025-11-07 13:30",65],
    ["MX108","Guadalajara","Monterrey","2025-11-08 10:15",75],
    ["MX109","Cancun","Ciudad de Mexico","2025-11-09 19:00",85]
  ];
  for(const s of sample){
    createFlight({
      code:s[0], origin:s[1], destination:s[2], departure:s[3], seats_total:s[4]
    });
  }
}

// Flights
export function createFlight({code, origin, destination, departure, seats_total}){
  const f = {
    id: randomUUID(),
    code,
    origin,
    destination,
    departure,
    seats_total: Number(seats_total)||0,
    seats_available: Number(seats_total)||0,
    created_at: new Date().toISOString()
  };
  flights.push(f);
  return f;
}

export function getAllFlights(){
  return flights;
}

export function findFlightById(id){
  return flights.find(f=>f.id===id);
}

export function updateFlight(id, data){
  const f = findFlightById(id);
  if(!f) return null;
  const old_total = f.seats_total;
  const used = old_total - f.seats_available;
  f.code = data.code || f.code;
  f.origin = data.origin || f.origin;
  f.destination = data.destination || f.destination;
  f.departure = data.departure || f.departure;
  const new_total = Number(data.seats_total||old_total);
  f.seats_total = new_total;
  f.seats_available = Math.max(0, new_total - used);
  return f;
}

export function deleteFlight(id){
  const idx = flights.findIndex(f=>f.id===id);
  if(idx===-1) return false;
  // remove flight and its reservations
  flights.splice(idx,1);
  for(let i=reservations.length-1;i>=0;i--){
    if(reservations[i].flight_id===id) reservations.splice(i,1);
  }
  return true;
}

// Reservations
export function createReservation({flight_id, passenger_name, passenger_email}){
  const flight = findFlightById(flight_id);
  if(!flight) return { error: "Vuelo no encontrado" };
  if(flight.seats_available<=0) return { error: "No hay asientos disponibles" };
  const r = {
    id: randomUUID(),
    flight_id,
    passenger_name,
    passenger_email,
    status: "confirmada",
    created_at: new Date().toISOString()
  };
  reservations.push(r);
  flight.seats_available -= 1;
  return r;
}

export function getAllReservations(){
  // include flight summary
  return reservations.map(r=>{
    const flight = findFlightById(r.flight_id);
    return {
      ...r,
      flight: flight ? { code:flight.code, origin:flight.origin, destination:flight.destination, departure:flight.departure } : null
    };
  });
}

export function findReservationById(id){
  return reservations.find(r=>r.id===id);
}

export function updateReservation(id, data){
  const r = findReservationById(id);
  if(!r) return null;
  // allow reassign flight
  if(data.flight_id && data.flight_id !== r.flight_id){
    const oldFlight = findFlightById(r.flight_id);
    const newFlight = findFlightById(data.flight_id);
    if(!newFlight) return { error: "Nuevo vuelo no encontrado" };
    if(newFlight.seats_available<=0) return { error: "No hay asientos en el nuevo vuelo" };
    if(oldFlight) oldFlight.seats_available += 1;
    newFlight.seats_available -= 1;
    r.flight_id = data.flight_id;
  }
  r.passenger_name = data.passenger_name || r.passenger_name;
  r.passenger_email = data.passenger_email || r.passenger_email;
  r.status = data.status || r.status;
  return r;
}

export function cancelReservation(id){
  const r = findReservationById(id);
  if(!r) return { error: "Reserva no encontrada" };
  if(r.status === "cancelada") return { error: "Reserva ya cancelada" };
  const flight = findFlightById(r.flight_id);
  if(flight) flight.seats_available += 1;
  r.status = "cancelada";
  return r;
}
