import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddUserRepository } from '~/data/interfaces/db/user/add-user-repository.interface';
import { User } from '~/infra/db/mongodb/models/user.model';
import { AddUserModel } from '~/domain/usecases/user/add-user.interface';
import { ConfirmEmailUserRepository } from '~/data/interfaces/db/user/confirm-email-user-repository.interface';
import { ConfirmEmailUserModel } from '~/domain/usecases/user/confirm-email.interface';

export class UserMongoRepository implements AddUserRepository,
  ConfirmEmailUserRepository {
  constructor(@InjectModel('User') private userModel: ReturnModelType<typeof User>) {}

  async add(userData: AddUserModel): Promise<DocumentType<User>> {
    return this.userModel.create(userData);
  }

  async confirmEmailByToken({ confirmToken }: ConfirmEmailUserModel): Promise<boolean> {
    const result = await this.userModel.findOneAndUpdate({
      confirmToken,
    }, {
      $set: {
        verifiedEmail: true,
      },
    }, {
      new: true,
    });
    return !!result?.verifiedEmail;
  }
}
