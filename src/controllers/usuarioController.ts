import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UsuarioController {
    static async create(req: Request, res: Response) {
    const { email, nome, telefone, sexo, tipo, senha} = req.body;

    let usuarioInput: Prisma.UsuarioCreateInput ={
        nome, 
        email,  
        telefone: Number(telefone),  
        hash: senha,
        salt: "salt",
        sexo,   
        tipo
    }
    try {
      const newUsuario = await prisma.usuario.create({
        data: usuarioInput,
      });

      return res.status(201).json({
                message: "Usuário criado com sucesso!",
                data: newUsuario,
            });

    } 
    catch (error) {
        return res.status(500).json({
            message: "Erro ao criar usuário",
            error: error,
        });
    }
  };

  static async read(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const usuario = await prisma.usuario.findUnique({
            where: { idUsuario: Number(id) },
            include: {endereco: true}
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuário não encontrado",
            });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao obter usuário",
            error: error,
        });
    }
}

 static async update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { nome, email, sexo, tipo, senha, telefone } = req.body;
        const updatedUsuario = await prisma.usuario.update({
            where: { idUsuario: Number(id) },
            data: {
                nome, 
                email,  
                telefone: Number(telefone),  
                hash: senha,
                salt: "salt",
                sexo,   
                tipo
            },
        });
        return res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            data: updatedUsuario,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar usuário",
            error: error,
        });
    }
}


static async delete(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({
            where: { idUsuario: Number(id) },
        });
        return res.status(200).json({
            message: "Usuário deletado com sucesso!",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao deletar usuário",
            error: error,
        });
    }
}
}

export default UsuarioController;