import { SortDirection } from "../../../shared/domain/repository/search-params";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../shared/infra/db/in-memory/in-memory.repository";
import { Player } from "../../domain/player.entity";

export class PlayerInMemoryRepository extends InMemorySearchableRepository<
  Player,
  Uuid
> {
  sortableFields: string[] = ["displayName", "createdAt"];

  getEntity(): new (...args: any[]) => Player {
    return Player;
  }

  protected async applyFilter(
    items: Player[],
    filter: string
  ): Promise<Player[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.displayName.toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected applySort(
    items: Player[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "createdAt", "desc");
  }
}
