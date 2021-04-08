import React from 'react';

class Breakfast extends React.Component {
    render() { 
        return(
            <div id="breakfast">
                <h4>Breakfast</h4>
                <ul>
                    <li>{this.props.recipe.name}</li>
                </ul>
            </div>
        )
    }
}

export default Breakfast