import React, { useLayoutEffect } from 'react';
import 'react-native-gesture-handler';
import { View } from 'react-native';
import { Text, Dialog, Portal, Button } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import CustomSidebarMenu from '../components/CustomSidebarMenu';
import NavigationDrawerHeader from '../components/NavigationDrawerHeader';
import Color from '../constants/Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Dashboard from '../screens/project/Dashboard';
import UserListScreen from '../screens/user/UserListScreen';
import ProjectDetailScreen from '../screens/project/ProjectDetailScreen';
import TaskDetailScreen from '../screens/project/TaskDetailScreen';
import UserTaskScreen from '../screens/project/UserTaskScreen';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();


const Logout = ({ route, navigation }) => {
    
    const [visible, setVisible] = React.useState(route.name == "Logout" ? true : false);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Portal>
                <Dialog visible={visible} onDismiss={()=>setVisible(!visible)}>
                    <Dialog.Title>Logout!</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure? You want to logout?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setVisible(false);
                            navigation.goBack()
                        }}>Cancel</Button>
                        <Button onPress={() => {
                            setVisible(false);
                            AsyncStorage.clear()
                            navigation.replace('AuthNavigator');
                        }}>Yes</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const DashboardStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Color.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'poppins-medium',
                },
                headerTitleAlign: 'center'
            }}>
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    title: "Dashboard",
                }}
            />
        </Stack.Navigator>
    );
}

const UserTaskStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Color.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'poppins-medium',
                },
                headerTitleAlign: 'center'
            }}>
            <Stack.Screen
                name="Tasks"
                component={UserTaskScreen}
                options={{
                    title: "My Tasks",
                }}
            />
        </Stack.Navigator>
    );
}

const UserListStack = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Color.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'poppins-medium',
                    alignItems: 'center'
                },
                headerTitleAlign: 'center'
            }}>
            <Stack.Screen
                name="Users"
                component={UserListScreen}
                options={{
                    title: "Users",
                }}
            />
        </Stack.Navigator>
    );
}


const TabNavigtor = ({ navigation, route }) => {

    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            activeColor="#fff"
            inactiveColor='#f2f2f2'
            labelStyle={{ fontSize: 12 }}
            style={{ backgroundColor: Color.primary }}
            shifting={true} >
            <Tab.Screen
                name="Dashboard"
                component={DashboardStack}
                options={{
                    tabBarLabel: 'Dashboard',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tasks"
                component={UserTaskStack}
                options={{
                    tabBarLabel: 'Tasks',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ballot" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Users"
                component={UserListStack}
                options={{
                    tabBarLabel: 'Users',
                    tabBarIcon: ({ color }) => (
                        <Icon name="account-multiple" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Logout"
                component={Logout}
                options={{
                    tabBarLabel: 'Logout',
                    tabBarIcon: ({ color }) => (
                        <Icon name="logout" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const ProjectDashBoard = ({ navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: Color.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontFamily: 'poppins-medium',
                },
                headerTitleAlign: 'center'
            }}>
            <Stack.Screen
                name="Dashboard"
                component={TabNavigtor}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProjectDetail"
                component={ProjectDetailScreen}
                options={{
                    title: "Project Details"
                }}
            />
            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{
                    title: "Task Details"
                }}
            />
        </Stack.Navigator>
    );
}

const DrawerNavigatorRoutes = (props) => {

    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: '#cee1f2',
                color: '#cee1f2',
                itemStyle: { marginVertical: 5, color: 'white' },
                labelStyle: {
                    color: '#d8d8d8',
                    fontFamily: 'poppins-regular'
                },
            }}
            screenOptions={{ headerShown: false }}
            drawerContent={CustomSidebarMenu}>
            <Drawer.Screen
                name="ProjectDashBoard"
                options={{ drawerLabel: 'Dashboard' }}
                component={ProjectDashBoard}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigatorRoutes;

