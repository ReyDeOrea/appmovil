export interface Pet {
    id: number; 
    type: "perro" | "gato";
    name: string;
    sex: "macho" | "hembra";
    age: string;
    size: "pequeño" | "mediano" | "grande";
    breed: string;
    description: string;
    health_info: string;
    image_url: string;
    adopted: boolean;
    user_id: string; //usuario con cuenta puede hacer registro 
    phone: string;
    location: string;
}
