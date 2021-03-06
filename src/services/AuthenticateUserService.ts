import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  
  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    //Verificar se e-mail existe
    const user = await usersRepositories.findOne({email});

    if(!user) {
      throw new Error("E-mail/Password incorrect")
    }
    
    // verificar ss senha está correta
    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) {
      throw new Error("E-mail/Password incorrect")
    }

    // Gerar Token
    const token = sign(
      {
        email: user.email
      }, "cbd18b3884c75b1fb5bb00ea2a9fa2ba", {
        subject: user.id,
        expiresIn: "1d"
      }
    );
    
    return token
  }
}

export { AuthenticateUserService }