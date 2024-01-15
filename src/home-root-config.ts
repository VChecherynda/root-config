import { registerApplication, start, navigateToUrl   } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
const api = require('@home/api')

const routes = constructRoutes(microfrontendLayout);

const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

const layoutEngine = constructLayoutEngine({ routes, applications });

window.addEventListener(
  'app-chage:user-login',
  () => {
    const userData = api.getLoginUser();
    const isLoggedIn = Boolean(userData?.name && userData?.token);

    if (isLoggedIn) {
      return navigateToUrl('/catalog');
    }

    navigateToUrl('/');
  },
);

window.addEventListener('single-spa:before-routing-event', () => {
  const userData = api.getLoginUser();
  const isLoggedIn = Boolean(userData?.name && userData?.token);

  if (!isLoggedIn) {
     navigateToUrl('/');
  }
});

applications.forEach(({ name, app, activeWhen}) => {
  registerApplication({name, app, activeWhen})
});

layoutEngine.activate();

start();
