import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from './user.bcrpyt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreateUserDto) {
    const userData = await this.userRepository.findOne({where: {email: createUserDto.email}});
    if(userData){
      throw new BadRequestException("Email already Exists");
    }
    const password = await hashPassword(createUserDto.password);
    createUserDto.password = password;
    const data = await this.userRepository.save(createUserDto);
    delete data.password;
    return data;
    
  }

  async findAll() {
    const data = await this.userRepository.find();
    data.map(e=>delete e.password)
    return data; 
  }

  async findOne(id: number) {
    const data = await this.userRepository.findOne({where:{id: id}});
    if(data){
      delete data.password;
      return data;
    }else{
      return null;
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined>{
    return await this.userRepository.findOne({where:{email : email}})
  }


  async update(id: number,isAdmin: boolean ,updateUserDto: UpdateUserDto) {
    const userData = await this.userRepository.findOne({where: {id: id}});
    userData.email = updateUserDto.email;
    if(isAdmin){
      userData.isAdmin = updateUserDto.isAdmin;
    }else{
      throw new ForbiddenException(`Only admin can update isadmin field`)
    }
    userData.password = updateUserDto.password;
    const data = await this.userRepository.save(userData);
    delete data.password;
    return {
      message: 'User Updated',
      data: data,
    }
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
