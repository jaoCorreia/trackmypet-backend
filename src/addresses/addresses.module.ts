import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthMiddleware } from "src/common/middleware/jwt-auth.middleware";
import { AddressController } from "./addresses.controller";
import { AddressService } from "./addresses.service";
import { User } from "src/database/entities/user.entity";
import { UsersModule } from "src/users/users.module";
import { Address } from "src/database/entities/address.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Address, User]), UsersModule],
    controllers: [AddressController],
    providers: [AddressService],
    exports: [AddressService],
})
export class AddressesModule {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(JwtAuthMiddleware)
            .forRoutes('addresses');
    }
}