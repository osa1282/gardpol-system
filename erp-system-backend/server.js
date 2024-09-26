require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Funkcja do hashowania hasła za pomocą SHA256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Funkcja do testowania połączenia z bazą danych
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Połączenie z bazą danych udane!');
    connection.release();
  } catch (error) {
    console.error('Błąd połączenia z bazą danych:', error);
  }
}

// Middleware do weryfikacji tokenu JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint główny
app.get('/', (req, res) => {
  res.json({ message: 'Witaj w API systemu ERP' });
});

// Endpoint logowania
app.post('/api/logowanie', async (req, res) => {
  try {
    const { nazwa_uzytkownika, haslo } = req.body;
    console.log('Próba logowania dla użytkownika:', nazwa_uzytkownika);

    const [rows] = await pool.query('SELECT * FROM uzytkownicy WHERE nazwa_uzytkownika = ?', [nazwa_uzytkownika]);
    
    if (rows.length === 0) {
      console.log('Nie znaleziono użytkownika');
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }
    
    const user = rows[0];
    console.log('Znaleziony użytkownik:', user.nazwa_uzytkownika);
    
    const hashedPassword = hashPassword(haslo);
    console.log('Obliczony hash hasła:', hashedPassword);
    console.log('Hash hasła z bazy:', user.hash_hasla);
    
    const isPasswordValid = hashedPassword === user.hash_hasla;
    
    if (!isPasswordValid) {
      console.log('Nieprawidłowe hasło');
      return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }
    
    const token = jwt.sign({ userId: user.id, roleId: user.rola_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log('Logowanie udane');
    res.json({ token, user: { id: user.id, nazwa_uzytkownika: user.nazwa_uzytkownika, rola_id: user.rola_id } });
  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ error: 'Błąd podczas logowania' });
  }
});

// Endpoint rejestracji użytkownika (tylko dla administratorów)
app.post('/api/uzytkownicy', authenticateToken, async (req, res) => {
  try {
    if (req.user.roleId > 2) {
      return res.status(403).json({ error: 'Brak uprawnień' });
    }

    const { nazwa_uzytkownika, email, haslo, rola_id, imie, nazwisko } = req.body;
    const hashedPassword = hashPassword(haslo);
    
    const [result] = await pool.query(
      'INSERT INTO uzytkownicy (nazwa_uzytkownika, email, hash_hasla, rola_id, imie, nazwisko) VALUES (?, ?, ?, ?, ?, ?)',
      [nazwa_uzytkownika, email, hashedPassword, rola_id, imie, nazwisko]
    );
    
    console.log('Użytkownik utworzony:', result.insertId);
    res.status(201).json({ message: 'Użytkownik utworzony pomyślnie', userId: result.insertId });
  } catch (error) {
    console.error('Błąd tworzenia użytkownika:', error);
    res.status(500).json({ error: 'Błąd podczas tworzenia użytkownika' });
  }
});

// Endpoint pobierania listy użytkowników (tylko dla administratorów)
app.get('/api/uzytkownicy', authenticateToken, async (req, res) => {
  try {
    if (req.user.roleId > 2) {
      return res.status(403).json({ error: 'Brak uprawnień' });
    }

    const [rows] = await pool.query('SELECT id, nazwa_uzytkownika, email, rola_id, imie, nazwisko FROM uzytkownicy');
    console.log('Pobrano listę użytkowników');
    res.json(rows);
  } catch (error) {
    console.error('Błąd pobierania użytkowników:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania użytkowników' });
  }
});

// Endpoint pobierania danych użytkownika
app.get('/api/uzytkownik', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nazwa_uzytkownika, email, rola_id, imie, nazwisko FROM uzytkownicy WHERE id = ?', [req.user.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Błąd pobierania danych użytkownika:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania danych użytkownika' });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
  console.log('Próba połączenia z bazą danych...');
  testDatabaseConnection();
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} jest zajęty, próbuję port ${PORT + 1}`);
    server.close();
    app.listen(PORT + 1, () => console.log(`Serwer uruchomiony na porcie ${PORT + 1}`));
  } else {
    console.error(e);
  }
});

// Okresowe testowanie połączenia z bazą danych
setInterval(testDatabaseConnection, 60000); // Testuj co minutę