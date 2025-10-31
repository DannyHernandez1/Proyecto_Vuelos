import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import bodyParser from "body-parser";

import indexRouter from "./routes/index.js";
import vuelosRouter from "./routes/vuelos.js";
import reservacionesRouter from "./routes/reservaciones.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// routers
app.use("/", indexRouter);
app.use("/vuelos", vuelosRouter);
app.use("/reservaciones", reservacionesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Servidor en http://localhost:${PORT}`));
