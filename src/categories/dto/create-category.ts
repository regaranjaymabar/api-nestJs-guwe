import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriesDto{
    @IsString({message: 'nama kategori harus berupa teks'})
    @IsNotEmpty({message: 'nama kategori perlu diisi'})
    readonly name: string;
}