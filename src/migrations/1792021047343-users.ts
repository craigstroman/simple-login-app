import { MigrationInterface, QueryRunner } from 'typeorm';

export class users1792021047343 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
                CREATE TABLE IF NOT EXISTS public."user"
                (
                    id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
                    createdAt timestamp without time zone NOT NULL DEFAULT now(),
                    updatedAt timestamp without time zone NOT NULL DEFAULT now(),
                    first_name character varying COLLATE pg_catalog."default" NOT NULL,
                    last_name character varying COLLATE pg_catalog."default" NOT NULL,
                    email character varying COLLATE pg_catalog."default" NOT NULL,
                    username character varying COLLATE pg_catalog."default" NOT NULL,
                    password character varying COLLATE pg_catalog."default" NOT NULL,
                    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
                    CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username),
                    CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
                ); 
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
