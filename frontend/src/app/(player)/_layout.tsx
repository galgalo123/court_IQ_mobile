import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { palette } from '@/constants/palette';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor={palette.surface}
      indicatorColor={palette.raised}
      labelStyle={{ selected: { color: palette.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="games">
        <NativeTabs.Trigger.Label>Games</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_today" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="performance">
        <NativeTabs.Trigger.Label>Performance</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="bar_chart" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="medical">
        <NativeTabs.Trigger.Label>Medical</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cross.case.fill" md="medical_services" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
