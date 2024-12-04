import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PersonForm = ({ addPerson }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addPerson(name);
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter person's name"
      />
      <Button type="submit">Add Person</Button>
    </form>
  );
};

const PersonList = ({ persons, removePerson }) => (
  <ul className="mt-4">
    {persons.map((person) => (
      <li key={person} className="flex justify-between items-center mb-2">
        {person}
        <Button variant="destructive" size="sm" onClick={() => removePerson(person)}>
          Remove
        </Button>
      </li>
    ))}
  </ul>
);

const FoodForm = ({ addFood, persons }) => {
  const [food, setFood] = useState({ name: "", price: "", for: "group" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (food.name && food.price) {
      addFood(food);
      setFood({ name: "", price: "", for: "group" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Input
        value={food.name}
        onChange={(e) => setFood({ ...food, name: e.target.value })}
        placeholder="Food item name"
      />
      <Input
        type="number"
        value={food.price}
        onChange={(e) => setFood({ ...food, price: e.target.value })}
        placeholder="Price"
      />
      <Select value={food.for} onValueChange={(value) => setFood({ ...food, for: value })}>
        <SelectTrigger>
          <SelectValue placeholder="For whom?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="group">Group</SelectItem>
          {persons.map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Add Food Item</Button>
    </form>
  );
};

const FoodList = ({ foods, removeFood }) => (
  <ul className="mt-4">
    {foods.map((food, index) => (
      <li key={index} className="flex justify-between items-center mb-2">
        {food.name} - ${food.price} (For: {food.for})
        <Button variant="destructive" size="sm" onClick={() => removeFood(food)}>
          Remove
        </Button>
      </li>
    ))}
  </ul>
);

const BillBreakdown = ({ person, foods }) => {
  const personalItems = foods.filter((food) => food.for === person);
  const groupItems = foods.filter((food) => food.for === "group");
  const groupTotal = groupItems.reduce((sum, food) => sum + parseFloat(food.price), 0);
  const personalTotal = personalItems.reduce((sum, food) => sum + parseFloat(food.price), 0);

  return (
    <div>
      <h3 className="font-bold mb-2">Personal Items:</h3>
      <ul>
        {personalItems.map((food, index) => (
          <li key={index}>
            {food.name}: ${food.price}
          </li>
        ))}
      </ul>
      <h3 className="font-bold mt-4 mb-2">Group Items Share:</h3>
      <ul>
        {groupItems.map((food, index) => (
          <li key={index}>
            {food.name}: ${(parseFloat(food.price) / foods.length).toFixed(2)}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-bold">
        Total: ${(personalTotal + groupTotal / foods.length).toFixed(2)}
      </p>
    </div>
  );
};

export default function App() {
  const [persons, setPersons] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const addPerson = (name) => setPersons([...persons, name]);
  const removePerson = (name) => {
    setPersons(persons.filter((p) => p !== name));
    setFoods(prev=>prev.filter(food=>food.for!=name))
  }
  const addFood = (food) => setFoods([...foods, food]);
  const removeFood = (food) => setFoods(foods.filter((f) => f.name !== food.name));

  const calculateBill = () => {
    const groupTotal = foods
      .filter((food) => food.for === "group")
      .reduce((sum, food) => sum + parseFloat(food.price), 0);
    const groupShare = groupTotal / persons.length;

    return persons.map((person) => {
      const personalTotal = foods
        .filter((food) => food.for === person)
        .reduce((sum, food) => sum + parseFloat(food.price), 0);
      return {
        name: person,
        total: (personalTotal + groupShare).toFixed(2),
      };
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Bill Splitter</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Persons</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonForm addPerson={addPerson} />
            <PersonList persons={persons} removePerson={removePerson} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Food Items</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodForm addFood={addFood} persons={persons} />
            <FoodList foods={foods} removeFood={removeFood} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Shared Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {calculateBill().map((bill) => (
              <li key={bill.name} className="mb-2">
                <Button
                  variant="link"
                  onClick={() => setSelectedPerson(bill.name)}
                >
                  {bill.name}: ${bill.total}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bill Breakdown for {selectedPerson}</DialogTitle>
          </DialogHeader>
          {selectedPerson && <BillBreakdown person={selectedPerson} foods={foods} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}