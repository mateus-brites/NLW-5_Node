import { getCustomRepository, Repository } from "typeorm";
import {connection}  from  '../database';
import { User } from "../entities/Users";
import { UsersRepository } from "../repositories/UsersRepository";

class UsersService{
    
    private usersRepository: Repository<User>
    
    constructor(){
        this.usersRepository = getCustomRepository(UsersRepository);
    }

    async create(email: string){

        const userAlreadyExist = await this.usersRepository.findOne({ email });

        if(userAlreadyExist){
            return userAlreadyExist;
        }

        const user = this.usersRepository.create({ email });

        await this.usersRepository.save(user);


        return user;
    }

    async findByEmail(email: string) {
        const user = await (await connection).getCustomRepository(UsersRepository)
                                .findOne({ email } as any);
    
        return user;
      }
}

export { UsersService }