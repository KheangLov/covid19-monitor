import inMemoryJWTManager from '../inMemoryJwt';

let Menu = [
  {
    label: "Data",
    pathname: "/"
  },
  {
    label: "Data List",
    pathname: "/data-list"
  },
  {
    label: inMemoryJWTManager.getToken() ? "Logged" : "Login & Register",
    pathname: "/auth"
  },
];

if (!inMemoryJWTManager.getToken())
  Menu = Menu.filter(item => item.pathname !== '/data-list');

export default Menu;