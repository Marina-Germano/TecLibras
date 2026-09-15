CREATE DATABASE glossario_libras_ti
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE glossario_libras_ti;

CREATE TABLE usuario(
id_usuario INT NOT NULL auto_increment primary KEY,
nome VARCHAR(100) not null,
email VARCHAR(100) unique NOT NULL,
senha VARCHAR(255) NULL, -- vai ser null se o usuario logar com o google
id_google VARCHAR(255) UNIQUE NULL,  -- id do goole
avatar_url varchar(255) null, -- foto de perfil do google
perfil ENUM('USUARIO', 'INTÉRPRETE', 'ADM') DEFAULT 'USUARIO',
token_recuperacao varchar(255) null, -- para o esqueci minha senha
data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE= InnoDB;

CREATE TABLE categoria(
id_categoria INT auto_increment primary key,
nome_categoria VARCHAR(100) NOT NULL UNIQUE,
icon_url varchar(255) null
) ENGINE = InnoDB;

CREATE TABLE sinal(
    id_sinal INT AUTO_INCREMENT PRIMARY KEY,
    termo_ti VARCHAR(100) NOT NULL,
    descricao_sinal TEXT,
    id_interprete INT,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Mídia: Vídeo (Obrigatório)
    video_url VARCHAR(255) NOT NULL,
    video_formato VARCHAR(10),
    video_tamanho BIGINT,

    -- Mídia: Imagem Principal (Obrigatória)
    imagem_url VARCHAR(255) NOT NULL,
    imagem_formato VARCHAR(10),
    imagem_tamanho BIGINT,

    -- Mídia: Imagem Secundária (Opcional)
    imagem_secundaria_url VARCHAR(255) DEFAULT NULL,
    imagem_secundaria_formato VARCHAR(10) DEFAULT NULL,
    imagem_secundaria_tamanho BIGINT DEFAULT NULL,

    CONSTRAINT fk_interprete FOREIGN KEY (id_interprete) REFERENCES usuario(id_usuario)
) ENGINE = InnoDB;

CREATE TABLE sinal_categoria(
id_sinal INT NOT NULL,
id_categoria INT NOT NULL,

PRIMARY KEY(id_sinal, id_categoria),

CONSTRAINT fk_sc_sinal FOREIGN KEY(id_sinal) REFERENCES sinal(id_sinal)
ON DELETE CASCADE,

CONSTRAINT fk_sc_categoria FOREIGN KEY(id_categoria) REFERENCES categoria(id_categoria)
ON DELETE CASCADE
)  ENGINE = InnoDB;

CREATE TABLE logs_atividades(
id_log INT auto_increment primary key,
id_usuario int,
acao varchar(100), -- subindo video, excluindo, editando...
id_registro int, -- id do sinal que foi alterado
data_hora timestamp default current_timestamp,
constraint fk_log_usuario foreign key (id_usuario) references usuario (id_usuario)
) ENGINE = InnoDB;

CREATE TABLE avaliacao(
id_avaliacao int auto_increment primary key,
id_usuario int not null,
id_sinal int not null,
nota tinyint not null check (nota between 1 and 5), -- avaliacao em estrelas
comentario text null,
data_avaliacao timestamp default current_timestamp on update current_timestamp,
unique key unique_user_signal (id_usuario, id_sinal),
constraint fk_aval_usuario foreign key (id_usuario) references usuario (id_usuario) on delete cascade,
constraint fk_aval_signal foreign key (id_sinal) references sinal (id_sinal) on delete cascade -- se apagar o sinal ou o usuario apaga também a avaliacao
)ENGINE = InnoDB;


INSERT INTO usuario (id_usuario, nome, email, senha) VALUES (1, 'Administrador', 'admin@admin.com', 'admin');