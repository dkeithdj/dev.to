---
published: true
title: 'Python Development with Nix'
cover_image: https://raw.githubusercontent.com/dkeithdj/dev.to/main/blog-posts/python-development-with-nix/assets/fastapi-nix.png
description: 'Python development setup with Nix'
tags: python, nix
series:
canonical_url:
---

Setting up a Python development environment can be a headache, especially when dealing with dependency conflicts, multiple Python versions, and system-wide pollution.

Nix offers a declarative, reproducible, and isolated way to manage Python environments

In this article, we'll explore how to setup a [FastAPI](https://fastapi.tiangolo.com) project with Nix. Automate environment activation with `direnv`. And ensure full reproducibility and isolation.

---

# What is Nix?

[Nix](https://nixos.org) is a tool that takes a unique approach to package management and system configuration.

> Nix has its own language called Nix, a straightforward functional language. While I won't delve further into the language itself, here are the resources you can check out on how to start on writing Nix.
>
> - [Nix Language Basics - nix.dev](https://nix.dev/tutorials/nix-language)
> - [A tour of Nix](https://nixcloud.io/tour/?id=introduction/nix)
> - [Nix Language - Nix Reference Manual](https://nixos.org/manual/nix/stable/language/)

## Key Benefits

### Reproducible

Nix ensures that your system is reproducible by providing a unique approach to package management and system configuration. So you can be sure that your system will work the same way on every machine.

### Declarative

Nix allows you to declare your system configuration in a simple and concise way. You can define your system configuration in a single file, and Nix will take care of the rest.

### Reliable

Nix is a reliable tool that ensures that your system is always in a consistent state. It provides a unique approach to package management and system configuration, so you can be sure that your system will always work as expected.

---

# Project Structure

The project structure is as follows:

```bash
.
├── flake.lock
├── flake.nix
├── main.py
└── README.md
```

> check the repository [here](https://github.com/dkeithdj/pydev-nix) 👈

# FastAPI Flake

> _What is a [flake](https://wiki.nixos.org/wiki/Flakes)?_ A [flake](https://wiki.nixos.org/wiki/Flakes) is a modern, structured way to manage Nix projects, making dependency management and reproducibility much easier

```nix
{
  description = "Python development setup with Nix";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.python311 # installs python311
            pkgs.python311Packages.fastapi # installs fastapi library
            pkgs.python311Packages.uvicorn # installs uvicorn
          ];

          shellHook = ''
            python --version
          '';
        };
      }
    );
}
```

# FastAPI `main.py`

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Nix + FastAPI!"}
```

# Entering the Nix development shell

To enter the Nix development shell, run the following command:

```bash
nix develop
```

This will enter the Nix development shell, where you can run your Python application and interact with the development environment.

You can now run packages you specified in the `flake.nix` file.

# Running the FastAPI application

To run the FastAPI application, execute the following command:

```bash
uvicorn main:app --reload
```

This will start the FastAPI application in development mode, allowing you to make changes and see them reflected in real-time.

![fastapi_nix](https://raw.githubusercontent.com/dkeithdj/dev.to/main/blog-posts/python-development-with-nix/assets/fastapi-nix.png)

You can notice above, without nix loaded. `python` is on version `3.12.8` and `uvicorn` was not installed.

With nix loaded, `python` is on version `3.11.11` and `uvicorn` is now installed!

# Conclusion

That's it! You've successfully set up a Python development environment using Nix. You can now start building your application and take advantage of the benefits of a reproducible and isolated development environment.
