import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import messages from './messages';
import './styles.scss';

function Footer() {
  return (
    <footer>
      <section>
        <FormattedMessage {...messages.licenseMessage} />
      </section>
      <section>
        <LocaleToggle />
      </section>
      <section>
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            author: <A href="https://github.com/khacquyetdang" target="_blank">Khac Quyet DANG</A>,
          }}
        />
      </section>
    </footer>
  );
}

export default Footer;
