import React, {Component} from 'react';
import Modal from './Modal';

class NewRecipeDashboard extends Component {
    constructor() {
        super();
        this.state = {
            show: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    }

    addIngredient() {
        document.getElementById("ingredientList").innerHTML += "<input type='text' className='ingredient'></input><br>"
    }

    saveRecipe() {
        let recipeIngredients = document.getElementsByClassName('ingredient').value
        console.log(recipeIngredients)
    }

    render() {
        return(
            <main>
                <h3>New Recipe</h3>
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <h4>Recipe Information</h4>
                    <label>Recipe Name: </label>
                    <input type="text"></input><br></br>
                    <label>Recipe URL: </label>
                    <input type="text"></input><br></br>
                    <form id="ingredientList">
                        <h4>Recipe Ingredients</h4>
                        <input type="text" className='ingredient'></input><br></br>
                    </form>
                    <button type="button" onClick={this.addIngredient}>Add ingredient</button><br></br>
                    <button type="button" onClick={this.saveRecipe}>Save recipe</button><br></br>
                </Modal>
                <button type="button" onClick={this.showModal}>Open</button>
            </main>
        );
    }
}

export default NewRecipeDashboard