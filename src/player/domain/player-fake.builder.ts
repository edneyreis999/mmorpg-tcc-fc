import { Chance } from "chance";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Player } from "./player.entity";

type PropOrFactory<T> = T | ((index: number) => T);

export class PlayerFakeBuilder<TBuild = any> {
  // auto generated in entity
  private _playerId: PropOrFactory<Uuid> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _displayName: PropOrFactory<string> = (_index) => this.chance.string({ length: 10 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _isActive: PropOrFactory<boolean> = (_index) => true;
  // auto generated in entity
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aPlayer() {
    return new PlayerFakeBuilder<Player>();
  }

  static thePlayers(countObjs: number) {
    return new PlayerFakeBuilder<Player[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withUuid(valueOrFactory: PropOrFactory<Uuid>) {
    this._playerId = valueOrFactory;
    return this;
  }

  withDisplayName(valueOrFactory: PropOrFactory<string>) {
    this._displayName = valueOrFactory;
    return this;
  }

  activate() {
    this._isActive = true;
    return this;
  }

  deactivate() {
    this._isActive = false;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  withInvalidDisplayNameTooLong(value?: string) {
    this._displayName = value ?? this.chance.word({ length: 16 });
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.countObjs)
      .fill(undefined)
      .map((_, index) => {
        const player = new Player({
          playerId: !this._playerId
            ? undefined
            : this.callFactory(this._playerId, index),
          displayName: this.callFactory(this._displayName, index),
          isActive: this.callFactory(this._isActive, index),
          ...(this._createdAt && {
            createdAt: this.callFactory(this._createdAt, index),
          }),
        });
        // player.validate();
        return player;
      });
    return this.countObjs === 1 ? (categories[0] as any) : categories;
  }

  get playerId() {
    return this.getValue("playerId");
  }

  get displayName() {
    return this.getValue("displayName");
  }

  get isActive() {
    return this.getValue("isActive");
  }

  get createdAt() {
    return this.getValue("createdAt");
  }

  private getValue(prop: any) {
    const optional = ["playerId", "createdAt"];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
