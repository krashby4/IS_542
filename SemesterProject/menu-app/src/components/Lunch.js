import React from 'react';

class Lunch extends React.Component {
    render() {
        return(
            <div id="lunch">
                <h4>Lunch</h4>
                <ul>
                    <li>{this.props.recipe.name}</li>
                </ul>
            </div>
        )
    }
}

export default Lunch