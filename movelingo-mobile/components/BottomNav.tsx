import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type NavItem = { label: string; route: '/' | '/training' | '/growth' | '/coach' | '/settings' };

const navItems: NavItem[] = [
  { label: 'ホーム', route: '/' },
  { label: 'レッスン', route: '/training' },
  { label: '成長', route: '/growth' },
  { label: 'コーチ', route: '/coach' },
  { label: '設定', route: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => {
        const selected = pathname === item.route;
        return (
          <Pressable key={item.route} onPress={() => router.push(item.route)} style={styles.itemPressable}>
            <Text style={[styles.navItem, selected ? styles.active : undefined]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B3128',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#134E4A',
  },
  itemPressable: { paddingHorizontal: 4, paddingVertical: 2 },
  navItem: { color: '#86EFAC', fontSize: 11, fontWeight: '700' },
  active: { color: '#F0FDFA' },
});
