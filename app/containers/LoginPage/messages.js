/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.LoginPage.header',
    defaultMessage: 'This is LoginPage container !',
  },
  login: {
    id: 'app.containers.LoginPage.login',
    defaultMessage: 'Connexion',
  },
  not_register_yet: {
    id: 'app.containers.LoginPage.not_register_yet',
    defaultMessage: 'Pas encore membre ?',
  },
  connect_to_account: {
    id: 'app.containers.LoginPage.connect_to_account',
    defaultMessage: "Connecter à votre compte"
  },
  register_now: {
    id: 'app.containers.LoginPage.register_now',
    defaultMessage: "S'inscrire maintenant"
  }
});
