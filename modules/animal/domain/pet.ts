export type PetType = "perro" | "gato";

export enum PetSize {
    "pequeño" = "pequeño",
    "mediano" = "mediano",
    "grande" = "grande",
}

export type PetSex = "macho" | "hembra";

export interface Pet {
    id: number; 
    type: PetType;
    name: string;
    sex: PetSex;
    age: string;
    size: PetSize;
    breed: string;
    description: string;
    health_info: string;
    image_url: string;
    adopted: boolean;
    user: string; //usuario con cuenta puede hacer registro 
    phone: string;
    location: string;
}

export type CreatePet = Omit<Pet,"id" | "adopted">;

export type UpdatePet = Omit<Pet, "user_id">;
