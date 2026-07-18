# Submitting Bento to App Stores via PWA

Bento is a Progressive Web App — it can be submitted to both the iOS App Store and Google Play Store **without any native code**.

## Use PWABuilder

1. Go to **[pwabuilder.com](https://pwabuilder.com)**
2. Enter the Bento production URL: `https://5d3bdd37f115ebfeaef09173b6dff7f4.ctonew.app`
3. PWABuilder will audit the manifest, service worker, and icons automatically
4. Download the platform packages:

### iOS App Store
- PWABuilder generates an Xcode project with a WKWebView wrapper
- Open in Xcode, update the bundle ID and signing, then submit via App Store Connect
- **Requires:** Apple Developer account ($99/year)
- The PWA must pass Lighthouse PWA audit with 100% on installability

### Google Play Store
- PWABuilder generates a Trusted Web Activity (TWA) package
- Uses Bubblewrap under the hood to create an Android App Bundle (.aab)
- Upload to Google Play Console
- **Requires:** Google Play Developer account ($25 one-time)
- The TWA requires Digital Asset Links verification (a `.well-known/assetlinks.json` file on the domain)

## Pre-Flight Checklist
- [ ] `manifest.json` is valid and served with `Content-Type: application/manifest+json`
- [ ] All icon sizes exist: 192x192 and 512x512 PNGs
- [ ] Service worker registers without errors
- [ ] App loads offline (landing page, blog, leaderboard)
- [ ] Lighthouse PWA score: 100%
- [ ] HTTPS is enforced (already handled by the hosting platform)

## Asset Links for Android TWA
If submitting to Google Play, add this file at `public/.well-known/assetlinks.json` after PWABuilder provides the SHA-256 fingerprint.
