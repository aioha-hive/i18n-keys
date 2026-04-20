# @aioha/i18n-keys

Canonical message IDs, English defaults, ICU-ready catalog, and a framework-neutral `Messages` adapter interface shared by `@aioha/react-ui` and `@aioha/lit-ui`.

## Install

```sh
pnpm add @aioha/i18n-keys
```

## Quick start

```ts
import { createDefaultMessages } from '@aioha/i18n-keys'

const messages = createDefaultMessages({ initialLocale: 'en' })
messages.t('wallet.connect') // "Connect Wallet"
messages.t('auth.oneClick.failed', { error: 'timeout' }) // "Failed to login with one click: timeout"
```

Pass the `messages` instance as a prop (React) or context (Lit) to an Aioha modal to override any strings via your preferred i18n stack (react-intl, lingui, etc.) — implement the `Messages` interface and hand it in.

## The `Messages` interface

```ts
interface Messages {
  t(id: MessageId, vars?: Record<string, string | number>): string
  getLocale(): string
  setLocale(locale: string): void | Promise<void>
  getDir(): 'ltr' | 'rtl'
  subscribe(listener: () => void): () => void
}
```

The default implementation uses `intl-messageformat` (FormatJS) for ICU, so plurals and selects work out of the box:

```icu
{count, plural, one {# account} other {# accounts}}
```

## Loading locales on demand

Only `en` (and the pseudo-locale `en-XA`) is bundled into the default `Messages` instance. The package ships JSON catalogs for additional locales that consumers load on demand:

| Locale | |
|---|---|
| `ar` | Arabic (RTL) |
| `de` | German |
| `en` | English (bundled) |
| `es` | Spanish |
| `fr` | French |
| `hi` | Hindi |
| `hr` | Croatian |
| `it` | Italian |
| `ja` | Japanese |
| `ko` | Korean |
| `ms` | Malay |
| `pl` | Polish |
| `pt` | Portuguese |
| `ru` | Russian |
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |

```ts
await messages.loadLocale('fr', (lng) =>
  import(`@aioha/i18n-keys/build/locales/${lng}.json`).then((m) => m.default)
)
messages.setLocale('fr')
```

## Pseudo-locale

`en-XA` is generated at init time by wrapping every English value in `[!! ... !!]` with accented characters. Use it to catch hardcoded strings, truncation, and concatenation bugs without needing translators:

```ts
messages.setLocale('en-XA')
messages.t('wallet.connect') // "[!! Çóññéçt Wállét !!]"
```

ICU placeholders (`{error}`, `{count, plural, ...}`) are preserved.

## RTL detection

`messages.getDir()` returns `'rtl'` for Arabic, Hebrew, Persian, Urdu, and similar — either from the runtime's `Intl.Locale.textInfo.direction` or a built-in language list fallback.

## Message IDs

| ID | English default | Variables |
|---|---|---|
| `action.back` | Back | |
| `action.cancel` | Cancel | |
| `action.done` | Done | |
| `action.edit` | Edit | |
| `action.proceed` | Proceed | |
| `action.stop` | Stop | |
| `auth.device.approval` | Please approve login request on the device. | |
| `auth.hiveauth.instruction` | Scan the QR code using a HiveAuth-compatible mobile app. | |
| `auth.hiveauth.openLink` | Open HiveAuth payload link | |
| `auth.oneClick.failed` | Failed to login with one click: {error} | `error` |
| `auth.oneClick.logging` | Logging you in with one click... | |
| `auth.oneClick.redirecting` | Redirecting back to Aioha app... | |
| `auth.username.label` | Hive Username | |
| `auth.username.placeholder` | Enter Hive Username | |
| `modal.close` | Close modal | |
| `modal.loading` | Loading... | |
| `user.addAccount` | Add Account | |
| `user.addAccountBtn` | Add account | |
| `user.avatarAlt` | {user}'s avatar | `user` |
| `user.loginAs` | Login as {username} | `username` |
| `user.logout` | Logout | |
| `user.removeAccount` | Remove account | |
| `user.removeConfirm` | Remove {user} | `user` |
| `user.switch` | Switch User | |
| `user.switchTo` | Switch to {user} | `user` |
| `user.viewExplorer` | View In Explorer | |
| `wallet.badge.popular` | Popular | |
| `wallet.badge.snap` | Hive Snap | |
| `wallet.connect` | Connect Wallet | |
| `wallet.connectEthereum` | Connect Ethereum Wallet | |
| `wallet.connectInstruction` | Connect with one of our available Hive wallet providers. | |
| `wallet.ethInstruction` | Complete the connection in the wallet popup. | |
| `wallet.helpLink` | Need help connecting a wallet? | |
| `wallet.provider.other` | Other Wallet | |
| `wallet.provider.viewOnly` | View Only | |
| `wallet.sectionEthereum` | Ethereum | |
| `wallet.sectionHive` | Hive | |
| `wallet.selectType` | Select a wallet type to connect. | |

## Catalog version

The catalog is versioned. Bump `CATALOG_VERSION` on any key add / remove / rename. Translators use it to detect required re-reviews.

```ts
import { CATALOG_VERSION } from '@aioha/i18n-keys'
console.log(CATALOG_VERSION) // 1
```
