import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";
import { User } from "src/database/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import { Address } from "src/database/entities/address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Address, User]), UsersModule],
    controllers: [AddressesController],
    providers: [AddressesService],
    exports: [AddressesService],
})
export class AddressesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('addresses');
    }
}