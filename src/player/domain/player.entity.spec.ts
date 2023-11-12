import { faker } from '@faker-js/faker';
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Player } from "./player.entity";

describe("Player Unit Tests", () => {
    let validateSpy: any;
    beforeEach(() => {
        validateSpy = jest.spyOn(Player, "validate");
    });
    describe("constructor", () => {
        test("should create a player with default values", () => {
            const player = new Player();
            expect(player.playerId).toBeInstanceOf(Uuid);
            expect(player.displayName).toBe(player.playerId.id.slice(0, 8));
            expect(player.isActive).toBeTruthy();
            expect(player.createdAt).toBeInstanceOf(Date);
        });

        test("should create a player with all values", () => {
            const nickName = faker.person.firstName();
            const created_at = new Date();
            const player = new Player({
                playerId: new Uuid(),
                displayName: nickName,
                isActive: false,
                createdAt: created_at,
            });
            expect(player.playerId).toBeInstanceOf(Uuid);
            expect(player.displayName).toBe(nickName);
            expect(player.isActive).toBeFalsy();
            expect(player.createdAt).toBeInstanceOf(Date);
        });
        test("should create a player with display name", () => {
            const nickName = faker.person.firstName();
            const player = new Player({
                displayName: nickName,
            });

            expect(player.playerId).toBeInstanceOf(Uuid);
            expect(player.displayName).toBe(nickName);
            expect(player.isActive).toBeTruthy();
            expect(player.createdAt).toBeInstanceOf(Date);
        });
    });

    describe("create command", () => {
        test("should create a player", () => {
            const player = Player.create();
            expect(player.playerId).toBeInstanceOf(Uuid);
            expect(player.displayName).toBe(player.playerId.id.slice(0, 8));
            expect(player.isActive).toBe(true);
            expect(player.createdAt).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("should create a player with display name", () => {
            const nickName = faker.person.firstName();
            const player = Player.create({
                displayName: nickName,
            });
            expect(player.playerId).toBeInstanceOf(Uuid);
            expect(player.displayName).toBe(nickName);
            expect(player.isActive).toBe(true);
            expect(player.createdAt).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("should create a player with isActive", () => {
            const nickName = faker.person.firstName();
            const player = Player.create({
                displayName: nickName,
                isActive: false,
            });
            expect(player.playerId).toBeInstanceOf(Uuid);
            expect(player.displayName).toBe(nickName);
            expect(player.isActive).toBe(false);
            expect(player.createdAt).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("playerId field", () => {
        const arrange = [
            { playerId: null },
            { playerId: undefined },
            { playerId: new Uuid() },
        ];
        test.each(arrange)("id = %j", ({ playerId: playerId }) => {
            const player = new Player({
                displayName: "Movie",
                playerId: playerId as any,
            });
            expect(player.playerId).toBeInstanceOf(Uuid);
            if (playerId instanceof Uuid) {
                expect(player.playerId).toBe(playerId);
            }
        });
    });

    test("should change name", () => {
        const nickName = faker.person.firstName();
        const player = Player.create({
            displayName: "some wrong name",
        });
        player.changeDisplayName(nickName);
        expect(player.displayName).toBe(nickName);
        expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test("should active a player", () => {
        const player = Player.create({
            isActive: false,
        });
        player.activate();
        expect(player.isActive).toBe(true);
    });

    test("should disable a player", () => {
        const player = Player.create({
            isActive: true,
        });
        player.deactivate();
        expect(player.isActive).toBe(false);
    });

    it("should change display name", () => {
        const nickName = faker.person.firstName();
        const player = Player.create({
            displayName: "some wrong name",
        });
        player.changeDisplayName(nickName);
        expect(player.displayName).toBe(nickName);
        expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    it("should get player by entity_id", () => {
        const player = Player.create();
        expect(player.entityId).toBe(player.playerId);
    });

    it("should get transform player to json", () => {
        const player = Player.create();
        expect(player.toJSON()).toEqual({
            playerId: player.playerId.id,
            displayName: player.playerId.id.slice(0, 8),
            isActive: true,
            createdAt: player.createdAt,
        });
    });

    it("should inactive and active a player", () => {
        const player = Player.create({
            displayName: "Some nick",
            isActive: false,
        });
        player.activate();
        expect(player.isActive).toBe(true);
        player.deactivate();
        expect(player.isActive).toBe(false);
    });
});

describe("Player Validator", () => {
    describe("create command", () => {
        test("should an invalid player with name property", () => {
            expect(() => Player.create({ displayName: null as any })).containsErrorMessages({
                displayName: [
                    "displayName should not be empty",
                    "displayName must be a string",
                    "displayName must be shorter than or equal to 15 characters",
                ],
            });

            expect(() => Player.create({ displayName: "" })).containsErrorMessages({
                displayName: ["displayName should not be empty"],
            });

            expect(() => Player.create({ displayName: 5 as any })).containsErrorMessages({
                displayName: [
                    "displayName must be a string",
                    "displayName must be shorter than or equal to 15 characters",
                ],
            });

            expect(() =>
                Player.create({ displayName: "t".repeat(16) })
            ).containsErrorMessages({
                displayName: ["displayName must be shorter than or equal to 15 characters"],
            });
        });

        it("should a invalid player using description property", () => {
            expect(() =>
                Player.create({ description: 5 } as any)
            ).containsErrorMessages({
                description: ["description must be a string"],
            });
        });

        it("should a invalid player using is_active property", () => {
            expect(() =>
                Player.create({ is_active: 5 } as any)
            ).containsErrorMessages({
                is_active: ["is_active must be a boolean value"],
            });
        });
    });

    describe("changeDisplayName method", () => {
        it("should a invalid player using name property", () => {
            const player = Player.create({ displayName: "some wrong name" });
            expect(() => player.changeDisplayName(null as any)).containsErrorMessages({
                displayName: [
                    "displayName should not be empty",
                    "displayName must be a string",
                    "displayName must be shorter than or equal to 15 characters",
                ],
            });

            expect(() => player.changeDisplayName("")).containsErrorMessages({
                displayName: ["displayName should not be empty"],
            });

            expect(() => player.changeDisplayName(5 as any)).containsErrorMessages({
                displayName: [
                    "displayName must be a string",
                    "displayName must be shorter than or equal to 15 characters",
                ],
            });

            expect(() => player.changeDisplayName("t".repeat(16))).containsErrorMessages({
                displayName: ["displayName must be shorter than or equal to 15 characters"],
            });
        });
    });
});
