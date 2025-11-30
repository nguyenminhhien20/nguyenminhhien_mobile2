import * as React from "react";
import { Text, StyleProp, TextStyle } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function Label({ children, style }: LabelProps) {
  return (
    <Text style={[{ fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 4 }, style]}>
      {children}
    </Text>
  );
}
