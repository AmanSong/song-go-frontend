import React from "react";
import { TextInput } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
}

export default function SearchBar({ value, onChangeText, onSubmitEditing }: SearchBarProps) {
  return (
    <TextInput
      className="w-11/12 h-12 bg-white rounded-full px-4 text-lg shadow-md"
      placeholder="Search from YouTube"
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      returnKeyType="search"
    />
  );
}
