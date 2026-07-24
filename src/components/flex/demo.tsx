import React from "react";
import { Flex, FlexItem } from "./index";

export default function FlexDemo() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Flex Component Demo</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Basic Flex Row with Gap</h2>
        <Flex gap={4} className="border p-4 rounded">
          <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white">1</div>
          <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white">2</div>
          <div className="w-16 h-16 bg-red-500 rounded flex items-center justify-center text-white">3</div>
        </Flex>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Flex Column with Center Alignment</h2>
        <Flex direction="col" align="center" gap={3} className="border p-4 rounded h-64">
          <div className="w-16 h-12 bg-blue-500 rounded flex items-center justify-center text-white">1</div>
          <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white">2</div>
          <div className="w-16 h-20 bg-red-500 rounded flex items-center justify-center text-white">3</div>
        </Flex>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Flex with FlexItem Controls</h2>
        <Flex gap={2} className="border p-4 rounded">
          <FlexItem grow={0} className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white">
            Fixed
          </FlexItem>
          <FlexItem grow={1} className="h-16 bg-green-500 rounded flex items-center justify-center text-white">
            Grow
          </FlexItem>
          <FlexItem basis="1/4" className="h-16 bg-red-500 rounded flex items-center justify-center text-white">
            1/4
          </FlexItem>
        </Flex>
      </section>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Justify Content Examples</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Justify Between</p>
            <Flex justify="between" className="border p-4 rounded">
              <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white">1</div>
              <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white">2</div>
            </Flex>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Justify Center</p>
            <Flex justify="center" gap={4} className="border p-4 rounded">
              <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white">1</div>
              <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center text-white">2</div>
            </Flex>
          </div>
        </div>
      </section>
    </div>
  );
}