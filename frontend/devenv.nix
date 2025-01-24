{ pkgs, lib, config, inputs, ... }:

{
  languages.javascript.enable = true;
  languages.javascript.pnpm.enable = true;
  languages.javascript.package = pkgs.nodejs_22;
  languages.javascript.pnpm.package = pkgs.pnpm;
}
