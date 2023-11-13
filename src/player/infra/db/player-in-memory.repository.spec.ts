import { Player } from "../../domain/player.entity";
import { PlayerInMemoryRepository } from "./player-in-memory.repository";

describe("PlayerInMemoryRepository", () => {
  let repository: PlayerInMemoryRepository;

  beforeEach(() => (repository = new PlayerInMemoryRepository()));
  it("should no filter items when filter object is null", async () => {
    const items = [Player.fake().aPlayer().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      Player.fake().aPlayer().withDisplayName("test").build(),
      Player.fake().aPlayer().withDisplayName("TEST").build(),
      Player.fake().aPlayer().withDisplayName("fake").build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();

    const items = [
      Player.fake()
        .aPlayer()
        .withDisplayName("test")
        .withCreatedAt(created_at)
        .build(),
      Player.fake()
        .aPlayer()
        .withDisplayName("TEST")
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      Player.fake()
        .aPlayer()
        .withDisplayName("fake")
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
    ];

    const itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by displayName", async () => {
    const items = [
      Player.fake().aPlayer().withDisplayName("c").build(),
      Player.fake().aPlayer().withDisplayName("b").build(),
      Player.fake().aPlayer().withDisplayName("a").build(),
    ];

    let itemsSorted = await repository["applySort"](items, "displayName", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "displayName", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
