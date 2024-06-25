# Web-Block

## About
This is a website/platform where you can edit your project or project from GitHub and add some logic on top for a better development experience.

![image](https://github.com/Lempac/web-block/assets/151722008/9fc2a8bc-8915-4560-8465-bda88b17969e)

![image](https://github.com/Lempac/web-block/assets/151722008/893be7e8-8a2f-41c2-b38d-2ed5f98a7645)


## Getting Started

### Prerequisites
To use, you will need:
- Node.js
- PHP
- Composer
- A Code Editor

For Windows also you'll need:
- XAMPP Control Panel (for hosting)

For Linux also you'll need:
- Docker (for environment and hosting)

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/Lempac/web-block.git
    cd web-block
    ```

2. **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3. **Install PHP dependencies:**
    ```bash
    composer install
    ```

4. **Setup environment variables:**
    ```bash
    cp .env.example .env
    php artisan key:generate
    # Edit .env file to match your environment settings
    ```

5. **Migrate the database(Need to run first to run this command):**
    ```bash
    php artisan migrate
    ```

## Usage
1. **Launch the project:**
    ```bash
    php artisan serve
    ```

2. **View the project:**
    Open your web browser and go to `http://localhost:8000`.

## Technologies Used

- **Docker**: Used for creating a consistent development environment across different machines and operating systems.
- **Laravel**: The PHP framework used for building the backend of the application.
- **PHP**: The scripting language used for the backend logic.
- **Node.js**: A JavaScript runtime used for running scripts and managing front-end dependencies.
- **Composer**: A dependency manager for PHP.
- **NPM**: A package manager for Node.js, used to manage front-end dependencies.
- **PHPStorm**: An integrated development environment (IDE) for PHP and web development.
- **Livewire**: A full-stack framework for Laravel that makes building dynamic interfaces simple.
- **Alpine.js**: A minimal framework for composing JavaScript behavior in your HTML.

---

