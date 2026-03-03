export type PetType = "perro" | "gato";

export enum PetSize {
    "pequeño" = "Pequeño",
    "mediano" = "Mediano",
    "grande" = "Grande",
}

export interface Pet {
    id: number; 
    type: PetType;
    name: string;
    sex: "macho" | "hembra";
    age: string;
    size: PetSize;
    breed: string;
    description: string;
    health_info: string;
    image_url: string;
    adopted: boolean;
    user_id: string; //usuario con cuenta puede hacer registro 
    phone: string;
    location: string;
}
