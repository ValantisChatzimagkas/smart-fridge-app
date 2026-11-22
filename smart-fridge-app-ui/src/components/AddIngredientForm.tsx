import { useState } from "react";
import { Plus, X } from "lucide-react";
import { BASE_URL } from "../constants";
import { FoodCategoryTagsOptions, QuantityUnitOptions } from "./IngredientCard";

interface AddIngredientFormProps {
  onCreated: () => void;
}

const emptyForm = {
  name: "",
  value: "1",
  unit: QuantityUnitOptions.PIECES,
  expiryDate: "",
  openedDate: "",
  tags: [] as FoodCategoryTagsOptions[],
};

const inputClass = "text-black p-1 rounded w-full";

const AddIngredientForm = ({ onCreated }: AddIngredientFormProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setError(null);
  };

  const toggleTag = (tag: FoodCategoryTagsOptions) =>
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          quantity: { value: Number(form.value), unit: form.unit },
          expiryDate: form.expiryDate,
          openedDate: form.openedDate || null,
          tags: form.tags,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add ingredient");
      }
      setForm(emptyForm);
      setOpen(false);
      onCreated();
    } catch (err) {
      console.error(err);
      setError("Could not add the ingredient. Please check the fields and try again.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
        title="Add ingredient"
      >
        <Plus className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-4 relative text-white space-y-3"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">Add ingredient</h2>

            <label className="block">
              Name
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <div className="flex gap-2">
              <label className="block flex-1">
                Quantity
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </label>
              <label className="block flex-1">
                Unit
                <select
                  className={inputClass}
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value as QuantityUnitOptions })}
                >
                  {Object.values(QuantityUnitOptions).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <label className="block flex-1">
                Expiry date
                <input
                  className={inputClass}
                  type="date"
                  required
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                />
              </label>
              <label className="block flex-1">
                Opened date (optional)
                <input
                  className={inputClass}
                  type="date"
                  value={form.openedDate}
                  onChange={(e) => setForm({ ...form, openedDate: e.target.value })}
                />
              </label>
            </div>

            <div>
              <p>Tags (optional)</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {Object.values(FoodCategoryTagsOptions).map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 rounded text-sm hover:ring-2 hover:ring-white/70 ${
                      form.tags.includes(tag) ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button type="submit" className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700">
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddIngredientForm;
