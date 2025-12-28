{ pkgs, ... }:

{
  languages.javascript.enable = true;
  languages.deno.enable = true;
  languages.javascript.pnpm.enable = true;
  languages.javascript.package = pkgs.nodejs_22;
}
