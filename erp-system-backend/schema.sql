-- Tabela ról
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(50) UNIQUE NOT NULL,
    opis TEXT
);

-- Tabela użytkowników
CREATE TABLE uzytkownicy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nazwa_uzytkownika VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hash_hasla VARCHAR(255) NOT NULL,
    rola_id INT,
    imie VARCHAR(50) NOT NULL,
    nazwisko VARCHAR(50) NOT NULL,
    telefon VARCHAR(20),
    ulica VARCHAR(100),
    numer_domu VARCHAR(20),
    miasto VARCHAR(50),
    kod_pocztowy VARCHAR(20),
    kraj VARCHAR(50),
    data_rozpoczecia_pracy DATE,
    data_zakonczenia_pracy DATE,
    numer_vat VARCHAR(50),
    kategorie_prawa_jazdy VARCHAR(50),
    data_utworzenia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    utworzony_przez INT,
    FOREIGN KEY (rola_id) REFERENCES role(id),
    FOREIGN KEY (utworzony_przez) REFERENCES uzytkownicy(id)
);

-- Tabela modułów
CREATE TABLE moduly (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nazwa VARCHAR(50) UNIQUE NOT NULL,
    opis TEXT,
    czy_aktywny BOOLEAN DEFAULT TRUE
);

-- Tabela użytkowników_modułów
CREATE TABLE uzytkownicy_moduly (
    uzytkownik_id INT,
    modul_id INT,
    PRIMARY KEY (uzytkownik_id, modul_id),
    FOREIGN KEY (uzytkownik_id) REFERENCES uzytkownicy(id),
    FOREIGN KEY (modul_id) REFERENCES moduly(id)
);

-- Wstawienie ról
INSERT INTO role (nazwa, opis) VALUES
('superadmin', 'Pełny dostęp do wszystkich funkcji systemu'),
('właściciel', 'Zarządzanie firmą i dostęp do kluczowych funkcji'),
('handlowiec', 'Zarządzanie klientami i zamówieniami'),
('pracownik', 'Podstawowy dostęp do systemu');

-- Wstawienie modułów
INSERT INTO moduly (nazwa, opis) VALUES
('Administracja', 'Zarządzanie użytkownikami i ustawieniami systemu'),
('Kalendarz', 'Planowanie i zarządzanie wydarzeniami'),
('Zamówienia', 'Zarządzanie zamówieniami produktów'),
('Montaże', 'Śledzenie i zarządzanie projektami montażowymi'),
('Klienci', 'Zarządzanie informacjami o klientach'),
('Zadania', 'System zarządzania zadaniami'),
('Lokalizacje pojazdów', 'Śledzenie lokalizacji pojazdów'),
('System wejść/wyjść', 'Rejestracja czasu pracy pracowników'),
('System VOIP', 'Zarządzanie systemem telefonii internetowej'),
('Magazyn', 'Zarządzanie zapasami i magazynem');