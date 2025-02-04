import pool from "../../conexion/db.js";

export const crearTriggerAbonosBancarios = async () => {
  try {
    const crearFuncion = `
      CREATE OR REPLACE FUNCTION gestionar_abonos_bancarios()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Inserción
        IF TG_OP = 'INSERT' AND NEW.abono > 0 THEN
          INSERT INTO abonos_bancarios (
            fecha, referencia, concepto, abono, codigo_operacion, tipo_operacion, mes, año
          )
          VALUES (            
            NEW.fecha,
            NEW.referencia,
            NEW.concepto,
            NEW.abono,
            NEW.codigo_operacion,
            NEW.tipo_operacion,
            TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'TMMonth'), -- Calcular mes
            TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'YYYY') -- Calcular año
          );

        -- Actualización
        ELSIF TG_OP = 'UPDATE' AND NEW.abono > 0 THEN
          UPDATE abonos_bancarios
          SET            
            fecha = NEW.fecha,
            concepto = NEW.concepto,
            abono = NEW.abono,
            codigo_operacion = NEW.codigo_operacion,
            tipo_operacion = NEW.tipo_operacion,
            mes = TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'TMMonth'), -- Calcular mes
            año = TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'YYYY') -- Calcular año
          WHERE referencia = OLD.referencia;

        -- Eliminación
        ELSIF TG_OP = 'DELETE' AND OLD.abono > 0 THEN
          DELETE FROM abonos_bancarios
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
      WHERE event_object_table = 'estado_de_cuenta_bancario' 
        AND trigger_name = 'trigger_gestionar_abonos';
    `;

    const { rows } = await pool.query(checkTrigger);

    if (parseInt(rows[0].count) === 0) {
      const crearTrigger = `
        CREATE TRIGGER trigger_gestionar_abonos
        AFTER INSERT OR UPDATE OR DELETE ON estado_de_cuenta_bancario
        FOR EACH ROW
        EXECUTE FUNCTION gestionar_abonos_bancarios();
      `;
      await pool.query(crearTrigger);
      console.log("Trigger 'trigger_gestionar_abonos' creado con éxito.");
    } else {
      console.log("El trigger 'trigger_gestionar_abonos' ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el trigger:", error);
    throw new Error("Error al crear el trigger gestionar_abonos_bancarios");
  }
};
