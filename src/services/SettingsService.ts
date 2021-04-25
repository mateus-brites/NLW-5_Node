import { getCustomRepository, Repository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import { Setting } from "../entities/Settings";

interface ISettingsCreate {
    chat: boolean;
    username: string;
}

class SettingsService {
    private settingsRepository: Repository<Setting>

    constructor(){
        this.settingsRepository = getCustomRepository(SettingsRepository);
    }

    async create({ chat, username }: ISettingsCreate){

        const userAlreadyExist = await this.settingsRepository.findOne({
            username
        });

        if(userAlreadyExist){
            throw new Error("This user already exist");
        }

        const settings = this.settingsRepository.create({
            chat,
            username,
        });

        await this.settingsRepository.save(settings);

        return settings

    }

    async findByUsername(username: string){
        const settings = this.settingsRepository.findOne({username});

        return settings;
    }

    async update(username: string, chat: boolean) {
        const settings = await this.settingsRepository
            .createQueryBuilder()
            .update(Setting)
            .set({ chat })
            .where("username = :username", {
                username,
            })
            .execute();
    }

}

export { SettingsService }