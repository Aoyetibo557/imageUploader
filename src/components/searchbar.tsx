import React, { useState, useEffect } from "react";
import { Input } from "antd";

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchTerm }) => {
  const [inputVal, setInputVal] = useState<string>(searchTerm);

  useEffect(() => {
    setInputVal(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    onSearch(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputVal);
  };

  const handleClear = () => {
    setInputVal("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex md:justify-between space-x-4">
      <Input
        allowClear
        placeholder="Search images by name"
        style={{ width: "60vw", padding: 10 }}
        value={inputVal}
        onChange={handleInputChange}
        onClear={handleClear}
      />
    </form>
  );
};

export default SearchBar;
