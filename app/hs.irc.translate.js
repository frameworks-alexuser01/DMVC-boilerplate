angular.module('hs.irc.translate', ['pascalprecht.translate'])
  .config(['$translateProvider', function ($translateProvider) {

    /* Languages */
    var languages = ['en', 'no'];

    /* Translations */
    var translations = {
      WELCOME: {
        'no': 'Velkommen',
        'en': 'Welcome'
      },
      SETTINGS: {
        'no': 'Innstillinger',
        'en': 'Settings'
      },
      LOGOUT: {
        'no': 'Logg ut',
        'en': 'Logout'
      },
      LANGUAGE: {
        ENGLISH: {
          'no': 'Engelsk',
          'en': 'English'
        },
        NORWEGIAN: {
          'no': 'Norsk',
          'en': 'Norwegian'
        }
      }
    };

    /*
     * Attach translations to provider
     */
    languages.forEach(function (language) {
      var findTranslation = function (object, translation) {
        Object.keys(object).forEach(function (key) {
          if (object[key][language]) {
            translation[key] = object[key][language];
          } else {
            translation[key] = {};
            findTranslation(object[key], translation[key]);
          }
        });
      };
      var translation = {}
      findTranslation(translations, translation);
      $translateProvider.translations(language, translation);
    });
    $translateProvider.preferredLanguage(languages[0]);

  }]);
