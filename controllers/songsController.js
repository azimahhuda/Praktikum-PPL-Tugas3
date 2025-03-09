const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/songs.json");

// Fungsi untuk membaca file JSON
const readData = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Fungsi untuk menulis file JSON
const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Ambil semua lagu
exports.getAllSongs = (req, res) => {
    const songs = readData();
    res.json(songs);
};

// Ambil satu lagu berdasarkan ID
exports.getSongById = (req, res) => {
    const songs = readData();
    const song = songs.find(s => s.id === parseInt(req.params.id));
    song ? res.json(song) : res.status(404).json({ message: "Lagu tidak ditemukan" });
};

// Tambah lagu baru
exports.addSong = (req, res) => {
    const songs = readData();
    const newSong = { id: songs.length + 1, ...req.body };
    songs.push(newSong);
    writeData(songs);
    res.status(201).json({ message: "Lagu berhasil ditambahkan", song: newSong });
};

// Update lagu berdasarkan ID
exports.updateSong = (req, res) => {
    let songs = readData();
    const index = songs.findIndex(s => s.id === parseInt(req.params.id));
    
    if (index !== -1) {
        songs[index] = { ...songs[index], ...req.body };
        writeData(songs);
        res.json({ message: "Lagu berhasil diperbarui", song: songs[index] });
    } else {
        res.status(404).json({ message: "Lagu tidak ditemukan" });
    }
};

// Hapus lagu berdasarkan ID
exports.deleteSong = (req, res) => {
    let songs = readData();
    const newSongs = songs.filter(s => s.id !== parseInt(req.params.id));
    
    if (songs.length === newSongs.length) {
        return res.status(404).json({ message: "Lagu tidak ditemukan" });
    }
    
    writeData(newSongs);
    res.json({ message: "Lagu berhasil dihapus" });
};

// Cari lagu berdasarkan penyanyi
exports.getSongsBySinger = (req, res) => {
    const songs = readData();
    const filteredSongs = songs.filter(s => s.penyanyi.toLowerCase() === req.params.penyanyi.toLowerCase());
    
    filteredSongs.length > 0 
        ? res.json(filteredSongs) 
        : res.status(404).json({ message: "Tidak ada lagu dari penyanyi tersebut" });
};
