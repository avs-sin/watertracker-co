# React Native App

This is a React Native application that showcases various components and screens, providing a foundation for building mobile applications. The app is structured to facilitate easy navigation and customization.

## Project Structure

```
react-native-app
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── screens
│   │   ├── HomeScreen.tsx
│   │   └── DetailsScreen.tsx
│   ├── navigation
│   │   └── index.tsx
│   ├── hooks
│   │   └── useTheme.tsx
│   ├── utils
│   │   └── helpers.ts
│   ├── assets
│   │   └── fonts
│   └── App.tsx
├── ios
├── android
├── app.json
├── babel.config.js
├── index.js
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd react-native-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the App

To run the app on iOS or Android, use the following commands:

- For iOS:
  ```
  npx react-native run-ios
  ```

- For Android:
  ```
  npx react-native run-android
  ```

## Components

- **Button**: A customizable button component that accepts `title`, `onPress`, and `style` props.
- **Card**: A component that displays content in a card format, accepting `children` and `style` props.

## Screens

- **HomeScreen**: The main screen of the app that includes navigation to other screens and displays a list of items.
- **DetailsScreen**: Displays detailed information about a selected item, receiving parameters via navigation.

## Navigation

The app uses React Navigation for managing navigation between screens. The navigation setup is defined in `src/navigation/index.tsx`.

## Hooks

- **useTheme**: A custom hook that provides theme-related values and functions for theme switching.

## Utilities

Utility functions are located in `src/utils/helpers.ts` for tasks such as formatting dates and manipulating strings.

## Assets

Custom font files are stored in `src/assets/fonts`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.