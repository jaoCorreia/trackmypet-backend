import { PetAge } from "src/database/entities/pet-age.enum";
import { PetSex } from "src/database/entities/pet-sex.enum";

export type UpdatePetDto={
  name?: string; 
  sex?: PetSex;
  photo?: string;
  age?: PetAge;
  bio?:string;
  userId?: number;
  breedId?: number;
}