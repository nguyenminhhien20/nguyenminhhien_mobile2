import * as React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";

type ButtonVariant = "solid" | "outline";

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = "solid",
  style,
  textStyle,
}) => {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.base,
    variant === "solid" ? styles.solid : styles.outline,
    disabled && styles.disabled,
    style,
  ];

  const titleStyle: StyleProp<TextStyle> = [
    styles.text,
    variant === "solid" ? styles.textSolid : styles.textOutline,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  solid: {
    backgroundColor: "#6B46C1", // màu tím gradient bạn có thể custom
  },
  outline: {
    borderWidth: 2,
    borderColor: "#6B46C1",
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textSolid: {
    color: "#fff",
  },
  textOutline: {
    color: "#6B46C1",
  },
});
