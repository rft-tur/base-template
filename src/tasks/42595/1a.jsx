import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

function App() {
  const [persons, setPersons] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [newFood, setNewFood] = useState({ name: '', price: '', forPerson: '' });

  const addPerson = () => {
    if (newPerson) {
      setPersons([...persons, { name: newPerson, id: Date.now() }]);
      setNewPerson('');
    }
  };

  const removePerson = (id) => {
    setPersons(persons.filter(person => person.id !== id));
  };

  const addFoodItem = () => {
    if (newFood.name && newFood.price) {
      setFoodItems([...foodItems, { ...newFood, id: Date.now() }]);
      setNewFood({ name: '', price: '', forPerson: '' });
    }
  };

  const totalBill = foodItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
  const perPerson = totalBill / persons.length;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Bill Splitter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Persons Section */}
            <section>
              <h2 className="text-lg font-semibold">Add Persons</h2>
              <div className="flex gap-2">
                <Input 
                  value={newPerson} 
                  onChange={(e) => setNewPerson(e.target.value)} 
                  placeholder="Person's Name"
                />
                <Button onClick={addPerson}>Add</Button>
              </div>
              <ul className="mt-2">
                {persons.map(person => (
                  <li key={person.id} className="flex justify-between items-center">
                    <span>{person.name}</span>
                    <Button variant="destructive" onClick={() => removePerson(person.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Food Items Section */}
            <section>
              <h2 className="text-lg font-semibold">Add Food Items</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Input 
                  value={newFood.name} 
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})} 
                  placeholder="Food Name"
                />
                <Input 
                  value={newFood.price} 
                  onChange={(e) => setNewFood({...newFood, price: e.target.value})} 
                  placeholder="Price"
                  type="number"
                />
                <select 
                  value={newFood.forPerson} 
                  onChange={(e) => setNewFood({...newFood, forPerson: e.target.value})}
                  className="border p-2 rounded"
                >
                  <option value="">For All</option>
                  {persons.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <Button onClick={addFoodItem}>Add Item</Button>
              </div>
              <ul className="mt-2">
                {foodItems.map(item => (
                  <li key={item.id}>{item.name} - ${item.price} {item.forPerson && `(for ${item.forPerson})`}</li>
                ))}
              </ul>
            </section>

            {/* Bill Split Section */}
            <section>
              <h2 className="text-lg font-semibold">Bill Split</h2>
              <p>Total: ${totalBill.toFixed(2)}</p>
              <p>Each person pays: ${perPerson.toFixed(2)}</p>
              <div>
                {persons.map(person => (
                  <Dialog key={person.id}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mb-2">{person.name}'s Share</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{person.name}'s Bill</DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {foodItems.filter(item => item.forPerson === person.name || !item.forPerson).map(item => (
                          <div key={item.id}>{item.name}: ${item.price}</div>
                        ))}
                        <hr className="my-2" />
                        <div>Total: ${foodItems.reduce((sum, item) => 
                          (item.forPerson === person.name || !item.forPerson) ? sum + parseFloat(item.price || 0) : sum, 0).toFixed(2)}</div>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;