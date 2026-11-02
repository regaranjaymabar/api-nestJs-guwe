import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCustomerAddressDto{

    @IsUUID('4', { message: 'Customer ID harus berupa UUID valid!' })
    @IsNotEmpty({message:'customer id tidak boleh kosong'})
    readonly customer_id:string;

    @IsNotEmpty({message:'recipient name harus diisi'})
    @IsString({message:'recipient name harus berupa text'})
    readonly recipientName:string;

    @IsNotEmpty({message:'phone harus diisi'})
    @IsString({message:'phone harus berupa text'})
    readonly phone:string;

    @IsNotEmpty({message:'address harus diisi'})
    @IsString({message:'address harus berupa text'})
    readonly address:string;

    @IsNotEmpty({message:'city harus diisi'})
    @IsString({message:'city harus berupa text'})
    readonly city:string;

    @IsNotEmpty({message:'postal code harus diisi'})
    @IsString({message:'postal code harus berupa text'})
    readonly postalCode:string


}
