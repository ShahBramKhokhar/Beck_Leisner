// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  hmr: false,
  adminAppUrl: "http://localhost:4200",
  appConfig: "appconfig.json",
  liveChat: {
    clientSecret: 'b75a6fdab51a13375753d4b2db53f4d27fa177e5',
    clientId: 'b19beee231aca078a87977ff78918e36',
    licenseId: 14898816,
    apiUrl: 'https://api.livechatinc.com',
  }
};
