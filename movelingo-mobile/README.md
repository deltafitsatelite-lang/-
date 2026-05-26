# MoveLingo Mobile (Expo)

## Android (Google Pixel / Expo Go) 起動手順

1. 依存をインストール

```bash
cd movelingo-mobile
npm install
```

2. 開発サーバー起動

```bash
npm run start
```

3. Pixel端末で **Expo Go** をインストール
4. PCとPixelを同じネットワークに接続
5. Expo GoからQRコードを読み取り

### うまく起動しない場合

- 同じWi-Fiに接続されているか確認
- `npm run start -- --tunnel` でTunnelモードを試す
- Androidでカメラ読み取りが失敗する場合、Expo Go内の「Enter URL manually」でURLを入力
- 依存差分がある場合は `npx expo install` 実行後に再起動

## 補足

- 現在は Expo Go 優先の開発構成です（EAS Build / Play Store公開は未対応）。
- iOS向け実装は維持しつつ、Androidでも同等機能で動作する前提です。
