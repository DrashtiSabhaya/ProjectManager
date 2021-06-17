import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Button,
    FlatList,
    Pressable
} from 'react-native';
import { Text, List, Divider, Searchbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import * as userActions from '../../store/actions/user';
import Color from '../../constants/Color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserListScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBox, setSearchBox] = useState(false);
    const [filterData, setFilterData] = useState([]);

    const usersData = useSelector(state => state.user.usersData);
    const dispatch = useDispatch();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => setSearchBox(!searchBox)}>
                    <Icon name={'magnify'} size={25} color={'#fff'} style={{ marginRight: 18 }} />
                </Pressable>
            )
        });
    }, []);


    const loadUsers = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(userActions.fetchUsers());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        setIsLoading(true);
        loadUsers().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadUsers]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Color.accent} />
            </View>
        );
    }

    if (!isLoading && usersData.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No Users.</Text>
                <Button
                    title="Try again"
                    onPress={loadUsers}
                    color={Color.accent}
                />
            </View>
        );
    }

    if (error) {
        console.log(error)
        return (
            <View style={styles.container}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadUsers}
                    color={Color.accent}
                />
            </View>
        );
    }

    const userDataRender = (itemData) => {
        return (
            <View>
                <List.Item
                    title={itemData.item.name}
                    description={itemData.item.username}
                    left={props => <List.Icon {...props}
                        color={Color.primary}
                        icon="account" />}
                    right={props => <List.Icon {...props}
                        color={itemData.item.active_status ? Color.accent : 'red'}
                        icon={itemData.item.active_status ? "check" : "close"}
                        style={{ marginRight: 5 }}
                    />}
                />
                <Divider />
            </View>
        );
    }

    const onChangeSearch = query => {
        setSearchQuery(query);
        let filteredData = usersData.filter(function (item) {
            return item.name.includes(searchQuery);
        });
        setFilterData(filteredData)
    }

    return (
        <View>
            {searchBox ? (<Searchbar
                placeholder="Search User"
                onChangeText={onChangeSearch}
                value={searchQuery}
                onIconPress={() => {
                    setFilterData([])
                    setSearchBox(!searchBox)
                }}
                clearAccessibilityLabel="clear"
            />) : null}
            <FlatList
                onRefresh={loadUsers}
                refreshing={isRefreshing}
                data={filterData && filterData.length > 0 ? filterData : usersData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={userDataRender}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default UserListScreen;