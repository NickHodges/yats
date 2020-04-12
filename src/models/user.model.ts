import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class  User {
  @ObjectIdColumn()
  @Transform(value => value.toString(), { toPlainOnly: true })
  _id: ObjectID;

  @Column({ length: 256 })
  email: string;

  @Column({ length: 256 })
  password: string;

  errors: string[];

  @Exclude() @Column() createdAt: Date = new Date();
  @Exclude() @Column() createdBy: string = 'user';
  @Exclude() @Column() isDeleted: boolean = false;
}
