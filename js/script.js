document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active-menu');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // --- Smooth Scroll & Navbar Scroll Effect ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (navLinks && navLinks.classList.contains('active-menu')) {
                navLinks.classList.remove('active-menu');
                mobileMenuBtn.classList.remove('active');
            }
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.padding = '16px 0';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.backdropFilter = 'none';
                navbar.style.padding = '24px 0';
            }
        });
    }

    // --- FAQ Accordion Interaction ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });

    // --- Counter Animation (IntersectionObserver for reliability) ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace(/\D/g, ''); // strip non-digits

            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc).toLocaleString('id-ID');
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target.toLocaleString('id-ID');
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target); // Run once
            }
        });
    }, { threshold: 0.5 }); // Starts when 50% visible

    // --- Initialize Statistics from LocalStorage ---
    const initStatistics = () => {
        const stats = {
            kecelakaan: localStorage.getItem('stat_kecelakaan') || '152000',
            pelanggaran: localStorage.getItem('stat_pelanggaran') || '817069',
            operasi: localStorage.getItem('stat_operasi') || '30468'
        };

        if (!localStorage.getItem('stat_kecelakaan')) {
            localStorage.setItem('stat_kecelakaan', stats.kecelakaan);
            localStorage.setItem('stat_pelanggaran', stats.pelanggaran);
            localStorage.setItem('stat_operasi', stats.operasi);
        }

        const statKecelakaanEl = document.getElementById('statKecelakaan');
        const statPelanggaranEl = document.getElementById('statPelanggaran');
        const statOperasiEl = document.getElementById('statOperasi');

        if (statKecelakaanEl) statKecelakaanEl.setAttribute('data-target', stats.kecelakaan);
        if (statPelanggaranEl) statPelanggaranEl.setAttribute('data-target', stats.pelanggaran);
        if (statOperasiEl) statOperasiEl.setAttribute('data-target', stats.operasi);
    };
    initStatistics();

    counters.forEach(counter => {
        counter.innerText = '0'; // Set to 0 initially
        counterObserver.observe(counter);
    });

    // --- Interactive Quiz Logic ---    
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

    if (!localStorage.getItem('edu_quiz_questions')) {
        localStorage.setItem('edu_quiz_questions', JSON.stringify(defaultQuestions));
    }
    let quizQuestions = JSON.parse(localStorage.getItem('edu_quiz_questions'));

    let currentQuestionIndex = 0;
    let score = 0;

    // Quiz Elements
    const quizStartPanel = document.getElementById('quizStartPanel');
    const quizQuestionPanel = document.getElementById('quizQuestionPanel');
    const quizFeedbackPanel = document.getElementById('quizFeedbackPanel');
    const quizResultPanel = document.getElementById('quizResultPanel');

    const btnStartQuiz = document.getElementById('btnStartQuiz');
    const btnNextQuestion = document.getElementById('btnNextQuestion');
    const btnRestartQuiz = document.getElementById('btnRestartQuiz');

    const quizProgress = document.getElementById('quizProgress');
    const quizQuestionText = document.getElementById('quizQuestionText');
    const quizOptions = document.getElementById('quizOptions');

    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackText = document.getElementById('feedbackText');

    const resultScore = document.getElementById('resultScore');
    const resultMessage = document.getElementById('resultMessage');
    const resultEmoji = document.getElementById('resultEmoji');

    const renderQuestion = () => {
        const q = quizQuestions[currentQuestionIndex];
        quizProgress.innerText = `Pertanyaan ${currentQuestionIndex + 1} dari ${quizQuestions.length}`;
        quizQuestionText.innerText = q.question;
        quizOptions.innerHTML = '';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.innerText = opt;
            // Bind click event correctly
            btn.addEventListener('click', function () {
                handleAnswer(index, this);
            });
            quizOptions.appendChild(btn);
        });

        // Ensure only Question Panel is visible
        if (quizStartPanel) quizStartPanel.style.display = 'none';
        if (quizFeedbackPanel) quizFeedbackPanel.style.display = 'none';
        if (quizResultPanel) quizResultPanel.style.display = 'none';
        if (quizQuestionPanel) quizQuestionPanel.style.display = 'flex';
    };

    const handleAnswer = (selectedIndex, selectedBtn) => {
        // Disable all buttons to prevent double clicking
        const allBtns = quizOptions.querySelectorAll('.quiz-btn');
        allBtns.forEach(btn => btn.disabled = true);

        const q = quizQuestions[currentQuestionIndex];
        const isCorrect = (selectedIndex === q.correctIndex);

        if (isCorrect) {
            score++;
            selectedBtn.classList.add('correct');
            feedbackTitle.innerText = "Tepat Sekali!";
            feedbackTitle.style.color = "#059669";
        } else {
            selectedBtn.classList.add('wrong');
            // Highlight the correct option
            if (allBtns[q.correctIndex]) {
                allBtns[q.correctIndex].classList.add('correct');
            }
            feedbackTitle.innerText = "Jawaban Kurang Tepat";
            feedbackTitle.style.color = "#DC2626";
        }

        feedbackText.innerHTML = `<strong>Penjelasan:</strong> ${q.explanation}`;

        // Show feedback panel after short delay
        setTimeout(() => {
            if (quizQuestionPanel) quizQuestionPanel.style.display = 'none';
            if (quizFeedbackPanel) quizFeedbackPanel.style.display = 'flex';
        }, 1200);
    };

    const saveQuizScore = (finalScore) => {
        const sessionStr = localStorage.getItem('edu_session');
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session.role === 'Pengendara') {
                const totalQuestions = quizQuestions.length;
                const scorePercentage = (finalScore / totalQuestions) * 100;
                const status = scorePercentage >= 70 ? "Layak Berkendara 🟢" : "Butuh Belajar Lagi 🔴";
                
                localStorage.setItem(`edu_score_${session.username}`, JSON.stringify({
                    score: `${finalScore} / ${totalQuestions}`,
                    status: status,
                    timestamp: new Date().toLocaleString('id-ID')
                }));
                
                // Update User Dashboard UI instan
                updateUserDashboard(session);
            }
        }
    };

    const showResult = () => {
        if (quizFeedbackPanel) quizFeedbackPanel.style.display = 'none';
        if (quizResultPanel) quizResultPanel.style.display = 'flex';

        const totalQuestions = quizQuestions.length;
        resultScore.innerText = `${score} / ${totalQuestions}`;

        // Simpan skor kuis
        saveQuizScore(score);

        const pct = (score / totalQuestions) * 100;

        if (pct === 100) {
            resultEmoji.innerText = "🏆";
            resultMessage.innerText = "Luar biasa! Anda memiliki pemahaman yang sangat akurat tentang hukum lalu lintas Indonesia.";
        } else if (pct >= 70) {
            resultEmoji.innerText = "👍";
            resultMessage.innerText = "Skor Anda bagus. Anda sudah menguasai sebagian besar aturan lalu lintas.";
        } else if (pct >= 40) {
            resultEmoji.innerText = "📚";
            resultMessage.innerText = "Cukup baik, tetapi ada baiknya membaca lagi seksi materi dan sanksi agar lebih waspada di jalan raya.";
        } else {
            resultEmoji.innerText = "⚠️";
            resultMessage.innerText = "Hati-hati! Anda sangat beresiko tertilang di jalan. Sangat disarankan untuk mempelajari dasar-dasar keselamatan dan rambu lalu lintas.";
        }
    };

    // Events attachment securely
    if (btnStartQuiz) {
        btnStartQuiz.addEventListener('click', () => {
            // Re-fetch pertanyaan untuk merekam penambahan/penghapusan admin
            quizQuestions = JSON.parse(localStorage.getItem('edu_quiz_questions')) || defaultQuestions;
            currentQuestionIndex = 0;
            score = 0;
            renderQuestion();
        });
    }

    if (btnNextQuestion) {
        btnNextQuestion.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizQuestions.length) {
                renderQuestion();
            } else {
                showResult();
            }
        });
    }

    if (btnRestartQuiz) {
        btnRestartQuiz.addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            if (quizResultPanel) quizResultPanel.style.display = 'none';
            if (quizStartPanel) quizStartPanel.style.display = 'flex';
        });
    }

    // ==========================================================================
    // MULTI-ROLE AUTHENTICATION (localStorage-based)
    // ==========================================================================

    const demoUsers = [
        { username: 'pengendara', password: 'user123', name: 'Budi Santoso', role: 'Pengendara' },
        { username: 'admin', password: 'admin123', name: 'Della Kurnia', role: 'Admin' }
    ];

    const loginModal = document.getElementById('loginModal');
    const btnShowLogin = document.getElementById('btnShowLogin');
    const btnCloseLogin = document.getElementById('btnCloseLogin');
    const formLogin = document.getElementById('formLogin');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const navAuthContainer = document.getElementById('navAuthContainer');

    const dashboardPengendara = document.getElementById('dashboardPengendara');
    const userDashboardName = document.getElementById('userDashboardName');
    const userLastScore = document.getElementById('userLastScore');
    const userSafetyStatus = document.getElementById('userSafetyStatus');

    // --- Modal Actions ---
    const showLogin = () => {
        if (loginModal) {
            loginModal.style.display = 'flex';
            setTimeout(() => loginModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
            
            // Tutup menu mobile jika sedang terbuka
            if (navLinks && navLinks.classList.contains('active-menu')) {
                navLinks.classList.remove('active-menu');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            }
        }
    };

    const hideLogin = () => {
        if (loginModal) {
            loginModal.classList.remove('active');
            setTimeout(() => loginModal.style.display = 'none', 300);
            document.body.style.overflow = '';
            if (formLogin) formLogin.reset();
            if (loginErrorMessage) loginErrorMessage.style.display = 'none';
        }
    };

    if (btnShowLogin) btnShowLogin.addEventListener('click', showLogin);
    if (btnCloseLogin) btnCloseLogin.addEventListener('click', hideLogin);
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) hideLogin();
        });
    }

    // --- Form Login Handler ---
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginUsernameInput.value.trim().toLowerCase();
            const password = loginPasswordInput.value;

            const user = demoUsers.find(u => u.username === username && u.password === password);

            if (user) {
                // Simpan Sesi
                localStorage.setItem('edu_session', JSON.stringify({
                    name: user.name,
                    username: user.username,
                    role: user.role
                }));
                hideLogin();
                checkSession();
                
                // Gulir secara halus ke bagian dashboard baru jika pengendara, atau redirect ke admin.html jika admin
                setTimeout(() => {
                    if (user.role === 'Pengendara' && dashboardPengendara) {
                        dashboardPengendara.scrollIntoView({ behavior: 'smooth' });
                    } else if (user.role === 'Admin') {
                        window.location.href = 'admin.html';
                    }
                }, 400);
            } else {
                if (loginErrorMessage) loginErrorMessage.style.display = 'block';
            }
        });
    }

    // --- User Dashboard Handler ---
    const updateUserDashboard = (session) => {
        if (userDashboardName) userDashboardName.innerText = session.name;
        
        const lastScoreData = localStorage.getItem(`edu_score_${session.username}`);
        if (lastScoreData) {
            const data = JSON.parse(lastScoreData);
            if (userLastScore) userLastScore.innerText = data.score;
            if (userSafetyStatus) {
                userSafetyStatus.innerText = data.status;
                if (data.status.includes('Layak')) {
                    userSafetyStatus.style.color = '#059669'; // Emerald
                } else {
                    userSafetyStatus.style.color = '#dc2626'; // Red
                }
            }
        } else {
            if (userLastScore) userLastScore.innerText = '-';
            if (userSafetyStatus) {
                userSafetyStatus.innerText = 'Belum Mengikuti Kuis';
                userSafetyStatus.style.color = '#b45309'; // Amber
            }
        }
    };

    // --- Active Session Manager & UI Renderer ---
    const checkSession = () => {
        const sessionStr = localStorage.getItem('edu_session');

        if (sessionStr) {
            const session = JSON.parse(sessionStr);

            // Jika pengguna yang aktif adalah admin, alihkan ke admin.html
            if (session.role === 'Admin') {
                window.location.href = 'admin.html';
                return;
            }

            // Ubah Navbar menjadi badge Profil Dropdown
            if (navAuthContainer) {
                navAuthContainer.innerHTML = `
                    <div class="nav-user-badge" id="navUserBadge">
                        👤 ${session.name}
                        <div class="nav-user-dropdown" id="navUserDropdown">
                            <div class="nav-user-dropdown-item" id="btnScrollDashboard">Dashboard Saya</div>
                            <div class="nav-user-dropdown-item logout-item" id="btnLogout">Keluar</div>
                        </div>
                    </div>
                `;

                // Event dropdown profil
                const navUserBadge = document.getElementById('navUserBadge');
                const navUserDropdown = document.getElementById('navUserDropdown');
                
                if (navUserBadge && navUserDropdown) {
                    navUserBadge.addEventListener('click', (e) => {
                        e.stopPropagation();
                        navUserDropdown.classList.toggle('active');
                        navUserBadge.classList.toggle('active');
                    });
                    
                    document.addEventListener('click', () => {
                        navUserDropdown.classList.remove('active');
                        navUserBadge.classList.remove('active');
                    });
                }

                // Scroll ke dashboard
                const btnScrollDashboard = document.getElementById('btnScrollDashboard');
                if (btnScrollDashboard) {
                    btnScrollDashboard.addEventListener('click', (e) => {
                        e.stopPropagation();
                        navUserDropdown.classList.remove('active');
                        navUserBadge.classList.remove('active');
                        
                        // Tutup menu mobile jika sedang terbuka
                        if (navLinks && navLinks.classList.contains('active-menu')) {
                            navLinks.classList.remove('active-menu');
                            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                        }
                        
                        if (session.role === 'Pengendara' && dashboardPengendara) {
                            dashboardPengendara.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                }

                // Log out action
                const btnLogout = document.getElementById('btnLogout');
                if (btnLogout) {
                    btnLogout.addEventListener('click', (e) => {
                        e.stopPropagation();
                        localStorage.removeItem('edu_session');
                        checkSession();
                        alert("Anda telah berhasil keluar dari akun.");
                        window.location.reload(); // Reload untuk mereset element halaman
                    });
                }
            }

            // Tampilkan Panel Sesuai Peran
            if (session.role === 'Pengendara') {
                if (dashboardPengendara) dashboardPengendara.style.display = 'block';
                updateUserDashboard(session);
            }

        } else {
            // Jika Belum Login
            if (navAuthContainer) {
                navAuthContainer.innerHTML = `<button class="btn-login-nav" id="btnShowLogin">Masuk</button>`;
                const newBtnShowLogin = document.getElementById('btnShowLogin');
                if (newBtnShowLogin) newBtnShowLogin.addEventListener('click', showLogin);
            }

            if (dashboardPengendara) dashboardPengendara.style.display = 'none';
        }
    };

    // Jalankan pengecekan sesi saat halaman dimuat
    checkSession();

});
