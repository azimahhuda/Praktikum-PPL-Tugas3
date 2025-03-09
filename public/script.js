document.addEventListener("DOMContentLoaded", () => {
    fetchSongs();

    // Pastikan tombol edit ada sebelum menambahkan event listener
    const saveEditButton = document.getElementById("saveEditButton");
    if (saveEditButton) {
        saveEditButton.addEventListener("click", saveEdit);
    }
});

// Fungsi untuk mengambil daftar lagu dari server
async function fetchSongs() {
    try {
        const response = await fetch("/songs");
        const songs = await response.json();
        const tableBody = document.getElementById("songTableBody");

        tableBody.innerHTML = ""; // Kosongkan tabel sebelum menampilkan ulang
        songs.forEach(song => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${song.penyanyi}</td>
                <td>${song.judul}</td>
                <td>
                    <button onclick="viewSong(${song.id})">Detail Lagu</button>
                    <button onclick="showEditForm(${song.id}, '${song.penyanyi}', '${song.judul}', '${song.genre}', '${song.penulis}', ${song.tahun})">Edit</button>
                    <button onclick="deleteSong(${song.id})">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Gagal mengambil lagu:", error);
    }
}

// Fungsi untuk melihat detail lagu
function viewSong(id) {
    window.location.href = `song_detail.html?id=${id}`;
}

// Fungsi untuk menambah lagu
document.getElementById("addSongForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newSong = {
        penyanyi: document.getElementById("penyanyi").value,
        judul: document.getElementById("judul").value,
        genre: document.getElementById("genre").value,
        penulis: document.getElementById("penulis").value,
        tahun: document.getElementById("tahun").value
    };

    try {
        const response = await fetch("/songs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSong)
        });

        if (response.ok) {
            alert("Lagu berhasil ditambahkan!");
            fetchSongs();
            document.getElementById("addSongForm").reset();
        } else {
            alert("Gagal menambahkan lagu.");
        }
    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    }
});

// Fungsi untuk menghapus lagu
async function deleteSong(id) {
    if (confirm("Yakin ingin menghapus lagu ini?")) {
        try {
            const response = await fetch(`/songs/${id}`, { method: "DELETE" });

            if (response.ok) {
                alert("Lagu berhasil dihapus!");
                fetchSongs();
            } else {
                alert("Gagal menghapus lagu.");
            }
        } catch (error) {
            alert("Terjadi kesalahan: " + error.message);
        }
    }
}

// Fungsi untuk menampilkan form edit lagu
function showEditForm(id, penyanyi, judul, genre, penulis, tahun) {
    document.getElementById("editSongForm").style.display = "block";
    document.getElementById("editId").value = id;
    document.getElementById("editPenyanyi").value = penyanyi;
    document.getElementById("editJudul").value = judul;
    document.getElementById("editGenre").value = genre;
    document.getElementById("editPenulis").value = penulis;
    document.getElementById("editTahun").value = tahun ? tahun : ""; // Pastikan tahun tidak null
}

// Fungsi untuk menyembunyikan form edit
function cancelEdit() {
    document.getElementById("editSongForm").style.display = "none";
    
    // Kosongkan input form edit satu per satu
    document.getElementById("editId").value = "";
    document.getElementById("editPenyanyi").value = "";
    document.getElementById("editJudul").value = "";
    document.getElementById("editGenre").value = "";
    document.getElementById("editPenulis").value = "";
    document.getElementById("editTahun").value = "";
}

// Fungsi untuk menyimpan perubahan lagu
async function saveEdit() {
    const id = document.getElementById("editId").value;
    const updatedSong = {
        penyanyi: document.getElementById("editPenyanyi").value,
        judul: document.getElementById("editJudul").value,
        genre: document.getElementById("editGenre").value,
        penulis: document.getElementById("editPenulis").value,
        tahun: document.getElementById("editTahun").value
    };

    console.log("Mengirim data:", updatedSong); // Debugging

    try {
        const response = await fetch(`/songs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedSong)
        });

        if (response.ok) {
            alert("Lagu berhasil diperbarui!");
            fetchSongs(); // Memuat ulang daftar lagu
            cancelEdit(); // Menyembunyikan form edit
        } else {
            const errorMessage = await response.text();
            alert("Gagal memperbarui lagu: " + errorMessage);
        }
    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    }
}

// Jika berada di halaman detail lagu, ambil data lagu berdasarkan ID dari URL
if (window.location.pathname.includes("song_detail.html")) {
    async function fetchSongDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const songId = urlParams.get("id");

        try {
            const response = await fetch(`/songs/${songId}`);
            if (!response.ok) {
                throw new Error("Lagu tidak ditemukan");
            }
            const song = await response.json();

            document.getElementById("songDetail").innerText = 
                `Penyanyi: ${song.penyanyi}\nJudul: ${song.judul}\nGenre: ${song.genre}\nPenulis: ${song.penulis}\nTahun: ${song.tahun}`;
        } catch (error) {
            alert("Gagal mengambil detail lagu: " + error.message);
        }
    }

    fetchSongDetail();
    
}