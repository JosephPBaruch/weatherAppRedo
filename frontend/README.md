# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Starting the docker daemon?

sudo launchctl start docker

docker build . -t joseph.baruch/new
docker image ls [OPTIONS] [REPOSITORY[:TAG]]
docker run -dp 127.0.0.1:3000:3000 getting-started

docker rmi $(docker images -a -q) -f