import { Pet } from "../domain/pet";
import { Filters } from "../presentation/componets/FilterModal";

export class FilterPetsUseCase {
  execute(pets: Pet[], search: string, filters: Filters): Pet[] {
    const term = search.toLowerCase();

    return pets.filter((p) => {
      if (search) {
        if (
          !p.name?.toLowerCase().includes(term) &&
          !String(p.type ?? "").toLowerCase().includes(term) &&
          !String(p.sex ?? "").toLowerCase().includes(term) &&
          !String(p.size ?? "").toLowerCase().includes(term) &&
          !String(p.age ?? "").toLowerCase().includes(term)
        )
          return false;
      }

      if (filters.type.length > 0 &&
          !filters.type.map(t => t.toLowerCase()).includes(String(p.type).toLowerCase())) {
        return false;
      }

      if (filters.sex.length > 0 &&
          !filters.sex.map(s => s.toLowerCase()).includes(String(p.sex).toLowerCase())) {
        return false;
      }

      if (filters.size.length > 0 &&
          !filters.size.map(s => s.toLowerCase()).includes(String(p.size).toLowerCase())) {
        return false;
      }

      if (filters.adopted) {
        if (p.adopted !== true) return false;
      } else {
        if (p.adopted === true) return false;
      }

      return true;
    });
  }
}