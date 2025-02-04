// import pool from "../../conexion/db.js";

// export const crearTriggerTransferencias = async () => {
//   try {
//     const crearFuncion = `
//       CREATE OR REPLACE FUNCTION gestionar_transferencias_bancarias()
//       RETURNS TRIGGER AS $$
//       BEGIN
//         -- Inserción
//         IF TG_OP = 'INSERT' THEN
//           -- Verificar si la referencia existe en estado_de_cuenta_bancario
//           IF EXISTS (
//             SELECT 1 
//             FROM estado_de_cuenta_bancario 
//             WHERE referencia = NEW.referencia
//           ) THEN
//             -- Insertar en conciliacion_bancaria con abono de estado_de_cuenta_bancario
//             INSERT INTO conciliacion_bancaria (
//               referencia,
//               abono,
//               abono_estado_de_cuenta,
//               verificacion,
//               rif,
//               razon_social,
//               mes,
//               año,
//               created_at
//             )
//             SELECT
//               NEW.referencia,
//               NEW.abono,
//               ec.abono, -- Obtener el abono de estado_de_cuenta_bancario
//               'aprobado',
//               NEW.rif,
//               NEW.razon_social,
//               TO_CHAR(NEW.created_at, 'TMMonth'),
//               EXTRACT(YEAR FROM NEW.created_at),
//               NEW.created_at
//             FROM estado_de_cuenta_bancario ec
//             WHERE ec.referencia = NEW.referencia;
//           END IF;

//         -- Actualización
//         ELSIF TG_OP = 'UPDATE' THEN
//           -- Verificar si la referencia existe en estado_de_cuenta_bancario
//           IF EXISTS (
//             SELECT 1 
//             FROM estado_de_cuenta_bancario 
//             WHERE referencia = NEW.referencia
//           ) THEN
//             -- Actualizar en conciliacion_bancaria
//             UPDATE conciliacion_bancaria
//             SET
//               abono = NEW.abono,
//               abono_estado_de_cuenta = ec.abono, -- Actualizar con abono de estado_de_cuenta_bancario
//               rif = NEW.rif,
//               razon_social = NEW.razon_social,
//               mes = TO_CHAR(NEW.created_at, 'TMMonth'),
//               año = EXTRACT(YEAR FROM NEW.created_at),
//               created_at = NEW.created_at
//             FROM estado_de_cuenta_bancario ec
//             WHERE ec.referencia = NEW.referencia
//               AND conciliacion_bancaria.referencia = NEW.referencia;
//           END IF;

//         -- Eliminación
//         ELSIF TG_OP = 'DELETE' THEN
//           -- Eliminar de conciliacion_bancaria si la referencia coincide
//           DELETE FROM conciliacion_bancaria
//           WHERE referencia = OLD.referencia;
//         END IF;

//         RETURN NEW;
//       END;
//       $$ LANGUAGE plpgsql;
//     `;

//     await pool.query(crearFuncion);

//     const checkTrigger = `
//       SELECT COUNT(*)
//       FROM information_schema.triggers
//       WHERE event_object_table = 'transferencias' 
//         AND trigger_name = 'trigger_gestionar_transferencias';
//     `;

//     const { rows } = await pool.query(checkTrigger);

//     if (parseInt(rows[0].count) === 0) {
//       const crearTrigger = `
//         CREATE TRIGGER trigger_gestionar_transferencias
//         AFTER INSERT OR UPDATE OR DELETE ON transferencias
//         FOR EACH ROW
//         EXECUTE FUNCTION gestionar_transferencias_bancarias();
//       `;
//       await pool.query(crearTrigger);
//       console.log("Trigger 'trigger_gestionar_transferencias' creado con éxito.");
//     } else {
//       console.log("El trigger 'trigger_gestionar_transferencias' ya existe.");
//     }
//   } catch (error) {
//     console.error("Error al crear el trigger:", error);
//     throw new Error("Error al crear el trigger gestionar_transferencias_bancarias");
//   }
// };

import pool from "../../conexion/db.js";

export const crearTriggerTransferencias = async () => {
  try {
    const crearFuncion = `
      CREATE OR REPLACE FUNCTION gestionar_transferencias_bancarias()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Inserción
        IF TG_OP = 'INSERT' THEN
          -- Verificar si la referencia existe en estado_de_cuenta_bancario
          IF EXISTS (
            SELECT 1 
            FROM estado_de_cuenta_bancario 
            WHERE referencia = NEW.referencia
          ) THEN
            -- Insertar en conciliacion_bancaria con validación de abonos
            INSERT INTO conciliacion_bancaria (
              referencia,
              abono,
              abono_estado_de_cuenta,
              verificacion,
              rif,
              razon_social,
              mes,
              año,
              created_at
            )
            SELECT
              NEW.referencia,
              NEW.abono,
              ec.abono, -- Obtener el abono de estado_de_cuenta_bancario
              CASE 
                WHEN NEW.abono = ec.abono THEN 'aprobado'
                ELSE 'no aprobado'
              END,
              NEW.rif,
              NEW.razon_social,
              TO_CHAR(NEW.created_at, 'TMMonth'),
              EXTRACT(YEAR FROM NEW.created_at),
              NEW.created_at
            FROM estado_de_cuenta_bancario ec
            WHERE ec.referencia = NEW.referencia;
          END IF;

        -- Actualización
        ELSIF TG_OP = 'UPDATE' THEN
          -- Verificar si la referencia existe en estado_de_cuenta_bancario
          IF EXISTS (
            SELECT 1 
            FROM estado_de_cuenta_bancario 
            WHERE referencia = NEW.referencia
          ) THEN
            -- Actualizar en conciliacion_bancaria con validación de abonos
            UPDATE conciliacion_bancaria
            SET
              abono = NEW.abono,
              abono_estado_de_cuenta = ec.abono, -- Actualizar con abono de estado_de_cuenta_bancario
              verificacion = CASE 
                WHEN NEW.abono = ec.abono THEN 'aprobado'
                ELSE 'no aprobado'
              END,
              rif = NEW.rif,
              razon_social = NEW.razon_social,
              mes = TO_CHAR(NEW.created_at, 'TMMonth'),
              año = EXTRACT(YEAR FROM NEW.created_at),
              created_at = NEW.created_at
            FROM estado_de_cuenta_bancario ec
            WHERE ec.referencia = NEW.referencia
              AND conciliacion_bancaria.referencia = NEW.referencia;
          END IF;

        -- Eliminación
        ELSIF TG_OP = 'DELETE' THEN
          -- Eliminar de conciliacion_bancaria si la referencia coincide
          DELETE FROM conciliacion_bancaria
          WHERE referencia = OLD.referencia;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await pool.query(crearFuncion);

    const checkTrigger = `
      SELECT COUNT(*)
      FROM information_schema.triggers
      WHERE event_object_table = 'transferencias' 
        AND trigger_name = 'trigger_gestionar_transferencias';
    `;

    const { rows } = await pool.query(checkTrigger);

    if (parseInt(rows[0].count) === 0) {
      const crearTrigger = `
        CREATE TRIGGER trigger_gestionar_transferencias
        AFTER INSERT OR UPDATE OR DELETE ON transferencias
        FOR EACH ROW
        EXECUTE FUNCTION gestionar_transferencias_bancarias();
      `;
      await pool.query(crearTrigger);
      console.log("Trigger 'trigger_gestionar_transferencias' creado con éxito.");
    } else {
      console.log("El trigger 'trigger_gestionar_transferencias' ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el trigger:", error);
    throw new Error("Error al crear el trigger gestionar_transferencias_bancarias");
  }
};

