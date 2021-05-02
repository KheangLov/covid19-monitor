import inMemoryJWTManager from '../inMemoryJwt';

let Menu = [
  {
    label: "Data",
    pathname: "/"
  },
  // {
  //   label: "Dashboard",
  //   pathname: "/dashboard"
  // },
  {
    label: "Data List",
    pathname: "/data-list"
  },
  {
    label: inMemoryJWTManager.getToken() ? "Logged" : "Login & Register",
    pathname: "/auth"
  },
  // {
  //   label: "Wizard",
  //   pathname: "/wizard"
  // },
  // {
  //   label: "Github",
  //   pathname: "https://github.com/alexanmtz/material-sense",
  //   external: true
  // }

];

if (!inMemoryJWTManager.getToken())
  Menu = Menu.filter(item => item.pathname !== '/data-list');

export default Menu;