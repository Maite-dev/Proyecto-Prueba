import pool from "../../conexion/db.js";

export const crearTriggerContratosPorMes = async () => {
  try {
    const crearFuncion = `
      CREATE OR REPLACE FUNCTION update_contratos_por_mes()
      RETURNS TRIGGER AS $$ 
      BEGIN 
        -- Si se está insertando un nuevo contrato
        IF (TG_OP = 'INSERT') THEN
          INSERT INTO contratos_por_mes (
            contrato_id, 
            numero_contrato, 
            contrato_inicio, 
            contrato_finalizacion, 
            mes, 
            año, 
            fecha_actualizacion
          )
          VALUES (
            NEW.id,
            NEW.numero_contrato,
            NEW.contrato_inicio,
            NEW.contrato_finalizacion,
            TO_CHAR(NEW.contrato_inicio, 'FMMonth'), -- Nombre del mes
            TO_CHAR(NEW.contrato_inicio, 'YYYY'),   -- Año
            CURRENT_TIMESTAMP
          )
          ON CONFLICT (numero_contrato) DO UPDATE SET
            contrato_id = EXCLUDED.contrato_id,
            contrato_inicio = EXCLUDED.contrato_inicio,
            contrato_finalizacion = EXCLUDED.contrato_finalizacion,
            mes = EXCLUDED.mes,
            año = EXCLUDED.año,
            fecha_actualizacion = CURRENT_TIMESTAMP;
          RETURN NEW;

        -- Si se está actualizando un contrato
        ELSIF (TG_OP = 'UPDATE') THEN
          UPDATE contratos_por_mes
          SET
            numero_contrato = NEW.numero_contrato,
            contrato_inicio = NEW.contrato_inicio,
            contrato_finalizacion = NEW.contrato_finalizacion,
            mes = TO_CHAR(NEW.contrato_inicio, 'FMMonth'), -- Nombre del mes
            año = TO_CHAR(NEW.contrato_inicio, 'YYYY'),   -- Año
            fecha_actualizacion = CURRENT_TIMESTAMP
          WHERE contrato_id = NEW.id;
          RETURN NEW;

        -- Si se está eliminando un contrato
        ELSIF (TG_OP = 'DELETE') THEN
          DELETE FROM contratos_por_mes WHERE contrato_id = OLD.id;
          RETURN OLD;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await pool.query(crearFuncion);

    const checkTrigger = `
      SELECT COUNT(*) 
      FROM information_schema.triggers 
      WHERE event_object_table = 'contratos' AND trigger_name = 'trigger_update_contratos_por_mes';
    `;

    const { rows } = await pool.query(checkTrigger);

    if (parseInt(rows[0].count) === 0) {
      const crearTrigger = `
        CREATE TRIGGER trigger_update_contratos_por_mes
        AFTER INSERT OR UPDATE OR DELETE ON contratos
        FOR EACH ROW
        EXECUTE FUNCTION update_contratos_por_mes();
      `;
      await pool.query(crearTrigger);
      console.log("Trigger 'trigger_update_contratos_por_mes' creado con éxito.");
    } else {
      console.log("El trigger 'trigger_update_contratos_por_mes' ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el trigger:", error);
    throw new Error("Error al crear el trigger update_contratos_por_mes");
  }
};
