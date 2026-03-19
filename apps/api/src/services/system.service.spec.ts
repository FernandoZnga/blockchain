import { SystemService } from "./system.service";

describe("SystemService", () => {
  it("returns healthy shape", async () => {
    const service = new SystemService(
      { $queryRaw: jest.fn().mockResolvedValue([1]) } as never,
      { health: jest.fn().mockResolvedValue({ online: true, blockNumber: 1 }) } as never,
    );

    await expect(service.health()).resolves.toMatchObject({
      status: "ok",
      database: "up",
      blockchain: { online: true, blockNumber: 1 },
    });
  });
});
