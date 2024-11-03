{ pkgs, lib, config, inputs, ... }:

{
#    dotenv.enable = true;
    languages.php.enable = true;
    languages.php.version = "8.3";
    languages.php.extensions = [ "xdebug" "pdo_mysql" ];
    languages.php.ini = ''
        xdebug.mode = debug
        xdebug.discover_client_host = 1
        xdebug.client_host = 127.0.0.1
    '';
    languages.javascript.enable = true;
    languages.javascript.package = pkgs.nodejs_20;

    processes = {
        vite.exec = "npm run dev";
        php-serve.exec = "sudo php artisan serve --port=80";
        php-queue.exec = "php artisan queue:work";
        php-reverb.exec = "php artisan reverb:start";
    };

    services.mailpit.enable = false;
    services.mysql.enable = true;
    services.mysql.ensureUsers = [
        {
            name = "laravel";
            password = "laravel123";
            ensurePermissions = {
              "laravel.*" = "ALL PRIVILEGES";
            };
        }
    ];
}
