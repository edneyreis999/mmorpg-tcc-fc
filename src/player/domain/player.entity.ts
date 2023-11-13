import { Entity } from "../../shared/domain/entity";
import { EntityValidationError } from "../../shared/domain/validators/validation.error";
import { ValueObject } from "../../shared/domain/value-object";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { PlayerFakeBuilder } from "./player-fake.builder";
import { PlayerValidatorFactory } from "./player.validator";

export type PlayerConstructorProps = {
    playerId?: Uuid;
    displayName?: string;
    isActive?: boolean;
    createdAt?: Date;
}

export type PlayerCreateCommand = {
    displayName?: string;
    isActive?: boolean;
};

export class Player extends Entity {
    private _playerId: Uuid;
    private _displayName: string;
    private _isActive: boolean;
    private _createdAt: Date;


    constructor(props?: PlayerConstructorProps) {
        super();
        this._playerId = props?.playerId ?? new Uuid();
        this._displayName = props?.displayName ?? this.playerId.id.slice(0, 8);
        this._isActive = props?.isActive ?? true;
        this._createdAt = props?.createdAt ?? new Date();
    }

    get entityId(): ValueObject {
        return this.playerId;
    }

    static create(props?: PlayerCreateCommand): Player {
        const player = new Player(props);
        Player.validate(player);
        return player;
    }

    static validate(entity: Player) {
        const validator = PlayerValidatorFactory.create();
        const isValid = validator.validate(entity);
        if (!isValid) {
            throw new EntityValidationError(validator.errors!);
        }
    }


    changeDisplayName(displayName: string): void {
        this._displayName = displayName;
        Player.validate(this);
    }

    activate() {
        this._isActive = true;
    }

    deactivate() {
        this._isActive = false;
    }

    public get playerId(): Uuid {
        return this._playerId;
    }

    public get displayName(): string {
        return this._displayName;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    static fake() {
        return PlayerFakeBuilder;
    }

    toJSON() {
        return {
            playerId: this.playerId.id,
            displayName: this.displayName,
            isActive: this.isActive,
            createdAt: this.createdAt
        }
    }
}