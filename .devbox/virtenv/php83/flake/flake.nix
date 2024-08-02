{
  description = "A flake that outputs PHP with custom extensions. Used by the devbox php plugin";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/ab82a9612aa45284d4adf69ee81871a389669a9e";
  };

  outputs = { self, nixpkgs }:
    let
      extensions = builtins.concatLists(builtins.filter (x: x != null) [
        (builtins.match "^php.*Extensions\.([^@]*).*$" "path:/home/lempac/Github/web-block/.devbox/virtenv/php83/flake")
        (builtins.match "^php.*Extensions\.([^@]*).*$" "path:/home/lempac/Github/web-block/.devbox/virtenv/php83/flake#composer")
        (builtins.match "^php.*Extensions\.([^@]*).*$" "php83@latest")
        (builtins.match "^php.*Extensions\.([^@]*).*$" "php83Packages.composer@latest")
        (builtins.match "^php.*Extensions\.([^@]*).*$" "nodejs_20@latest")
        (builtins.match "^php.*Extensions\.([^@]*).*$" "docker@latest")
        (builtins.match "^php.*Extensions\.([^@]*).*$" "docker-compose@latest")
      ]);

      php = nixpkgs.legacyPackages.x86_64-linux.php83.withExtensions (
        { enabled, all }: enabled ++ (with all; 
          map (ext: all.${ext}) extensions
        )
      );
    in
    {
      packages.x86_64-linux = {
        default = php;
        composer = php.packages.composer;
      };
    };
}
