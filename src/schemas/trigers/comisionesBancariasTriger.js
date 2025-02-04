import pool from "../../conexion/db.js";

export const crearTriggerComisionesBancarias = async () => {
  try {
    const crearFuncion = `
      CREATE OR REPLACE FUNCTION gestionar_comisiones_bancarias()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Inserción
        IF TG_OP = 'INSERT' AND NEW.codigo_operacion = 'CO' THEN
          INSERT INTO comisiones_bancarias (
            fecha, referencia, concepto, cargo, codigo_operacion, tipo_operacion, mes, año
          )
          VALUES (
            NEW.fecha,
            NEW.referencia,
            NEW.concepto,
            NEW.cargo,
            NEW.codigo_operacion,
            NEW.tipo_operacion,
            TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'TMMonth'), 
            TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'YYYY')            
          );

        -- Actualización
        ELSIF TG_OP = 'UPDATE' AND NEW.codigo_operacion = 'CO' THEN
          UPDATE comisiones_bancarias
          SET
            fecha = NEW.fecha,
            referencia = NEW.referencia,
            concepto = NEW.concepto,
            cargo = NEW.cargo,
            codigo_operacion = NEW.codigo_operacion,
            tipo_operacion = NEW.tipo_operacion,
            mes = TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'TMMonth'),
            año = TO_CHAR(TO_DATE(NEW.fecha, 'YYYY-MM-DD'), 'YYYY')         
          WHERE referencia = OLD.referencia;

        -- Eliminación
        ELSIF TG_OP = 'DELETE' THEN
          DELETE FROM comisiones_bancarias
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
        AND trigger_name = 'trigger_gestionar_comisiones';
    `;

    const { rows } = await pool.query(checkTrigger);

    if (parseInt(rows[0].count) === 0) {
      const crearTrigger = `
        CREATE TRIGGER trigger_gestionar_comisiones
        AFTER INSERT OR UPDATE OR DELETE ON estado_de_cuenta_bancario
        FOR EACH ROW
        EXECUTE FUNCTION gestionar_comisiones_bancarias();
      `;
      await pool.query(crearTrigger);
      console.log("Trigger 'trigger_gestionar_comisiones' creado con éxito.");
    } else {
      console.log("El trigger 'trigger_gestionar_comisiones' ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el trigger:", error);
    throw new Error("Error al crear el trigger gestionar_comisiones_bancarias");
  }
};
