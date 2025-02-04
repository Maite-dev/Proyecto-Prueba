import pool from "../../conexion/db.js";

export const crearTriggerAlicuota = async () => {
  try {
    const crearFuncion = `
      CREATE OR REPLACE FUNCTION update_alicuota()
      RETURNS TRIGGER AS $$ 
      BEGIN 
        -- Si se está insertando un nuevo local
        IF (TG_OP = 'INSERT') THEN
          INSERT INTO alicuota (local_id, porcentaje_alicuota, fecha)
          VALUES (
            NEW.id,
            (CASE 
              WHEN (SELECT superficie FROM comerciales WHERE id = NEW.comercial_id) > 0 
              THEN (NEW.superficie / (SELECT superficie FROM comerciales WHERE id = NEW.comercial_id)) * 100 
              ELSE 0 
            END),
            CURRENT_TIMESTAMP
          );
          RETURN NEW;
        
        -- Si se está actualizando un local
        ELSIF (TG_OP = 'UPDATE') THEN
          UPDATE alicuota
          SET
            porcentaje_alicuota = (CASE 
              WHEN (SELECT superficie FROM comerciales WHERE id = NEW.comercial_id) > 0 
              THEN (NEW.superficie / (SELECT superficie FROM comerciales WHERE id = NEW.comercial_id)) * 100 
              ELSE 0 
            END),
            fecha = CURRENT_TIMESTAMP
          WHERE local_id = NEW.id;
          RETURN NEW;
        
        -- Si se está eliminando un local
        ELSIF (TG_OP = 'DELETE') THEN
          DELETE FROM alicuota WHERE local_id = OLD.id;
          RETURN OLD;
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `;

    await pool.query(crearFuncion);

    const checkTrigger = `
      SELECT COUNT(*) 
      FROM information_schema.triggers 
      WHERE event_object_table = 'locales' AND trigger_name = 'trigger_alicuota_locales';
    `;

    const { rows } = await pool.query(checkTrigger);

    if (parseInt(rows[0].count) === 0) {
      const crearTrigger = `
        CREATE TRIGGER trigger_alicuota_locales
        AFTER INSERT OR UPDATE OR DELETE ON locales
        FOR EACH ROW
        EXECUTE FUNCTION update_alicuota();
      `;
      await pool.query(crearTrigger);
      console.log("Trigger 'trigger_alicuota_locales' creado con éxito.");
    } else {
      console.log("El trigger 'trigger_alicuota_locales' ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el trigger:", error);
    throw new Error("Error al crear el trigger update_alicuota");
  }
};
