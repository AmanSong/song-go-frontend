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
      className="w-11/12 h-12 bg-white rounded-full px-4 text-lg shadow-md text-black"
      placeholder={placeholder}
      placeholderTextColor="#7C7D7D"
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="search"
    />
  );
}
