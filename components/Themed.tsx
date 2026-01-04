import { Text as DefaultText, View as DefaultView } from 'react-native';

export function Text({ className, ...props }: any) {
  // Default to dark text for light mode
  return <DefaultText className={`text-[#212121] ${className}`} {...props} />;
}

export function View({ className, ...props }: any) {
  return <DefaultView className={className} {...props} />;
}

// Helper for 'Container' - White background by default
export const Container = ({ className, ...props }: any) => (
  <View className={`flex-1 bg-[#F1F3F6] ${className}`} {...props} />
);

// Helper for 'Card' - White surface with shadow
export const Card = ({ className, ...props }: any) => (
  <View className={`bg-white rounded-lg shadow-sm ${className}`} {...props} />
);
