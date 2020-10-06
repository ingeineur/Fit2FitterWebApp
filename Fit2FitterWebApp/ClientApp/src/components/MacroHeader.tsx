import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Header } from 'semantic-ui-react'

interface IProps {
    meals: IMeal[];
    guides: IMacroGuides;
    update: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IMeal {
    carb: IMealDetails[];
    protein: IMealDetails[];
    fat: IMealDetails[];
    fruits: IMealDetails[];
    type: number;
}

interface IMealDetails {
    macro: number;
    mealDesc: string;
    check: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class MacroHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getColour = (total: number) => {
        if (total > 50.0 && total < 100) {
            return 'orange';
        }

        if (total === 100) {
            return 'teal';
        }

        if (total > 100.0) {
            return 'red';
        }

        return 'black';
    }

    render() {

        var divLabelStyle1 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'red'
        };

        var divLabelStyle2 = {
            color: '#0a0212',
            fontFamily: 'Comic Sans MS',
            backgroundColor: '#FF5E13'
        };

        var divLabelStyle3 = {
            color: '#0a0212',
            fontFamily: 'Comic Sans MS',
            backgroundColor: 'yellow'
        };

        var divLabelStyle4 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            fontSize: '20px'
        };

        var divLabelStyle5 = {
            color: '#0a0212',
            fontFamily: 'Comic Sans MS',
            backgroundColor: '#CE8B54'
        };

        if (this.state.updated !== this.props.update)
        {
            console.log('updating total values');
            this.setState({ updated: this.props.update });
        }

        const totalCarb = this.props.guides.carb - (this.props.meals.reduce(function (a, b) { return a + b.carb.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));
        const totalProtein = this.props.guides.protein - (this.props.meals.reduce(function (a, b) { return a + b.protein.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));
        const totalFat = this.props.guides.fat - (this.props.meals.reduce(function (a, b) { return a + b.fat.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));
        const totalVeg = this.props.guides.fruits - (this.props.meals.reduce(function (a, b) { return a + b.fruits.reduce(function (a, b) { return a + parseFloat(b.macro.toString()); }, 0); }, 0));

        return (
            <Grid centered>
                <Grid.Row columns={1} color='pink' textAlign='center'>
                    <a style={divLabelStyle4}>Total Remaining Macros</a>
                </Grid.Row>
                <Grid.Row columns={4} textAlign='center'>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Carb(g)</a></div>
                        <div style={divLabelStyle1}><a>{totalCarb.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Protein(g)</a></div>
                        <div style={divLabelStyle2}><a>{totalProtein.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Fat(g)</a></div>
                        <div style={divLabelStyle3}><a>{totalFat.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Serv</a></div>
                        <div style={divLabelStyle5}><a>{totalVeg}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MacroHeader);