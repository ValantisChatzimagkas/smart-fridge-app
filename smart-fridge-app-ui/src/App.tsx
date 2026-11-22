import { useEffect, useState } from 'react'
import IngredientCard, { IngredientCardProps } from './components/IngredientCard'
import FilterToggle from './components/FiltersComponent';
import AddIngredientForm from './components/AddIngredientForm';
import { BASE_URL } from './constants';



function App() {

  const [ingredientsList, setIngredientsList] = useState<IngredientCardProps[]>([]);

  const fetchData = async () => {
    const ingredientsEndpoint = `${BASE_URL}/ingredients`
    const requestOptions = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    }
    
    try {
      const response = await fetch(ingredientsEndpoint, requestOptions)
      if (!response.ok) {
        throw new Error('Failed to fetch ingredients')
      }
      const data = await response.json()
      setIngredientsList(data || [])
    } catch (error) {
      console.error('Error fetching ingredients:', error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main>
      <div className='pattern'>
        <div className='wrapper'>
          <header>
            <h2>Smart Fridge App</h2>
          </header>


            <div>
              <div className='flex items-start gap-4'>
                <FilterToggle setIngredientsList={setIngredientsList} />
                <AddIngredientForm onCreated={fetchData} />
              </div>
            </div>


          <section className='all-ingredients mt-10'>
            <ul>
              {ingredientsList.map((ingredient) => (
                <IngredientCard key={ingredient._id} ingredient={ingredient} />
              ))}
            </ul>
          </section>
          
        </div>
      </div>
    </main>
  )
}

export default App