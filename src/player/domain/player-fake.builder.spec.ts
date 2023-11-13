import { Chance } from 'chance';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { PlayerFakeBuilder } from './player-fake.builder';

describe('PlayerFakerBuilder Unit Tests', () => {
  describe('playerId prop', () => {
    const faker = PlayerFakeBuilder.aPlayer();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.playerId).toThrow(
        new Error(
          "Property playerId not have a factory, use 'with' methods",
        ),
      );
    });

    test('should be undefined', () => {
      expect(faker['_playerId']).toBeUndefined();
    });

    test('withUuid', () => {
      const playerId = new Uuid();
      const $this = faker.withUuid(playerId);
      expect($this).toBeInstanceOf(PlayerFakeBuilder);
      expect(faker['_playerId']).toBe(playerId);

      faker.withUuid(() => playerId);
      //@ts-expect-error _playerId is a callable
      expect(faker['_playerId']()).toBe(playerId);

      expect(faker.playerId).toBe(playerId);
    });

    //TODO - melhorar este nome
    test('should pass index to playerId factory', () => {
      let mockFactory = jest.fn(() => new Uuid());
      faker.withUuid(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const playerId = new Uuid();
      mockFactory = jest.fn(() => playerId);
      const fakerMany = PlayerFakeBuilder.thePlayers(2);
      fakerMany.withUuid(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].playerId).toBe(playerId);
      expect(fakerMany.build()[1].playerId).toBe(playerId);
    });
  });

  describe('displayName prop', () => {
    const faker = PlayerFakeBuilder.aPlayer();
    test('should be a function', () => {
      expect(typeof faker['_displayName']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'string');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withDisplayName', () => {
      const $this = faker.withDisplayName('test displayName');
      expect($this).toBeInstanceOf(PlayerFakeBuilder);
      expect(faker['_displayName']).toBe('test displayName');

      faker.withDisplayName(() => 'test displayName');
      //@ts-expect-error displayName is callable
      expect(faker['_displayName']()).toBe('test displayName');

      expect(faker.displayName).toBe('test displayName');
    });

    test('should pass index to displayName factory', () => {
      faker.withDisplayName((index) => `test displayName ${index}`);
      const player = faker.build();
      expect(player.displayName).toBe(`test displayName 0`);

      const fakerMany = PlayerFakeBuilder.thePlayers(2);
      fakerMany.withDisplayName((index) => `test displayName ${index}`);
      const players = fakerMany.build();

      expect(players[0].displayName).toBe(`test displayName 0`);
      expect(players[1].displayName).toBe(`test displayName 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidDisplayNameTooLong();
      expect($this).toBeInstanceOf(PlayerFakeBuilder);
      expect(faker['_displayName'].length).toBe(16);

      const tooLong = 'a'.repeat(16);
      faker.withInvalidDisplayNameTooLong(tooLong);
      expect(faker['_displayName'].length).toBe(16);
      expect(faker['_displayName']).toBe(tooLong);
    });
  });

  describe('isActive prop', () => {
    const faker = PlayerFakeBuilder.aPlayer();
    test('should be a function', () => {
      expect(typeof faker['_isActive']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(PlayerFakeBuilder);
      expect(faker['_isActive']).toBe(true);
      expect(faker.isActive).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(PlayerFakeBuilder);
      expect(faker['_isActive']).toBe(false);
      expect(faker.isActive).toBe(false);
    });
  });

  describe('createdAt prop', () => {
    const faker = PlayerFakeBuilder.aPlayer();

    test('should throw error when any with methods has called', () => {
      const fakerPlayer = PlayerFakeBuilder.aPlayer();
      expect(() => fakerPlayer.createdAt).toThrow(
        new Error("Property createdAt not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_createdAt']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(PlayerFakeBuilder);
      expect(faker['_createdAt']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _createdAt is a callable
      expect(faker['_createdAt']()).toBe(date);
      expect(faker.createdAt).toBe(date);
    });

    test('should pass index to createdAt factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const player = faker.build();
      expect(player.createdAt.getTime()).toBe(date.getTime() + 2);

      const fakerMany = PlayerFakeBuilder.thePlayers(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const players = fakerMany.build();

      expect(players[0].createdAt.getTime()).toBe(date.getTime() + 2);
      expect(players[1].createdAt.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a player', () => {
    const faker = PlayerFakeBuilder.aPlayer();
    let player = faker.build();

    expect(player.playerId).toBeInstanceOf(Uuid);
    expect(typeof player.displayName === 'string').toBeTruthy();
    expect(player.isActive).toBe(true);
    expect(player.createdAt).toBeInstanceOf(Date);

    const createdAt = new Date();
    const playerId = new Uuid();
    player = faker
      .withUuid(playerId)
      .withDisplayName('displayName test')
      .deactivate()
      .withCreatedAt(createdAt)
      .build();

    expect(player.playerId.id).toBe(playerId.id);
    expect(player.displayName).toBe('displayName test');
    expect(player.isActive).toBe(false);
    expect(player.createdAt).toBe(createdAt);
  });

  test('should create many players', () => {
    const faker = PlayerFakeBuilder.thePlayers(2);
    const players = faker.build();

    players.forEach((player) => {
      expect(player.playerId).toBeInstanceOf(Uuid);
      expect(typeof player.displayName === 'string').toBeTruthy();
      expect(player.isActive).toBe(true);
      expect(player.createdAt).toBeInstanceOf(Date);
    });
  });
});
