import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class Todo {
  @ObjectIdColumn()
  @Transform(value => value.toString(), { toPlainOnly: true })
  _id: ObjectID;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 5000 })
  note: string;

  @Column()
  complete: boolean;

  @Column()
  editMode: boolean;

  @Exclude() @Column() createdAt: Date = new Date();
  @Exclude() @Column() createdBy: string = 'user';
  @Exclude() @Column() isDeleted: boolean = false;
}
