import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.3vents51.app',
  appName: 'threeventsfiveone',
  webDir: 'dist/threeventsfiveone',
  server: {
    url: "http://192.168.1.149:4200",
    cleartext: true
  },
};

export default config;
