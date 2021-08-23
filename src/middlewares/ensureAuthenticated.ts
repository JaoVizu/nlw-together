import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  // Receber o token
  const authToken = request.headers.authorization
  
  // Validar se token está preenchido
  if(!authToken) {
    return response.status(401).end();
  }

  //ignora a primeira posição
  const [,token] = authToken.split(" ");

  // Validar se token é válido
  try{
    const { sub } = verify(token, "cbd18b3884c75b1fb5bb00ea2a9fa2ba") as IPayload;
    
    // Recuperar informações do usuário
    request.user_id = sub;
    
    return next();
  } catch(err){
    return response.status(401).end()
  }

  
}