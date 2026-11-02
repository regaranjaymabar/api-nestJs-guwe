import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsNotEmpty({message: 'name harus diisi!'})
    @IsString()
    readonly name:string;
    
    @IsNotEmpty({message: 'email harus diisi!'})
    @IsEmail({},{message: 'format email tidak valid'})
    readonly email:string;
    
    @IsNotEmpty({message: 'phone harus diisi!'})
    @IsString()
    readonly phone:string;

}
