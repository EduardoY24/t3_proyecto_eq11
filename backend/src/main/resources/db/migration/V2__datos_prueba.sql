INSERT INTO roles (id, nombre) VALUES
(1, 'ADMIN'),
(2, 'COACH'),
(3, 'USUARIO');

INSERT INTO usuarios (id, nombre, email, password, telefono, rol_id, coach_id) VALUES
(1, 'Administrador', 'admin@habitos.com', '$2a$10$ek7hegg/Q2JbA/bvLyUXgeeoDGWOsjdFw9XvwwrjZ6iqqcXTb5j/O', '+520000000001', 1, NULL),
(2, 'Laura Coach', 'coach1@habitos.com', '$2a$10$YzAre/gZKU4GPCUhrIw9UO0gTx9zqEDvgWSiEQZBSj6.D3hOHe61C', '+520000000002', 2, NULL),
(3, 'Marco Coach', 'coach2@habitos.com', '$2a$10$YzAre/gZKU4GPCUhrIw9UO0gTx9zqEDvgWSiEQZBSj6.D3hOHe61C', '+520000000003', 2, NULL),
(4, 'Ana López', 'ana@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000004', 3, 2),
(5, 'Luis Pérez', 'luis@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000005', 3, 2),
(6, 'María Gómez', 'maria@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000006', 3, 2),
(7, 'Carlos Ruiz', 'carlos@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000007', 3, 2),
(8, 'Sofía Díaz', 'sofia@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000008', 3, 3),
(9, 'Jorge Torres', 'jorge@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000009', 3, 3),
(10, 'Valeria Cruz', 'valeria@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000010', 3, 3),
(11, 'Diego Morales', 'diego@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000011', 3, 3),
(12, 'Fernanda Ríos', 'fernanda@habitos.com', '$2a$10$hlB/oNY/xP.grSvke.t/7eiasJ2oRvPae4FmfQbRyCR.k/iOeFKni', '+520000000012', 3, NULL);

INSERT INTO categorias (id, nombre, color) VALUES
(1, 'Salud', '#2E9E6B'),
(2, 'Ejercicio', '#E4572E'),
(3, 'Estudio', '#3B6FD8'),
(4, 'Mañana', '#F2B134'),
(5, 'Noche', '#5B4B8A'),
(6, 'Lectura', '#8C5E3C'),
(7, 'Mindfulness', '#4FB0C6'),
(8, 'Alimentación', '#7CB342'),
(9, 'Finanzas', '#2F4858'),
(10, 'Productividad', '#D81B60');

INSERT INTO habitos (id, nombre, descripcion, frecuencia, usuario_id) VALUES
(1, 'Beber 2 litros de agua', 'Tomar agua durante el día', 'DIARIO', 4),
(2, 'Correr 30 minutos', 'Correr en el parque', 'DIARIO', 4),
(3, 'Leer 20 páginas', 'Leer antes de dormir', 'DIARIO', 5),
(4, 'Meditar 10 minutos', 'Meditación guiada', 'DIARIO', 5),
(5, 'Estudiar inglés', 'Practicar con una app', 'DIARIO', 6),
(6, 'Ir al gimnasio', 'Rutina de pesas', 'SEMANAL', 6),
(7, 'Dormir 8 horas', 'Acostarse antes de las 11', 'DIARIO', 7),
(8, 'Registrar gastos', 'Anotar lo que gasto', 'DIARIO', 7),
(9, 'Comer fruta', 'Una fruta en el desayuno', 'DIARIO', 8),
(10, 'Caminar 10 mil pasos', 'Caminar durante el día', 'DIARIO', 8),
(11, 'Escribir un diario', 'Escribir lo que pasó en el día', 'DIARIO', 9),
(12, 'Repasar apuntes', 'Repasar la clase del día', 'SEMANAL', 10),
(13, 'Planear el día', 'Hacer lista de pendientes', 'DIARIO', 10),
(14, 'Estiramientos', 'Estirar al despertar', 'DIARIO', 11),
(15, 'Ahorrar 50 pesos', 'Guardar dinero cada semana', 'SEMANAL', 12);

INSERT INTO habito_categoria (habito_id, categoria_id) VALUES
(1, 1), (1, 8),
(2, 1), (2, 2), (2, 4),
(3, 6), (3, 5),
(4, 7), (4, 4),
(5, 3),
(6, 2), (6, 1),
(7, 1), (7, 5),
(8, 9),
(9, 8), (9, 4),
(10, 2), (10, 1),
(11, 7), (11, 5),
(12, 3), (12, 10),
(13, 10), (13, 4),
(14, 2), (14, 4),
(15, 9);

INSERT INTO registros (fecha, cumplido, nota, habito_id) VALUES
('2026-11-17', TRUE, NULL, 1), ('2026-11-18', TRUE, NULL, 1), ('2026-11-19', FALSE, 'Se me olvidó', 1),
('2026-11-17', TRUE, '5 km', 2), ('2026-11-18', TRUE, NULL, 2),
('2026-11-17', TRUE, NULL, 3), ('2026-11-18', FALSE, NULL, 3),
('2026-11-17', TRUE, NULL, 4), ('2026-11-18', TRUE, NULL, 4), ('2026-11-19', TRUE, NULL, 4),
('2026-11-17', TRUE, NULL, 5), ('2026-11-18', TRUE, NULL, 5),
('2026-11-18', TRUE, 'Pierna', 6),
('2026-11-17', FALSE, NULL, 7), ('2026-11-18', TRUE, NULL, 7),
('2026-11-17', TRUE, NULL, 8),
('2026-11-17', TRUE, NULL, 9), ('2026-11-18', TRUE, NULL, 9),
('2026-11-17', TRUE, NULL, 10),
('2026-11-17', TRUE, NULL, 11), ('2026-11-18', TRUE, NULL, 11),
('2026-11-18', TRUE, NULL, 12),
('2026-11-17', TRUE, NULL, 13), ('2026-11-18', FALSE, NULL, 13),
('2026-11-17', TRUE, NULL, 14),
('2026-11-18', TRUE, NULL, 15);

INSERT INTO recordatorios (hora, dias, canal, habito_id) VALUES
('09:00:00', 'LUN,MAR,MIE,JUE,VIE', 'EMAIL', 1),
('07:00:00', 'LUN,MIE,VIE', 'WHATSAPP', 2),
('22:00:00', 'TODOS', 'SMS', 3),
('08:00:00', 'TODOS', 'EMAIL', 4),
('18:00:00', 'LUN,MAR,MIE,JUE,VIE', 'WHATSAPP', 5),
('19:00:00', 'SAB', 'SMS', 6),
('22:30:00', 'TODOS', 'EMAIL', 7),
('21:00:00', 'TODOS', 'WHATSAPP', 8),
('08:30:00', 'TODOS', 'SMS', 9),
('12:00:00', 'TODOS', 'EMAIL', 10),
('21:30:00', 'TODOS', 'EMAIL', 11),
('07:30:00', 'LUN,MAR,MIE,JUE,VIE', 'WHATSAPP', 13);
