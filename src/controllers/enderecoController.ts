import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class EnderecoController {
    static async create(req: Request, res: Response) {
    const { CEP, rua, cidade, bairro, numero, complemento} = req.body;

    try {        
        const { id } = req.params;
        let enderecoInput: Prisma.EnderecoCreateInput = {
            CEP,
            rua,
            cidade,
            bairro,
            numero,
            complemento,
            usuario:{
                connect: {idUsuario: Number(id)}
            }
        }

      const newEndereco = await prisma.endereco.create({
        data: enderecoInput,
      });

      return res.status(201).json({
                message: "Endereço criado com sucesso!",
                data: newEndereco,
            });

    } 
    catch (error) {
        return res.status(500).json({
            message: "Erro ao criar endereço",
            error: error,
        });
    }
  };

  static async read(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const endereco = await prisma.endereco.findFirst({
            where: { idUsuario: Number(id) },
        });
        if (!endereco) {
            return res.status(404).json({
                message: "Endereço não encontrado",
            });
        }
        return res.status(200).json(endereco);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao obter endereço",
            error: error,
        });
    }
}

 static async update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { CEP, rua, cidade, bairro, numero, complemento} = req.body;
        const updatedEndereco = await prisma.endereco.update({
            where: { idUsuario: Number(id) },
            data: {
                CEP,
                rua,
                cidade,
                bairro,
                numero,
                complemento
            },
        });
        return res.status(200).json({
            message: "Endereço atualizado com sucesso!",
            data: updatedEndereco,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar endereço",
            error: error,
        });
    }
}


static async delete(req: Request, res: Response) {
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

        const deleteEndereco = usuario.endereco[0].idEndereco;

        await prisma.endereco.delete({
            where: { idEndereco: Number(deleteEndereco)},
        });
        return res.status(200).json({
            message: "Endereço deletado com sucesso!",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao deletar endereço",
            error: error,
        });
    }
}
}

export default EnderecoController;