import * as React from "react";
import { View, TextInput, StyleProp, TextStyle, ViewStyle, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  icon?: React.ReactNode; // icon bên trái
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  icon,
  style,
  containerStyle,
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = secureTextEntry ?? false;

  return (
    <View style={[{ marginVertical: 8 }, containerStyle]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          paddingHorizontal: 12,
          backgroundColor: "#fff",
          height: 48,
        }}
      >
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}

        <TextInput
          style={[{ flex: 1, fontSize: 16, color: "#333" }, style]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={isPassword && !showPassword}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
