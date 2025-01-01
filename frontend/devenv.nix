{ pkgs, lib, config, inputs, ... }:

{
  languages.javascript.enable = true;
  languages.javascript.bun.enable = true;

  processes = {
    vite.exec = "bun run dev";
  };
}
