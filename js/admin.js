document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const adminLoginWrapper = document.getElementById('adminLoginWrapper');
    const adminDashboardLayout = document.getElementById('adminDashboardLayout');
    
    const formAdminLogin = document.getElementById('formAdminLogin');
    const adminUsernameInput = document.getElementById('adminUsername');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminLoginError = document.getElementById('adminLoginError');
    
    const btnAdminLogout = document.getElementById('btnAdminLogout');
    const adminProfileName = document.getElementById('adminProfileName');
    const liveClock = document.getElementById('liveClock');
    
    const navItems = document.querySelectorAll('.nav-item');
    const pageTitleText = document.getElementById('pageTitleText');
    const sections = document.querySelectorAll('.dashboard-section');
    
    // --- Statistics Elements ---
    const statValKecelakaan = document.getElementById('statValKecelakaan');
    const statValPelanggaran = document.getElementById('statValPelanggaran');
    const statValOperasi = document.getElementById('statValOperasi');
    const statValTotalKuis = document.getElementById('statValTotalKuis');
    
    const formAdminStats = document.getElementById('formAdminStats');
    const inputKecelakaan = document.getElementById('inputKecelakaan');
    const inputPelanggaran = document.getElementById('inputPelanggaran');
    const inputOperasi = document.getElementById('inputOperasi');
    
    // --- Quiz CRUD Elements ---
    const formAdminAddQuestion = document.getElementById('formAdminAddQuestion');
    const adminQuizList = document.getElementById('adminQuizList');
    const adminActiveQuestionsCount = document.getElementById('adminActiveQuestionsCount');
    
    // --- Scores Elements ---
    const tableScoresBody = document.getElementById('tableScoresBody');
    const btnResetAllScores = document.getElementById('btnResetAllScores');
    
    // --- Mobile Sidebar Elements ---
    const btnMobileToggle = document.getElementById('btnMobileToggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Create overlay element for mobile drawer
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // ==========================================
    // 1. SESSION MANAGEMENT & LOG-IN/OUT
    // ==========================================
    const demoAdmin = { username: 'admin', password: 'admin123', name: 'Della Kurnia' };

    const checkAdminSession = () => {
        const sessionStr = localStorage.getItem('edu_session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.role === 'Admin') {
                // Show dashboard, hide login screen
                adminLoginWrapper.style.display = 'none';
                adminDashboardLayout.style.display = 'flex';
                adminProfileName.innerText = session.name;
                
                // Initialize Dashboard Data
                initDashboard();
                return;
            }
        }
        // Force show login screen
        adminLoginWrapper.style.display = 'flex';
        adminDashboardLayout.style.display = 'none';
    };

    if (formAdminLogin) {
        formAdminLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = adminUsernameInput.value.trim().toLowerCase();
            const password = adminPasswordInput.value;

            if (username === demoAdmin.username && password === demoAdmin.password) {
                // Store Admin session
                localStorage.setItem('edu_session', JSON.stringify({
                    name: demoAdmin.name,
                    username: demoAdmin.username,
                    role: 'Admin'
                }));
                adminLoginError.style.display = 'none';
                formAdminLogin.reset();
                checkAdminSession();
            } else {
                adminLoginError.style.display = 'block';
            }
        });
    }

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
                localStorage.removeItem('edu_session');
                window.location.reload();
            }
        });
    }

    // ==========================================
    // 2. LIVE CLOCK (Bahasa Indonesia)
    // ==========================================
    const updateClock = () => {
        if (!liveClock) return;
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[now.getDay()];
        const day = now.getDate().toString().padStart(2, '0');
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        liveClock.innerText = `${dayName}, ${day} ${monthName} ${year} | ${hours}:${minutes}:${seconds}`;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // ==========================================
    // 3. SIDEBAR NAVIGATION
    // ==========================================
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active classes
            navItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Set active
            item.classList.add('active');
            const targetSectionId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Set page title text
            const title = item.querySelector('span').innerText;
            pageTitleText.innerText = `Dashboard ${title}`;
            
            // Close mobile sidebar if open
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    if (btnMobileToggle) {
        btnMobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // ==========================================
    // 4. OVERVIEW & STATISTICS HANDLER
    // ==========================================
    const loadStatistics = () => {
        const stats = {
            kecelakaan: localStorage.getItem('stat_kecelakaan') || '152000',
            pelanggaran: localStorage.getItem('stat_pelanggaran') || '817069',
            operasi: localStorage.getItem('stat_operasi') || '30468'
        };

        // Render cards
        if (statValKecelakaan) statValKecelakaan.innerText = parseInt(stats.kecelakaan).toLocaleString('id-ID');
        if (statValPelanggaran) statValPelanggaran.innerText = parseInt(stats.pelanggaran).toLocaleString('id-ID');
        if (statValOperasi) statValOperasi.innerText = parseInt(stats.operasi).toLocaleString('id-ID');

        // Fill inputs
        if (inputKecelakaan) inputKecelakaan.value = stats.kecelakaan;
        if (inputPelanggaran) inputPelanggaran.value = stats.pelanggaran;
        if (inputOperasi) inputOperasi.value = stats.operasi;
    };

    if (formAdminStats) {
        formAdminStats.addEventListener('submit', (e) => {
            e.preventDefault();
            const valKec = inputKecelakaan.value.trim();
            const valPel = inputPelanggaran.value.trim();
            const valOp = inputOperasi.value.trim();

            localStorage.setItem('stat_kecelakaan', valKec);
            localStorage.setItem('stat_pelanggaran', valPel);
            localStorage.setItem('stat_operasi', valOp);

            loadStatistics();
            alert("Data statistik berhasil diperbarui!");
        });
    }

    // ==========================================
    // 5. QUIZ QUESTIONS CRUD LOGIC
    // ==========================================
    const defaultQuestions = [
        {
            question: "Apa yang paling tepat dilakukan jika terkena tilang padahal Anda merasa surat-surat sudah lengkap?",
            options: [
                "Marah-marah dan berdebat keras dengan petugas.",
                "Tancap gas dan kabur menghindari petugas.",
                "Menyerahkan uang receh agar dibebaskan langsung.",
                "Terima slip tilang dengan tenang, catat nama petugas, dan kemukakan alibi Anda saat sidang di pengadilan."
            ],
            correctIndex: 3,
            explanation: "Pengadilan adalah tempat resmi untuk membantah tilang. Berdebat di jalan tidak menyelesaikan masalah dan bisa dikenai pasal berlapis."
        },
        {
            question: "Berapa denda maksimal jika Anda tidak menggunakan helm berstandar SNI dan/atau membiarkan penumpang tidak memakai helm?",
            options: [
                "Rp 100.000",
                "Rp 250.000",
                "Rp 500.000",
                "Murni Peringatan"
            ],
            correctIndex: 1,
            explanation: "Sesuai Pasal 291 ayat (1) dan (2) UU LLAJ No. 22 Tahun 2009, dendanya maksimal Rp 250.000 atau kurungan pidana maksimal 1 bulan."
        },
        {
            question: "Apa arti utama dari marka jalan berupa garis putih padat/utuh (tidak terputus)?",
            options: [
                "Batas untuk tempat parkir saja",
                "Kendaraan boleh mendahului dengan hati-hati",
                "Kendaraan dilarang melintasi garis tersebut atau mendahului",
                "Hanya untuk batas kendaraan roda dua"
            ],
            correctIndex: 2,
            explanation: "Garis solid/utuh putih adalah peringatan tegas larangan melintas/berpindah jalur karena berbahaya."
        },
        {
            question: "Berapa batas kecepatan maksimal yang diizinkan saat berkendara di jalan tol antarkota (kecuali ada rambu yang menyatakan lain)?",
            options: ["80 km/jam", "100 km/jam", "120 km/jam", "Bebas berapapun"],
            correctIndex: 1,
            explanation: "Kecepatan maksimal tol antarkota adalah 100 km/jam, dan 80 km/jam untuk tol dalam kota sesuai Permenhub No. 111 Tahun 2015."
        },
        {
            question: "Lajur paling kanan di jalan tol/jalan raya bebas hambatan diperuntukkan secara khusus bagi apa?",
            options: [
                "Kendaran bermuatan berat (Truk/Bus)",
                "Kendaraan yang mendahului/menyalip",
                "Kendaraan roda dua",
                "Tempat berhenti darurat"
            ],
            correctIndex: 1,
            explanation: "Lajur kanan hanya digunakan untuk mendahului, setelah mendahului wajib kembali ke lajur kiri/tengah."
        },
        {
            question: "Berapa sanksi denda maksimal jika terbukti mengemudi sambil bermain alat komunikasi genggam (HP)?",
            options: ["Rp 250.000", "Rp 500.000", "Rp 750.000", "Rp 1.000.000"],
            correctIndex: 2,
            explanation: "Pasal 283 mengatur denda maksimal Rp 750.000 untuk pengemudi yang melakukan kegiatan lain (seperti main HP) yang mengakibatkan gangguan konsentrasi."
        },
        {
            question: "Apa makna warna dominan 'Kuning' dengan lambang dan tulisan berwarna 'Hitam' pada rambu lalu lintas?",
            options: ["Rambu Larangan", "Rambu Peringatan (Bahaya)", "Rambu Perintah", "Rambu Petunjuk Jalan"],
            correctIndex: 1,
            explanation: "Rambu Kuning selalu bermakna Peringatan akan potensi bahaya di depan (seperti jalan licin, turunan tajam, persimpangan, dll)."
        },
        {
            question: "Apa prosedur pembayaran tilang online (E-Tilang) yang resmi?",
            options: [
                "Mentransfer uang ke rekening perorangan petugas di lokasi",
                "Menempelkan uang di dalam STNK",
                "Diberikan nomor BRIVA/Akun Virtual dan dibayar melalui ATM/M-banking secara langsung",
                "Hanya bisa bayar tunai di Kejaksaan seminggu kemudian"
            ],
            correctIndex: 2,
            explanation: "E-tilang menghindari pungutan liar. Pembayaran denda resmi selalu disetorkan langsung ke Kas Negara via metode Virtual Account (BRIVA)."
        },
        {
            question: "Mengapa penting sekali menyalakan lampu isyarat (sein) sebelum berbelok atau pindah lajur?",
            options: [
                "Agar aki motor tidak cepat soak",
                "Hanya berguna di malam hari",
                "Hati-hati terhadap denda semata",
                "Berkomunikasi menghindari resiko kecelakaan dengan memberi antisipasi pada pengemudi lain"
            ],
            correctIndex: 3,
            explanation: "Fungsi utama lampu sein bukan hanya tentang patuh hukum, tetapi media komunikasi krusial antar pengendara di jalan."
        },
        {
            question: "Apakah tindakan yang benar apabila mobil/motor darurat (ambulans/pemadam) membunyikan sirine di belakang Anda?",
            options: [
                "Segera menepi perlahan untuk memberikan jalan seluas mungkin",
                "Berhenti mendadak di tempat saat itu juga",
                "Membalas dengan klakson agar mereka tahu Anda juga buru-buru",
                "Malah menambah kecepatan menghindari agar tetap di depan mereka"
            ],
            correctIndex: 0,
            explanation: "Kendaraan darurat memiliki prioritas absolut jalan raya (hak utama). Pengendara di depan wajib menepi aman secepatnya untuk memberi ruang evakuasi."
        }
    ];

    const getQuizQuestions = () => {
        if (!localStorage.getItem('edu_quiz_questions')) {
            localStorage.setItem('edu_quiz_questions', JSON.stringify(defaultQuestions));
        }
        return JSON.parse(localStorage.getItem('edu_quiz_questions'));
    };

    const renderQuizList = () => {
        const questions = getQuizQuestions();
        
        // Update stats
        if (statValTotalKuis) statValTotalKuis.innerText = questions.length;
        if (adminActiveQuestionsCount) adminActiveQuestionsCount.innerText = `${questions.length} Soal`;
        
        if (!adminQuizList) return;
        
        if (questions.length === 0) {
            adminQuizList.innerHTML = '<div class="loading-state">Belum ada soal kuis aktif. Gunakan form di samping untuk menambah soal.</div>';
            return;
        }

        adminQuizList.innerHTML = '';
        
        questions.forEach((q, idx) => {
            const card = document.createElement('div');
            card.className = 'q-card';
            
            const optChar = ['A', 'B', 'C', 'D'];
            const correctChar = optChar[q.correctIndex];
            
            card.innerHTML = `
                <button class="q-delete-btn" title="Hapus Soal">&times;</button>
                <h4>${idx + 1}. ${q.question}</h4>
                <div class="q-options-grid">
                    <div class="q-opt ${q.correctIndex === 0 ? 'correct' : ''}"><strong>A.</strong> ${q.options[0]}</div>
                    <div class="q-opt ${q.correctIndex === 1 ? 'correct' : ''}"><strong>B.</strong> ${q.options[1]}</div>
                    <div class="q-opt ${q.correctIndex === 2 ? 'correct' : ''}"><strong>C.</strong> ${q.options[2]}</div>
                    <div class="q-opt ${q.correctIndex === 3 ? 'correct' : ''}"><strong>D.</strong> ${q.options[3]}</div>
                </div>
                <div class="q-exp">
                    <strong>Kunci Jawaban: ${correctChar}</strong><br>
                    <span>${q.explanation}</span>
                </div>
            `;
            
            // Delete button listener
            card.querySelector('.q-delete-btn').addEventListener('click', () => {
                deleteQuestion(idx);
            });
            
            adminQuizList.appendChild(card);
        });
    };

    const deleteQuestion = (index) => {
        if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
            let questions = getQuizQuestions();
            questions.splice(index, 1);
            localStorage.setItem('edu_quiz_questions', JSON.stringify(questions));
            renderQuizList();
        }
    };

    if (formAdminAddQuestion) {
        formAdminAddQuestion.addEventListener('submit', (e) => {
            e.preventDefault();
            const questionVal = document.getElementById('newQuestion').value.trim();
            const optAVal = document.getElementById('optA').value.trim();
            const optBVal = document.getElementById('optB').value.trim();
            const optCVal = document.getElementById('optC').value.trim();
            const optDVal = document.getElementById('optD').value.trim();
            const correctIndexVal = parseInt(document.getElementById('correctIndex').value);
            const explanationVal = document.getElementById('explanation').value.trim();

            const newQ = {
                question: questionVal,
                options: [optAVal, optBVal, optCVal, optDVal],
                correctIndex: correctIndexVal,
                explanation: explanationVal
            };

            let questions = getQuizQuestions();
            questions.push(newQ);
            localStorage.setItem('edu_quiz_questions', JSON.stringify(questions));

            formAdminAddQuestion.reset();
            renderQuizList();
            alert("Soal kuis baru berhasil ditambahkan!");
        });
    }

    // ==========================================
    // 6. USER SCORES LIST HANDLER
    // ==========================================
    const getUserDisplayName = (username) => {
        const usersMapping = {
            'pengendara': 'Budi Santoso',
            'admin': 'Della Kurnia'
        };
        return usersMapping[username] || username.charAt(0).toUpperCase() + username.slice(1);
    };

    const renderScoresTable = () => {
        if (!tableScoresBody) return;
        
        let scoreLogs = [];
        
        // Scan localStorage for scores
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('edu_score_')) {
                const username = key.replace('edu_score_', '');
                try {
                    const scoreData = JSON.parse(localStorage.getItem(key));
                    scoreLogs.push({
                        username: username,
                        displayName: getUserDisplayName(username),
                        score: scoreData.score || '-',
                        status: scoreData.status || 'Belum Dievaluasi',
                        timestamp: scoreData.timestamp || '-'
                    });
                } catch(e) {
                    console.error("Error parsing score data for " + key, e);
                }
            }
        }
        
        // Sort by timestamp or display name
        scoreLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (scoreLogs.length === 0) {
            tableScoresBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 40px; color:#9ca3af;">Belum ada pengendara yang mengikuti kuis.</td>
                </tr>
            `;
            return;
        }

        tableScoresBody.innerHTML = '';
        scoreLogs.forEach((log, index) => {
            const tr = document.createElement('tr');
            
            const isPassed = log.status.includes('Layak') || log.status.includes('🟢');
            const statusClass = isPassed ? 'passed' : 'failed';
            const statusText = isPassed ? 'Layak Berkendara 🟢' : 'Butuh Belajar Lagi 🔴';
            
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td style="font-weight:600;">${log.displayName}</td>
                <td><code style="background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${log.username}</code></td>
                <td style="font-weight:700; color:var(--primary-color);">${log.score}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td style="font-size:0.85rem; color:var(--text-muted);">${log.timestamp}</td>
            `;
            tableScoresBody.appendChild(tr);
        });
    };

    if (btnResetAllScores) {
        btnResetAllScores.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin menghapus semua riwayat kuis pengendara? Tindakan ini tidak dapat dibatalkan.")) {
                // Delete keys
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.startsWith('edu_score_')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
                
                renderScoresTable();
                alert("Semua riwayat kuis telah dibersihkan.");
            }
        });
    }

    // ==========================================
    // 7. INITIALIZE DASHBOARD PANELS
    // ==========================================
    const initDashboard = () => {
        loadStatistics();
        renderQuizList();
        renderScoresTable();
    };

    // Run active session checking
    checkAdminSession();

});
