import React from 'react';

class Dinner extends React.Component {
    render() {
        return(
            <div id="Dinner">
                <h4>Dinner</h4>
                <ul>
                    <li>{this.props.recipe.name}</li>
                </ul>
            </div>
        )
    }
}

export default Dinner