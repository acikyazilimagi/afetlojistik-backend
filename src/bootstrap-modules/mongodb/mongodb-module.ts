import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
  ],
})
export class MongoDbModule {}
