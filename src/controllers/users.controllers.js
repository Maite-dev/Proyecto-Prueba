import pool from "../conexion/db.js";
import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import { validate } from "../helpers/validate.js";
import { createToken } from "../helpers/jwt.js";
import nodemailer from "nodemailer";
import jwt from "jwt-simple";
import moment from "moment";

const secret = process.env.SECRET_KEY;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOneByEmail(email);
    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({
        status: "error",
        message: "Contraseña incorrecta.",
      });
    }

    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.status(200).send({
      status: "success",
      message: "Inicio de sesión exitoso.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send({
      status: "error",
      message: error.message || "Error desconocido.",
    });
  }
};
export const register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Validar parámetros
    validate({ name, email, password });

    // Verificar si el usuario ya existe
    const existingUser = await User.findOneByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "El usuario ya está registrado con este correo electrónico.",
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generar token de autenticación
    const token = createToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    // Responder con el usuario creado y el token
    return res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente.",
      user: newUser,
      token,
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor.",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const userIdFromParams = req.params.id; // Obtiene el ID de la URL
    const user = await User.findById(userIdFromParams); // Busca el usuario en la base de datos

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      profile: user,
    });
  } catch (error) {
    console.error("Error al obtener el perfil:", error);
    res.status(500).json({
      status: "error",
      message: "Error en el servidor.",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;

    const { password, email, name, ...otherFields } = req.body;

    if (Object.keys(otherFields).length > 0) {
      return res.status(400).json({
        status: "error",
        message:
          "Sólo se permiten los campos 'email', 'name' y 'password' para actualizar.",
      });
    }

    if (email) {
      const existingUser = await User.findOneByEmail({
        email,
        _id: { $ne: userIdToUpdate },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "El correo electrónico ya está en uso por otro usuario.",
        });
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const userUpdated = await User.updateById(userIdToUpdate, {
      name,
      email,
      password: hashedPassword,
    });
    
    if (!userUpdated) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente.",
      user: userUpdated,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({
      status: "error",
      message: "Error en el servidor.",
      error: error.message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    const userDeleted = await User.deleteById(userIdToDelete);

    if (!userDeleted) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error en el servidor",
      error: error.message,
    });
  }
};
export const recovery = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No se encontró un usuario con ese correo.",
      });
    }
    console.log(user.id());
    const payload = {
      id: user.id(),
      email: user.email,
      iat: moment().unix(),
      exp: moment().add(15, "minutes").unix(),
    };
    const token = jwt.encode(payload, secret);

    const resetLink = `http://127.0.0.1:5500/index.html?token=${token}`; //usa el de tu front//

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "juniorjavierduquevalera@gmail.com",
        pass: "ozywrowkhyabwmjo",
      },
    });

    await transporter.sendMail({
      from: '"Soporte" <juniorjavierduquevalera@gmail.com>',
      to: email,
      subject: "Recuperación de Contraseña",
      text: `Hola, por favor utiliza el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
      html: `<p>Hola, por favor utiliza el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    return res.status(200).json({
      status: "success",
      message: "Correo de recuperación enviado.",
    });
  } catch (error) {
    console.error("Error en recuperación de contraseña:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor.",
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    let payload;
    try {
      payload = jwt.decode(token, secret);
      if (payload.exp <= moment().unix()) {
        return res.status(400).json({
          status: "error",
          message: "El token ha expirado.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "El token es inválido.",
      });
    }
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado.",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el servidor.",
    });
  }
};
export const revalidarToken = async (req, res = response) => {
  const { id, name, email, role } = req.user;
  const token = createToken({
    id,
    name,
    email,
    role,
  });

  res.status(200).json({
    ok: true,
    user: { name, email, role },
    token,
  });
};
