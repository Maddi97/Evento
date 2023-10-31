import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evento.app',
  appName: 'Evento',
  webDir: 'dist/threeventsfiveone',
  server: {
    url: "http://172.20.10.3:4200",
    cleartext: true,
    androidScheme: "http",
    allowNavigation: [
      "http://backend.localhost/*",
      "http://backend.*",
      "https://backend.*"
    ]
  },
};

export default config;
