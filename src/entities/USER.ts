import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column(() => String)
  @CreateDateColumn()
  createdAt = new Date();

  @Column(() => String)
  @UpdateDateColumn()
  updatedAt = new Date();

  @Column(() => String)
  @Column()
  first_name!: string;

  @Column(() => String)
  @Column()
  last_name!: string;

  @Column(() => String)
  @Column({ unique: true })
  email!: string;

  @Column()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;
}
