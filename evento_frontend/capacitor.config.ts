import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.evento.app",
  appName: "Evento",
  webDir: "dist/evento",
  server: {
    url: "http://localhost:4200",
    cleartext: true,
    androidScheme: "http",
    allowNavigation: [
      "http://backend.localhost/*",
      "http://backend.*",
      "https://backend.*",
    ],
  },
};

export default config;
