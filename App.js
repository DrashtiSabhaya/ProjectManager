import React from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './store/reducers/auth';
import projectReducer from './store/reducers/project';
import taskReducer from './store/reducers/task';
import userReducer from './store/reducers/user';
import projectUserReducer from './store/reducers/shareProject';
import subTaskReducer from './store/reducers/subtask';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigatorRoutes from './navigation/ProjectNavigations';
import LoginScreen from './screens/user/LoginScreen';
import SignUpScreen from './screens/user/SignUpScreen';
import SplashScreen from './screens/SplashScreen';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {
  MenuProvider,
} from 'react-native-popup-menu';

export default function App() {

  let [fontsLoaded] = useFonts({
    'poppins-regular': require('./assets/fonts/Poppins-Regular.otf'),
    'poppins-medium': require('./assets/fonts/Poppins-Medium.otf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.otf'),
    'poppins-light': require('./assets/fonts/Poppins-Light.otf'),
    'poppins-thin': require('./assets/fonts/Poppins-Thin.otf')
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const fontConfig = {
    web: {
      regular: {
        fontFamily: 'poppins-regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'poppins-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'poppins-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'poppins-thin',
        fontWeight: 'normal',
      },
    },
    ios: {
      regular: {
        fontFamily: 'poppins-regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'poppins-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'poppins-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'poppins-thin',
        fontWeight: 'normal',
      },
    },
    android: {
      regular: {
        fontFamily: 'poppins-regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'poppins-medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'poppins-light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'poppins-thin',
        fontWeight: 'normal',
      },
    }
  };

  const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4439a1',
      accent: '#3962a1',
    },
  };

  const Stack = createStackNavigator();

  const AuthNavigator = () => {
    return (
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawerNavigationRoutes"
          component={DrawerNavigatorRoutes}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  };


  const rootReducer = combineReducers({
    user: userReducer,
    tasks: taskReducer,
    projects: projectReducer,
    auth: authReducer,
    projectUsers: projectUserReducer,
    subtask: subTaskReducer,
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  return (
    <MenuProvider>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator initialRouteName="SplashScreen">
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AuthNavigator"
                component={AuthNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DrawerNavigatorRoutes"
                component={DrawerNavigatorRoutes}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </MenuProvider>
  );
}