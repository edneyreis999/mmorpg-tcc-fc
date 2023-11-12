import {
    IsBoolean,
    IsNotEmpty,
    IsString,
    MaxLength
} from "class-validator";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Player } from "./player.entity";

//criar um testes que verifique os decorators
export class PlayerRules {
    @MaxLength(15)
    @IsString()
    @IsNotEmpty()
    displayName!: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive!: boolean;

    constructor({ displayName, isActive }: Player) {
        Object.assign(this, { displayName, isActive });
    }
}

export class PlayerValidator extends ClassValidatorFields<PlayerRules> {
    validate(entity: Player) {
        return super.validate(new PlayerRules(entity));
    }
}

export class PlayerValidatorFactory {
    static create() {
        return new PlayerValidator();
    }
}
