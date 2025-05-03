import React, { useState } from "react";

export enum IngredientStatus {
    EXPIRED = "expired",
    CLOSE_TO_EXPIRE = "close_to_expire",
    NOT_EXPIRED = "not_expired"
}

export enum QuantityUnitOptions {
    PIECES = "PIECES",
    KG = "KG"
}

export enum FoodCategoryTagsOptions {
    FRUITS = "Fruits",
    VEGETABLES = "Vegetables",
    MEAT = "Meat",
    FISH = "Fish",
    DAIRY = "Dairy",
    GRAINS = "Grains",
    LEGUMES = "Legumes",
    NUTS_SEEDS = "Nuts & Seeds",
    SWEETS = "Sweets",
    BEVERAGES = "Beverages",
    COOKED_MEALS = "Cooked Meals",
    SAUCES = "Sauces & Condiments",
    FROZEN = "Frozen",
    OTHER = "Other"
}

export interface IngredientCardProps {
    _id: string;
    name: string;
    quantity: { value: number; unit: QuantityUnitOptions };
    openedDate: string;
    expiryDate: string;
    status: IngredientStatus;
    tags: FoodCategoryTagsOptions[];
}

interface IngredientCardComponentProps {
    ingredient: IngredientCardProps;
    onDelete?: (id: string) => void;
}



const statusStyles = {
    [IngredientStatus.EXPIRED]: {
        bgColor: `bg-red-600/40`,
        label: "expired"
    },
    [IngredientStatus.CLOSE_TO_EXPIRE]: {
        bgColor: `bg-orange-600/40`,
        label: "close_to_expiring"  
    },
    [IngredientStatus.NOT_EXPIRED]: {
        bgColor: `bg-green-600/40`,
        label: "not_expired"
    }
};

