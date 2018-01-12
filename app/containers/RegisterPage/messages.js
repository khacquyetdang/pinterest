/*
 * RegisterPage Messages
 *
 * This contains all the text for the RegisterPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.RegisterPage.header',
    defaultMessage: 'This is RegisterPage container !',
  },
  passwordnotmatch: {
    id: 'app.containers.RegisterPage.passwordnotmatch',
    defaultMessage: 'Les mots de passe ne correspondent pas',    
  },
  account_created_title : {
    id : 'app.containers.RegisterPage.account_created_title',
    defaultMessage: 'Votre compte a été bien créé.',      
  },
  account_created_body : {
    id : 'app.containers.RegisterPage.account_created_body',
    defaultMessage: 'Merci pour votre inscription! . Veuillez cliquer sur le lien ci-dessous pour vous connecter à votre compte: ',      
  },
});
