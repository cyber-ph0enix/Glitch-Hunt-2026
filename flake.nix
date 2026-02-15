{
  description = "Glitch Hunt 2026 Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux"; # Change if using a different architecture (e.g., aarch64-linux)
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_20
          nodePackages.npm
          git
          # Optional: Terminal tools for the "Hacker Vibe" while coding
          neovim 
          jq
        ];

        shellHook = ''
          echo "🚀 Ph0enixOS Dev Environment Loaded"
          echo "Node Version: $(node --version)"
          echo "npm Version: $(npm --version)"
        '';
      };
    };
}
