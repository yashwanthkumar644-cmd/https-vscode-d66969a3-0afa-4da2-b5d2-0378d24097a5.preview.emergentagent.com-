# Payment Manager

A simple iPhone app for tracking client deals and payments. Built with
[Expo](https://expo.dev) (React Native).

For each client it tracks three numbers:

- **Deal Amount** — the total value of the deal
- **Collected Payment** — how much has been received so far
- **Remaining Payment** — calculated automatically (Deal Amount − Collected Payment)

For every client, you can:

- **Copy Message** — a ready-to-send payment status message, copied to the clipboard so
  you can paste it anywhere (WhatsApp, SMS, notes, etc.)
- **Send via WhatsApp** — opens WhatsApp with the message already filled in, addressed
  to that client's number
- **Send via Email** — opens the iPhone's Mail app with the subject and message
  pre-filled and addressed to that client; you just tap **Send**

All data is stored locally on the phone (no server, no account, no internet
connection required to use the app day-to-day).

## Running it on your iPhone (no Mac needed)

1. On your iPhone, install the free **Expo Go** app from the App Store.
2. On the computer with this code, install dependencies once:
   ```
   cd payment-manager-app
   npm install
   ```
3. Start the dev server:
   ```
   npm start
   ```
   This prints a QR code in the terminal (and opens a page in your browser with one too).
4. Open the **Camera** app on the iPhone and point it at the QR code (or open Expo Go
   and use its built-in scanner). It will offer to open the project in Expo Go — tap it.
5. The app loads live on the phone. Any code changes you make are reflected instantly
   (just shake the phone or save a file to reload).

Your phone and computer must be on the same Wi-Fi network for this to work. If they
aren't (e.g. testing over cellular data), run `npm start` and choose the "tunnel"
connection option in the terminal menu instead.

## Turning this into a real App Store app later

When you're ready to distribute it properly (so your friend doesn't need Expo Go, or
you want it on the App Store):

1. Create a free [Expo account](https://expo.dev/signup).
2. Install the EAS CLI: `npm install -g eas-cli`
3. Run `eas build --platform ios` — this builds a real `.ipa` in Expo's cloud, no Mac
   required. You'll need a paid Apple Developer account ($99/year) to install it on a
   real device outside of Expo Go or to submit to the App Store.
4. Optionally `eas submit --platform ios` to publish directly to App Store Connect.

## Project structure

```
App.js                     Root component — screen switching + state
src/screens/
  ClientListScreen.js       Home screen: list of clients + running totals
  ClientFormScreen.js       Add / edit a client (the three payment fields)
  ClientDetailScreen.js     Client detail: message preview + WhatsApp/Email actions
  SettingsScreen.js         Business name + currency symbol
src/utils/
  storage.js                Local persistence (AsyncStorage)
  message.js                Builds the official payment message + email subject
  id.js                     Local id generator for new clients
```

## Customizing the message template

Edit `src/utils/message.js` — `buildPaymentMessage()` — to change the wording of the
message that gets copied / sent via WhatsApp and Email. Business name and currency
symbol come from the in-app Settings screen (tap the ⚙ icon on the home screen).