const IngredientCard: React.FC<IngredientCardComponentProps> = ({ ingredient, onDelete }) => {
    const { bgColor } = statusStyles[ingredient.status] || statusStyles[IngredientStatus.EXPIRED];

    const [editMode, setEditMode] = useState(false);
    const [editedIngredient, setEditedIngredient] = useState<IngredientCardProps>(ingredient);
    const [isDeleted, setIsDeleted] = useState(false);

    const updateField = <K extends keyof IngredientCardProps>(key: K, value: IngredientCardProps[K]) => {
        setEditedIngredient((prev) => ({ ...prev, [key]: value }));
    };

    /**
     * Update quantity field
     * @param key key that will be updated
     * @param value value that will be assigned
     */
    const updateNestedQuantity = (key: keyof IngredientCardProps["quantity"], value: any) => {
        setEditedIngredient((prev) => ({
            ...prev,
            quantity: {
                ...prev.quantity,
                [key]: value
            }
        }));
    };

    /**
     * Adds clicked tags to the list of tags that will be included if the user clicks on save.
     * Additionally, this handler also changes the color of the clicked tags.
     * @param tag tag from supported tags
     */
    const handleTagToggle = (tag: FoodCategoryTagsOptions) => {
        setEditedIngredient((prev) => {
            // If tag is already selected, remove it
            if (prev.tags.includes(tag)) {
                return {
                    ...prev,
                    tags: prev.tags.filter(t => t !== tag)
                };
            }
            // Otherwise add it
            return {
                ...prev,
                tags: [...prev.tags, tag]
            };
        });
    };

    /**
     * Handler for save button actions, when save button is pressed, the edited data will be send via a path request
     * to the API for updating this object
     */
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/ingredient/ingredients/${editedIngredient._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editedIngredient)
            });

            if (!response.ok) {
                throw new Error("Failed to update ingredient");
            }

            setEditMode(false);
        } catch (error) {
            console.error(error);
            alert("An error occurred while updating the ingredient.");
        }
    };

    /**
     * Handle cancel button action, if it was clicked, exit edit mode
     */
    const handleCancel = () => {
        setEditedIngredient(ingredient);
        setEditMode(false);
    };

    /**
     * Handler that handles delete events from delete button
     */
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/ingredient/${editedIngredient._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete ingredient");
            }
            
            // Mark as deleted locally
            setIsDeleted(true);
            
            // Notify parent component about deletion
            if (onDelete) {
                onDelete(editedIngredient._id);
            }
            
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the ingredient.");
        }
    };

    // Don't render anything if the ingredient has been deleted
    if (isDeleted) {
        return null;
    }

    return (
        <div className={`ingredient-card p-4 rounded ${bgColor} text-white hover:scale-105 hover:ring-2 hover:ring-amber-100/40`}>
            <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">
                    {editMode ? (
                        <input
                            className="text-black p-1 rounded w-full"
                            type="text"
                            value={editedIngredient.name}
                            onChange={(e) => updateField("name", e.target.value)}
                        />
                    ) : (
                        editedIngredient.name
                    )}
                </h3>

                <div className="content space-y-1">
                    <p>
                        Expiry Status: <b>{editedIngredient.status}</b>
                    </p>

                    <p>
                        Quantity:
                        {editMode ? (
                            <div className="flex items-center space-x-2">
                                <p>Val:</p>
                                <input
                                    className="text-black p-1 rounded w-20"
                                    type="number"
                                    value={editedIngredient.quantity.value}
                                    onChange={(e) => updateNestedQuantity("value", Number(e.target.value))}
                                />
                                <p>U:</p>
                                <select
                                    className="text-black p-1 rounded w-32"
                                    value={editedIngredient.quantity.unit}
                                    onChange={(e) => updateNestedQuantity("unit", e.target.value as QuantityUnitOptions)}
                                >
                                    {Object.values(QuantityUnitOptions).map((unit) => (
                                        <option key={unit} value={unit}>
                                            {unit}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            ` ${editedIngredient.quantity.value} ${editedIngredient.quantity.unit}`
                        )}
                    </p>

                    <p>
                        Expiry Date:{" "}
                        {editMode ? (
                            <input
                                className="text-black p-1 rounded"
                                type="date"
                                value={editedIngredient.expiryDate}
                                onChange={(e) => updateField("expiryDate", e.target.value)}
                            />
                        ) : (
                            editedIngredient.expiryDate
                        )}
                    </p>

                    <p>
                        Opened Date:{" "}
                        {editMode ? (
                            <input
                                className="text-black p-1 rounded"
                                type="date"
                                value={editedIngredient.openedDate}
                                onChange={(e) => updateField("openedDate", e.target.value)}
                            />
                        ) : (
                            editedIngredient.openedDate
                        )}
                    </p>

                    <div>
                        <p>Tags:</p>
                        {editMode ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {Object.values(FoodCategoryTagsOptions).map((tag) => (
                                    <div 
                                        key={tag} 
                                        className={`cursor-pointer px-2 py-1 rounded text-sm hover:ring-2 hover:ring-white/70 ${
                                            editedIngredient.tags.includes(tag) 
                                                ? "bg-blue-600" 
                                                : "bg-gray-600"
                                        }`}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {editedIngredient.tags.map(tag => (
                                    <span key={tag} className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded font-semibold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 space-x-2">
                    {editMode ? (
                        <>
                            <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded font-semibold hover:ring-2 hover:ring-white/70" onClick={handleSave}>
                                Save
                            </button>
                            <button className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded font-semibold hover:ring-2 hover:ring-white/70" onClick={handleCancel}>
                                Cancel  
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="bg-yellow-500 hover:bg-yellow-700 px-3 py-1 rounded font-semibold hover:ring-2 hover:ring-white/70" onClick={() => setEditMode(true)}>
                                Edit
                            </button>
                            <button className="bg-red-500 hover:bg-red-700  px-3 py-1 rounded font-semibold hover:ring-2 hover:ring-white/70" onClick={handleDelete}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IngredientCard;