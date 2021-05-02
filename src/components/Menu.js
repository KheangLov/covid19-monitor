import inMemoryJWTManager from '../inMemoryJwt';

let Menu = [
  {
    label: "ទិន្នន័យ",
    pathname: "/"
  },
  {
    label: "ទិន្នន័យក្នុងប្រព័ន្ធ",
    pathname: "/data-list"
  },
  {
    label: inMemoryJWTManager.getToken() ? "បានចូលប្រព័ន្ធ" : "ចូលប្រព័ន្ធ & ស្នើរសំុ",
    pathname: "/auth"
  },
];

if (!inMemoryJWTManager.getToken())
  Menu = Menu.filter(item => item.pathname !== '/data-list');

export default Menu;