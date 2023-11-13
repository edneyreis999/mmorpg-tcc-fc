import { IRepository } from "../../shared/domain/repository/repository-interface";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Player } from "../domain/player.entity";

export interface IPlayerRepository extends IRepository<Player, Uuid> {}
