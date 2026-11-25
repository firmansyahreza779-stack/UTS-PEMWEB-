<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UTS Pem Web</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-ENjdO4Dr2bkBIFxQpeoYz1H4h0K5Jr59g9fB+2H5DVu3Q/+I5jvVILyV+8b75U6V"
          crossorigin="anonymous">
    <style>
        body { background-color: #f8f9fa; }

        /* Navbar */
        .navbar { background-color: #ffffff; border-bottom: 1px solid #dee2e6; padding: 10px 0; }
        .navbar-brand { font-weight: 700; font-size: 1rem; color: #000 !important; }
        .navbar-nav .nav-link { font-size: 0.875rem; color: #333 !important; padding: 0 10px; }
        .navbar-nav .nav-link:hover { color: #666 !important; }

        /* Card grid */
        .card { border: 1px solid #dee2e6; border-radius: 4px; }
        .card-img-top { object-fit: cover; height: 240px; width: 100%; }

        /* Add (+) card */
        .add-card {
            min-height: 420px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            background: #fff;
        }
        .add-btn {
            width: 68px; height: 68px;
            background-color: #28a745;
            color: #fff;
            border-radius: 50%;
            font-size: 2.2rem;
            display: flex; align-items: center; justify-content: center;
            text-decoration: none;
            border: none;
            line-height: 1;
        }
        .add-btn:hover { background-color: #218838; color: #fff; }

        /* Member card body */
        .member-name { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; }
        .member-desc { font-size: 0.8rem; color: #555; margin-bottom: 0; }
        .card-footer-btns { padding: 10px 12px; display: flex; gap: 6px; }

        /* Buttons */
        .btn-edit  { font-size: 0.8rem; padding: 2px 10px; border: 1px solid #0d6efd; color: #0d6efd; background: #fff; border-radius: 3px; }
        .btn-edit:hover  { background: #0d6efd; color: #fff; }
        .btn-hapus { font-size: 0.8rem; padding: 2px 10px; border: 1px solid #dc3545; color: #dc3545; background: #fff; border-radius: 3px; }
        .btn-hapus:hover { background: #dc3545; color: #fff; }

        /* Footer */
        footer { border-top: 1px solid #dee2e6; padding: 18px 0 10px; }
        footer .footer-links a { color: #555; text-decoration: none; font-size: 0.85rem; margin: 0 8px; }
        footer .footer-links a:hover { color: #000; }
        footer .footer-copy { font-size: 0.75rem; color: #888; margin-top: 6px; }
    </style>
</head>
<body>

    <!-- ===== NAVBAR ===== -->
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand" href="{{ route('biodata.index') }}">UTS Pem Web</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="{{ route('biodata.index') }}">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Features</a></li>
                    @php $first = \App\Models\Biodata::first(); @endphp
                    <li class="nav-item">
                        <a class="nav-link" href="#">{{ $first ? $first->name : '(Masukkan Nama)' }}</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-muted" href="#">{{ $first ? $first->nim : '(Masukkan NIM)' }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- ===== FLASH ALERT ===== -->
    <div class="container mt-3">
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show py-2" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show py-2" role="alert">
                {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        @endif
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <main class="container my-4">
        @yield('content')
    </main>

    <!-- ===== FOOTER ===== -->
    <footer class="text-center mt-5">
        <div class="footer-links">
            <a href="#">Home</a>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">FAQs</a>
            <a href="#">About</a>
        </div>
        <p class="footer-copy">
            &copy; 2025 Dibuat Sejujurjunya Oleh Team <strong>(Masukkan Nama ketua)</strong>
            dan <strong>(Masukkan Nama Anggota)</strong> Tanpa Mencontek dari Tim Lain
        </p>
    </footer>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+8L/3pJ8qG1h9up3Jv9cU0b4QK6U"
            crossorigin="anonymous"></script>
</body>
</html>
