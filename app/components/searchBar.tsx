import React from "react";
import { TextInput } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  placeholder: string;
}

export default function SearchBar({ value, onChangeText, onSubmitEditing, placeholder }: SearchBarProps) {
  return (
    <TextInput
      className="w-11/12 h-12 bg-white rounded-full px-4 text-lg shadow-md"
      placeholder={placeholder}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="search"
    />
  );
}
