// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: any = {
  production: false,
  AUTH_COOKIE: 'YACK_AUTH',
  ACCOUNTID_COOKIE: 'ACCOUNTID',
  API_PATH:  'http://localhost:3000',
  STRIPE_PRICE_ID: "price_1HtRmlJgIktGxsB3g5dsdtAM",
  STRIPE_KEY: "pk_test_51HcpRZJgIktGxsB3jJs7Gt7NtJPPkOzEj9FD2UxBsBr8pOrpNUg3IAErWB84GMRGsbj0oIhT8rENdibZLrPsMCoJ00Z9soZYRz",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
