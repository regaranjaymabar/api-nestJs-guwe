import {IsInt, IsNotEmpty} from 'class-validator';

export class CreateBookDto {
    @IsNotEmpty({message: 'nama perlu diisi'})
    readonly name: string;

    @IsNotEmpty({message: 'author perlu diisi'})
    readonly author: string;

    @IsNotEmpty({message: 'isbn perlu diisi'})
    readonly isbn: string;

    @IsInt({message: 'tahun terbit harus berupa angka'})
    @IsNotEmpty({message: 'tahun terbit perlu diisi'})
    readonly publishedYear: number;
}