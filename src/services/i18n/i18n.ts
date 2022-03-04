import * as Config from '../../data/config.json';
import {
    init,
    getLocaleFromNavigator,
    register,
    locale,
    locales,
} from 'svelte-i18n';

// Register all i18n lang files as dictionaries
// register('en-US', () => import('./lang/en.json'));
register('fr-FR', () => import('./lang/fr.json'));

init({
    fallbackLocale: Config.locale,
});


// FIXME: Hackish way to update the app's locale from the browser's lang only when it exists and is not already set to the specified lang.
locales.subscribe((localeList) => {
    const browserLocale = getLocaleFromNavigator();
    if (browserLocale) {
        const langCode = browserLocale.split('-')[0];
        locale.subscribe((newLocale) => {
            console.log('SUBSCRIBED TO LOCALE', newLocale, browserLocale);
            if (localeList.indexOf(langCode) >= 0 && newLocale !== browserLocale) {
                console.log('Update locale with browser lang', browserLocale);
                locale.set(browserLocale);
            }
        });
    }
});
