{ pkgs, lib, config, inputs, ... }:

{
    name = "web-block-backend";
#    dotenv.enable = true;
    languages.php.enable = true;
    languages.php.version = "8.4";
    languages.php.extensions = [ "xdebug" "pdo_mysql" "pdo_sqlite" ];
    languages.php.ini = ''
        xdebug.mode = debug
        xdebug.discover_client_host = 1
        xdebug.client_host = 127.0.0.1
    '';
    #languages.javascript.enable = true;
    #languages.javascript.package = pkgs.nodejs_20;

    processes = {
        #vite.exec = "npm run dev";
        php-serve.exec = "php artisan serve";
        php-queue.exec = "php artisan queue:work";
        php-reverb.exec = "php artisan reverb:start";
    };

    # services.mailpit.enable = false;
    # services.mysql.enable = false;
    # services.mysql.ensureUsers = [
    #     {
    #         name = "laravel";
    #         password = "laravel123";
    #         ensurePermissions = {
    #             "laravel.*" = "ALL PRIVILEGES";
    #         };
    #     }
    # ];
}
