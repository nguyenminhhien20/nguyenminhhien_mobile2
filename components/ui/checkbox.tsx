import React from "react";
import { Pressable, View } from "react-native";
import { Check } from "lucide-react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: number;
}

export function Checkbox({ checked, onChange, size = 22 }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: checked ? "#f97316" : "#9ca3af", // orange-500
        backgroundColor: checked ? "#f97316" : "transparent",
      }}
    >
      {checked && <Check color="white" size={size * 0.7} />}
    </Pressable>
  );
}
