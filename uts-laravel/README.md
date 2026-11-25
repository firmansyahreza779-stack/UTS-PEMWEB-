<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Biodata API

The biodata endpoints use JSON responses. Create and update requests can include an optional `photo` image (`jpg`, `jpeg`, `png`, or `webp`, up to 2 MB); use `multipart/form-data` for uploads. Uploaded image URLs are returned as `photo_url`. Run `php artisan storage:link` to make uploaded images publicly accessible.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/biodata` | List biodata |
| `POST` | `/api/biodata` | Create biodata |
| `GET` | `/api/biodata/{id}` | Show one biodata |
| `PUT` / `PATCH` | `/api/biodata/{id}` | Update biodata |
| `DELETE` | `/api/biodata/{id}` | Delete biodata |

Fields: `name` (required), `nim` (required, unique, and exactly 11 digits), `description` (optional), and `photo` (optional image upload).

### Running the frontend with the API

From the repository root, start Laravel:

```bash
cd uts-laravel
php artisan serve --host=127.0.0.1 --port=8000
```

Serve the repository-root `index.html` with VS Code Live Server on port `5500` (do not open it directly as a `file://` URL). The frontend sends requests to `http://127.0.0.1:8000/api/biodata`; CORS is limited to `localhost:5500` and `127.0.0.1:5500`. Update the `api-base-url` meta tag in `index.html` if the API uses a different address.

The page loads biodata from the API and supports adding, editing, and deleting cards. Changes are saved through the JSON API, and uploaded images are served by Laravel's public storage disk.
