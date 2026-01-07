# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

## Смена иконки приложения 🔧

Если вы хотите использовать собственную иконку (вместо стандартной), выполните следующие шаги:

1. Подготовьте изображения и положите их в `assets/images/`:
   - `icon.png` — 1024×1024 PNG (рекомендуется) — используется как основная иконка и для iOS App Store.
   - Для Android Adaptive Icon (опционально):
     - `android-icon-foreground.png` — рекомендовано ~432×432, с прозрачным фоном (foreground)
     - `android-icon-background.png` — 1080×1080 (background)
     - `android-icon-monochrome.png` — (опционально) монохромная иконка для некоторых устройств

2. Обновите `app.json`, задав поля:

```json
{
  "expo": {
    "icon": "./assets/images/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "backgroundColor": "#1C252B"
      }
    },
    "ios": {
      "icon": "./assets/images/icon.png"
    }
  }
}
```

> Примечание: при использовании Expo Go вы не увидите свою иконку — чтобы увидеть её на устройстве/эмуляторе, нужно собрать приложение (см. ниже).

3. Сборка / быстрый просмотр:
   - Для быстрого просмотра на эмуляторе (если у вас настроено окружение):

```bash
npx expo run:android
# или
npx expo run:ios
```

   - Для нативных сборок через EAS (рекомендуется для релиза):

```bash
eas build -p android
eas build -p ios
```

4. Подсказки:
   - Для iOS в App Store требуется 1024×1024 и обычно без прозрачности.
   - Для Android адаптивных значков обязательно прозрачный foreground и поддержка фонового слоя.

Если хотите — могу добавить пример иконок-заглушек в `assets/images/` и обновить `app.json` прямо сейчас. Хотите, чтобы сделал это?