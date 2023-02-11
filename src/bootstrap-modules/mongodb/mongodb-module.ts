import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://suatpolat:admin@cluster0.xrxjzav.mongodb.net/transportation?retryWrites=true&w=majority'
    ),
  ],
})
export class MongoDbModule {}
