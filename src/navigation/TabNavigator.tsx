import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import Text from '@/components/Text';
import type { TabParamList } from './types';

import HomeScreen from '@/screens/HomeScreen';
import PriceExploreScreen from '@/screens/PriceExploreScreen';
import AlertScreen from '@/screens/AlertScreen';
import AlertHistoryScreen from '@/screens/AlertHistoryScreen';
import MyPageScreen from '@/screens/MyPageScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const labels: Record<keyof TabParamList, string> = {
  HomeTab: '홈',
  ExploreTab: '탐색',
  AlertTab: '알림',
  HistoryTab: '이력',
  MyTab: '마이',
};

function TabIcon({ name, focused }: { name: keyof TabParamList; focused: boolean }) {
  const color = focused ? colors.primary : colors.textMuted;
  return (
    <View style={styles.tab}>
      <Text variant="body" color={color} weight={focused ? 'semibold' : 'regular'}>
        {labels[name]}
      </Text>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name as keyof TabParamList} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ExploreTab" component={PriceExploreScreen} />
      <Tab.Screen name="AlertTab" component={AlertScreen} />
      <Tab.Screen name="HistoryTab" component={AlertHistoryScreen} />
      <Tab.Screen name="MyTab" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 60,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
  },
  tab: { alignItems: 'center', justifyContent: 'center', width: 64 },
});
