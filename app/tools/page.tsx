"use client";

import { useState, useMemo } from "react";
import { tools, getAllCategories } from "@/lib/tool-registry";
import { ToolCard } from "@/components/tool-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getAllCategories();

  const filteredTools = useMemo(() => {
    let filtered = tools;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter((tool) => tool.category === selectedCategory);
    }
    
    return filtered;
  }, [search, selectedCategory]);

  const groupedTools = useMemo(() => {
    const grouped: Record<string, typeof tools> = {};
    filteredTools.forEach((tool) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  }, [filteredTools]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">All Tools</h1>
          <p className="text-muted-foreground">Browse and search through all {tools.length} available tools</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="search"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            onClick={() => setSelectedCategory(null)}
          >
            All ({tools.length})
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({tools.filter((t) => t.category === category).length})
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">
          {filteredTools.length} {filteredTools.length === 1 ? "tool" : "tools"}
          {search && ` matching "${search}"`}
          {selectedCategory && ` in ${selectedCategory}`}
        </h2>

        {Object.keys(groupedTools).length > 0 ? (
          Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                {category}
                <Badge variant="secondary">{categoryTools.length}</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No tools found</p>
            <p className="text-sm mt-2">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
