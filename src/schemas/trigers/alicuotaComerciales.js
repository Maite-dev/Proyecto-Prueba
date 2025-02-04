import pool from "../../conexion/db.js";

export const crearTriggerAlicuotaComerciales = async () => {
  try {
    // Crear función para manejar cambios en comerciales
    const crearFuncion = `
      CREATE OR REPLACE FUNCTION update_alicuota_comerciales()
      RETURNS TRIGGER AS $$ 
      BEGIN 
        -- Si se actualiza la superficie de un comercial
        IF (TG_OP = 'UPDATE') THEN
          UPDATE alicuota
          SET 
            porcentaje_alicuota = (CASE 
              WHEN (NEW.superficie > 0) 
              THEN (SELECT l.superficie / NEW.superficie * 100 
                    FROM locales l 
                    WHERE l.id = alicuota.local_id)
              ELSE 0 
            END),
            fecha = CURRENT_TIMESTAMP
          WHERE local_id IN (
            SELECT id FROM locales WHERE comercial_id = NEW.id
          );
          RETURN NEW;
        END IF;

        RETURN NULL; -- Para otros casos
      END;
      $$ LANGUAGE plpgsql;
    `;

    await pool.query(crearFuncion);

    // Verificar si el trigger ya existe
    const checkTrigger = `
      SELECT COUNT(*) 
      FROM information_schema.triggers 
      WHERE event_object_table = 'comerciales' AND trigger_name = 'trigger_alicuota_comerciales';
    `;

    const { rows } = await pool.query(checkTrigger);

    if (parseInt(rows[0].count) === 0) {
      const crearTrigger = `
        CREATE TRIGGER trigger_alicuota_comerciales
        AFTER UPDATE OF superficie ON comerciales
        FOR EACH ROW
        EXECUTE FUNCTION update_alicuota_comerciales();
      `;
      await pool.query(crearTrigger);
      console.log("Trigger 'trigger_alicuota_comerciales' creado con éxito.");
    } else {
      console.log("El trigger 'trigger_alicuota_comerciales' ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el trigger para comerciales:", error);
    throw new Error("Error al crear el trigger update_alicuota_comerciales");
  }
};
