import express from "express";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import dotenv from "dotenv";
import pool from "./conexion/db.js";
import sheetsRoutes from "./routes/sheetsRoutes.js";
import {
  createPropietariosComercialesTable,
  createComercialTable,
  createArrendatariosTable,
  createPropietarioTable,
  createLocalesTable,
  createAlicuotaTable,
  createContratosTable,
  crearTriggerAlicuota,
  crearTriggerAlicuotaComerciales,
  createContratoDetalleTable,
  createEstadoDeCuentaBancarioTable,
  crearTriggerComisionesBancarias,
  createContratosPorMesTable,
  crearTriggerContratosPorMes,
  createIngresosEnEfectivoTable,
  createComisionesBancariasTable,
  createAbonosBancariosTable,
  crearTriggerAbonosBancarios,
  createCargosBancariosTable,
  crearTriggerCargosBancarios,
  createUserTable,
  createSessionTable,
  createTasaDeCambioTable,
  createCodigoTransaccionalesTable,
  createFacturaTable,
  createDetalleFacturaTable,
  createTransferenciasTable,
  createConciliacionBancariaTable,
  crearTriggerTransferencias,
} from "./schemas/index.js";
import comercialRoutes from "./routes/comercialRoutes.js";
import arrendatarioRoutes from "./routes/arrendatarioRoutes.js";
import propietarioRoutes from "./routes/propietariosRoutes.js";
import localesRoutes from "./routes/localesRoutes.js";
import contratosRoutes from "./routes/contratosRoutes.js";
import estadoDeCuentaBancarioRoutes from "./routes/estadoDeCuentaBancarioRoutes.js";
import alicoutasRoutes from "./routes/alicuotasRoutes.js";
import comisionesBancariasRoutes from "./routes/comisionesBancariasRoutes.js";
import contratosPorMesRoutes from "./routes/contratosPorMesRoutes.js";
import ingresosEnEfectivoRoutes from "./routes/ingresosEnEfectivoRoutes.js";
import propietariosComercialesRoutes from "./routes/propietariosComercialesRoutes.js";
import abonosBancariosRoutes from "./routes/abonosBancariosRoutes.js";
import cargosRoutes from "./routes/cargosBancariosRoutes.js";
import userRoutes from "./routes/users.routes.js";
import tasaDeCambioRoutes from "./routes/tasaDeCambioRoutes.js";
import codigoTransaccionalesRoutes from "./routes/codigoTransaccionalesRoutes.js";
import facturaRoutes from "./routes/facturaRoutes.js";
import transferenciasRoutes from "./routes/transferenciasRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configuración de middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
// const PgStore = pgSession(session);

// app.use(
//   session({
//     store: new PgStore({
//       pool,
//       tableName: "user_sessions",
//     }),
//     secret: process.env.SESSION_SECRET || "lidiaApp",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Solo true si estás usando HTTPS
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     },
//   })
// );

// Rutas
app.get("/", (req, res) => {
  res.send("¡Servidor Express en funcionamiento!");
});

app.use("/api/users", userRoutes);
app.use("/api/comerciales", comercialRoutes);
app.use("/api/arrendatarios", arrendatarioRoutes);
app.use("/api/propietarios", propietarioRoutes);
app.use("/api/locales", localesRoutes);
app.use("/api/contratos", contratosRoutes);
app.use("/api/estado-de-cuenta", estadoDeCuentaBancarioRoutes);
app.use("/api/alicuotas", alicoutasRoutes);
app.use("/api/comisiones-bancarias", comisionesBancariasRoutes);
app.use("/api/contratos-por-finalizar", contratosPorMesRoutes);
app.use("/api/ingresos-en-efectivo", ingresosEnEfectivoRoutes);
app.use("/api/propietarios-comerciales", propietariosComercialesRoutes);
app.use("/api/abonos-bancarios", abonosBancariosRoutes);
app.use("/api/cargos-bancarios", cargosRoutes);
app.use("/api/tasa-de-cambio", tasaDeCambioRoutes);
app.use("/api/codigo-transaccionales", codigoTransaccionalesRoutes);
app.use("/api/facturas", facturaRoutes);
app.use("/api/transferencias", transferenciasRoutes);
app.use("/api/sheets", sheetsRoutes);

// Inicialización del servidor
const startServer = async () => {
  try {
    await createPropietariosComercialesTable();
    await createComercialTable();
    await createLocalesTable();
    await createAlicuotaTable();
    await createArrendatariosTable();
    await createPropietarioTable();
    await createEstadoDeCuentaBancarioTable();
    await createComisionesBancariasTable();
    await createAbonosBancariosTable();
    await createContratosTable();
    await createContratoDetalleTable();
    await createContratosPorMesTable();
    await createCargosBancariosTable();
    await createIngresosEnEfectivoTable();
    await createUserTable();
    await createSessionTable();
    await createTasaDeCambioTable();
    await createCodigoTransaccionalesTable();
    await createFacturaTable();
    await createDetalleFacturaTable();
    await createTransferenciasTable();
    await createConciliacionBancariaTable();
    await crearTriggerContratosPorMes();
    await crearTriggerAlicuota();
    await crearTriggerAlicuotaComerciales();
    await crearTriggerComisionesBancarias();
    await crearTriggerAbonosBancarios();
    await crearTriggerCargosBancarios();   
    await crearTriggerTransferencias();
    console.log("Base de datos inicializada correctamente");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1);
  }
};

startServer();
