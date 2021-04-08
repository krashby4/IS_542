import React from 'react';
import DayOfWeek from './components/DayOfWeek';
import Recipes from './Recipes';
import Breakfast from './components/Breakfast';
import Lunch from './components/Lunch';
import Dinner from './components/Dinner';
import NewRecipeDashboard from './components/NewRecipeDashboard';


class App extends React.Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        return(
            <div id="allContent">
                <h1 id="menuTitle">Ashby Home Menu</h1>
                <div id="weekLayout">
                    <DayOfWeek key={1} weekDay="Sunday"/>
                    <DayOfWeek key={2} weekDay="Monday"/>
                    <DayOfWeek key={3} weekDay="Tuesday"/>
                    <DayOfWeek key={4} weekDay="Wednesday"/>
                    <DayOfWeek key={5} weekDay="Thursday"/>
                    <DayOfWeek key={6} weekDay="Friday"/>
                    <DayOfWeek key={7} weekDay="Saturday"/>
                </div>
                <NewRecipeDashboard />
            </div>
        )
    }
}

export default App